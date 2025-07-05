import express from "express";
import cors from "cors";

const port = process.env.PORT || 8088;

const app = express();

app.use(cors());
app.use(express.json());



app.get("/", (req, res) => {
    res.send("Server's running");
})


app.listen(port, () => {
    console.log(`Server started at ${port}`);
})


