import express from "express";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("hi")
});

app.listen(3000, () => {
  console.log("running server")
})

