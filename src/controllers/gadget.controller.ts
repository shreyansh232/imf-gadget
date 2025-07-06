import { Request, Response, RequestHandler } from "express";
import "dotenv/config";
import db from "../config/db";

// Helper function to generate random codenames
const generateCodename = (): string => {
  const adjectives = ["The", "Agent", "Project", "Operation"];
  const nouns = [
    "Nightingale",
    "Kraken",
    "Phoenix",
    "Viper",
    "Falcon",
    "Raven",
    "Cobra",
    "Wolf",
    "Tiger",
    "Dragon",
    "Shadow",
    "Thunder",
    "Lightning",
    "Storm",
    "Blaze",
    "Frost",
    "Steel",
    "Diamond",
    "Phantom",
    "Ghost",
  ];

  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)]; //Picks a random adjective from the adjective array
  const noun = nouns[Math.floor(Math.random() * nouns.length)]; //Picks a random noun from the nouns array

  return `${adjective} ${noun}`; //returns a random unique codename
};

// Helper function to generate confirmation code
const generateConfirmationCode = (): string => {
  return Math.random().toString(36).substr(2, 8).toUpperCase();
};

//Fetch all gadgets if no query parameters else fetch the one that matches the status
export const getGadgets: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { status } = req.query;

    let query = `
            SELECT g.*, u.email as creator_email 
            FROM gadgets g 
            LEFT JOIN users u ON g."createdById" = u.id
        `;
    let params: any[] = [];

    //If status then add WHERE clause in the query and add status in the params
    if (status) {
      query += " WHERE g.status = $1";
      params.push(status);
    }
    //else just order by descending
    query += ' ORDER BY g."createdAt" DESC';

    const result = await db.query(query, params);
    console.log(result);

    // Add random mission success probability to each gadget
    const gadgetsWithProbability = result.rows.map((gadget) => ({
      ...gadget,
      missionSuccessProbability: Math.floor(Math.random() * 31) + 70, // 70-100%
    }));

    res.json({
      message: "Gadgets retrieved successfully",
      count: gadgetsWithProbability.length,
      gadgets: gadgetsWithProbability,
    });
  } catch (error) {
    console.error("Get gadgets error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createGadget: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { name, description, status = "Available" } = req.body;
    const userId = (req as any).user?.userId; // Assuming auth middleware sets this

    if (!name) {
      res.status(400).json({ message: "Gadget name is required" });
      return;
    }

    if (!userId) {
      res.status(401).json({ message: "User authentication required" });
      return;
    }

    let codename = generateCodename();
    let attempts = 0;

    // Ensure unique codename
    while (attempts < 10) {
      const existingCodename = await db.query(
        "SELECT id FROM gadgets WHERE codename = $1",
        [codename]
      );
      if (existingCodename.rows.length === 0) break;
      codename = generateCodename();
      attempts++;
    }

    const result = await db.query(
      `INSERT INTO gadgets (id, name, codename, description, status, "createdById", "createdAt", "updatedAt") 
             VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW(), NOW()) 
             RETURNING id, name, codename, description, status, "createdAt", "updatedAt"`,
      [name, codename, description, status, userId]
    );

    const gadget = result.rows[0];

    res.status(201).json({
      message: "Gadget created successfully",
      gadget: {
        ...gadget,
        missionSuccessProbability: Math.floor(Math.random() * 31) + 70,
      },
    });
  } catch (error) {
    console.error("Create gadget error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateGadget: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { name, description, status } = req.body;

    // Check if gadget exists
    const existingGadget = await db.query(
      "SELECT * FROM gadgets WHERE id = $1",
      [id]
    );
    if (existingGadget.rows.length === 0) {
      res.status(404).json({ message: "Gadget not found" });
      return;
    }

    // Build dynamic update query
    const updates = [];
    const params = [];
    let paramCount = 1;

    if (name) {
      updates.push(`name = $${paramCount}`);
      params.push(name);
      paramCount++;
    }

    if (description !== undefined) {
      updates.push(`description = $${paramCount}`);
      params.push(description);
      paramCount++;
    }

    if (status) {
      updates.push(`status = $${paramCount}`);
      params.push(status);
      paramCount++;
    }

    if (updates.length === 0) {
      res.status(400).json({ message: "No fields to update" });
      return;
    }

    updates.push(`"updatedAt" = NOW()`);
    params.push(id);

    const query = `UPDATE gadgets SET ${updates.join(", ")} WHERE id = $${paramCount} RETURNING *`;

    const result = await db.query(query, params);
    const updatedGadget = result.rows[0];

    res.json({
      message: "Gadget updated successfully",
      gadget: {
        ...updatedGadget,
        missionSuccessProbability: Math.floor(Math.random() * 31) + 70,
      },
    });
  } catch (error) {
    console.error("Update gadget error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteGadget: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    // Check if gadget exists
    const existingGadget = await db.query(
      "SELECT * FROM gadgets WHERE id = $1",
      [id]
    );
    if (existingGadget.rows.length === 0) {
      res.status(404).json({ message: "Gadget not found" });
      return;
    }

    // Mark as decommissioned instead of deleting
    const result = await db.query(
      `UPDATE gadgets 
             SET status = 'Decommissioned', 
                 "decommissionedAt" = NOW(), 
                 "updatedAt" = NOW() 
             WHERE id = $1 
             RETURNING *`,
      [id]
    );

    const decommissionedGadget = result.rows[0];

    res.json({
      message: "Gadget decommissioned successfully",
      gadget: decommissionedGadget,
    });
  } catch (error) {
    console.error("Delete gadget error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const selfDestruct: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { confirmationCode } = req.body;

    // Check if gadget exists
    const existingGadget = await db.query(
      "SELECT * FROM gadgets WHERE id = $1",
      [id]
    );
    if (existingGadget.rows.length === 0) {
      res.status(404).json({ message: "Gadget not found" });
      return;
    }

    const gadget = existingGadget.rows[0];

    // Check if already destroyed
    if (gadget.status === "Destroyed") {
      res.status(400).json({ message: "Gadget already destroyed" });
      return;
    }

    // Generate and validate confirmation code
    const expectedCode = generateConfirmationCode();

    if (!confirmationCode) {
      res.status(400).json({
        message: "Confirmation code required for self-destruct sequence",
        confirmationCode: expectedCode,
        warning: "This code will be required to proceed with destruction",
      });
      return;
    }

    //Accept any 8-character alphanumeric code for this
    if (!/^[A-Z0-9]{8}$/.test(confirmationCode)) {
      res.status(400).json({
        message:
          "Invalid confirmation code format. Expected 8 alphanumeric characters.",
      });
      return;
    }

    // Destroy the gadget
    const result = await db.query(
      `UPDATE gadgets 
             SET status = 'Destroyed', 
                 "updatedAt" = NOW() 
             WHERE id = $1 
             RETURNING *`,
      [id]
    );

    const destroyedGadget = result.rows[0];

    res.json({
      message: `Self-destruct sequence completed for ${destroyedGadget.codename}`,
      gadget: destroyedGadget,
      destructionTime: new Date().toISOString(),
      confirmationCode: confirmationCode,
    });
  } catch (error) {
    console.error("Self-destruct error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
