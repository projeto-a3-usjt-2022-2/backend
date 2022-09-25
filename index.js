const express = require("express");

const app = express();

app.get("/", (req, res) => {
  console.log("App is running");

  return res.json({ message: "Hello world!" });
});

app.listen(8080);
