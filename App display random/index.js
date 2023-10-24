const express = require("express");
const app = express();
const hbs = require("hbs");
const port = 3000;

const data = {
  randomnumber: `${Math.random()}`,
};

//Указываем используемый шаблонизатор
app.set("view engine", "hbs");

app.get("/", (req, res) => {
  //res.send(`${Math.random()}`);

  res.render("forms/index.hbs", data);
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
