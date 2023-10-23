// Создаем express приложение
var express = require("express");
var app = express();
var db = require("./database.js");
var md5 = require("md5");
const urlencodedParser = express.urlencoded({ extended: false });

// Server port
var HTTP_PORT = 3000;

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Старт сервера
app.listen(HTTP_PORT, () => {
  console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT));
  console.log(`http://localhost:${HTTP_PORT}/`);
});

// Корневая точка
app.get("/", (req, res, next) => {
  //res.json({ message: "Ok" });
  let sql = "select * from books";
  let params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: EvalError.message });
    }
    res.render("index.hbs", {
      books: rows,
    });
  });
});

//Для проверки использовать http://localhost:3000/api/books/
app.get("/api/books", (req, res, next) => {
  let sql = "select * from books";
  let params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: EvalError.message });
    }
    res.json({
      message: "success",
      data: rows,
    });
  });
});

/*Берем конкретноую книгу*/
app.get("/api/books/:id", (req, res, next) => {
  let sql = "select * from book where id=?";
  let params = [req.params.id];
  /* Вместо all используем get так как хотим получить только одну строку*/
  db.get(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: EvalError.message });
    }
    res.json({
      message: "success",
      data: rows,
    });
  });
});

// возвращаем форму для добавления данных
app.get("/create", function (req, res) {
  res.render("create.hbs");
});

// получаем отправленные данные и добавляем их в БД
app.post("/create", urlencodedParser, function (req, res) {
  if (!req.body) return res.sendStatus(400);
  var data = {
    name: req.body.name,
    authors: req.body.authors,
    genre: req.body.genre,
    publish_date: req.body.publish_date,
    dsc: req.body.dsc,
    rating: req.body.rating,
    is_reading: req.body.is_reading,
  };
  console.log(data);

  var params = [
    data.name,
    data.authors,
    data.genre,
    data.publish_date,
    data.dsc,
    data.rating,
    data.is_reading,
  ];

  var sql =
    "INSERT INTO books (name, authors, genre, publish_date, dsc, rating, is_reading) VALUES (?,?,?,?,?,?,?)";

  db.run(sql, params, function (err, result) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.redirect("/");
  });
});

// получем id редактиремой книги, получаем его из бд и отправлям с формой редактирования
app.get("/edit/:id", function (req, res) {
  sql = "SELECT * FROM books WHERE id=?";
  params = [req.params.id];
  db.get(sql, params, (err, rows) => {
    if (err) return console.log(err);
    res.render("edit.hbs", {
      books: rows,
    });
  });
});

// получаем отредактированные данные и отправляем их в БД
app.post("/edit", urlencodedParser, function (req, res) {
  if (!req.body) return res.sendStatus(400);

  var data = {
    name: req.body.name,
    authors: req.body.authors,
    genre: req.body.genre,
    publish_date: req.body.publish_date,
    dsc: req.body.dsc,
    rating: req.body.rating,
    is_reading: req.body.is_reading,
    id: req.body.id,
  };
  db.run(
    `UPDATE books set 
         name = COALESCE(?,name), 
         authors = COALESCE(?,authors), 
         genre = COALESCE(?,genre),
         publish_date = COALESCE(?,publish_date),
         dsc = COALESCE(?,dsc),
         rating = coalesce(?,rating),
         is_reading = coalesce(?,is_reading)
         WHERE id = ?`,
    [
      data.name,
      data.authors,
      data.genre,
      data.publish_date,
      data.dsc,
      data.rating,
      data.is_reading,
      data.id,
    ],
    function (err, result) {
      if (err) {
        res.status(400).json({ error: res.message });
        return;
      }
      res.redirect("/");
    }
  );
});

// получаем id удаляемого пользователя и удаляем его из бд
app.post("/delete/:id", function (req, res) {
  db.run(
    "DELETE FROM books WHERE id = ?",
    req.params.id,
    function (err, result) {
      if (err) {
        res.status(400).json({ error: res.message });
        return;
      }
      res.redirect("/");
    }
  );
});

//Добавляем

/* app.post("/api/user/", (req, res, next) => {
  var errors = [];
  if (!req.body.password) {
    errors.push("No password specified");
  }
  if (!req.body.email) {
    errors.push("No email specified");
  }
  if (errors.length) {
    res.status(400).json({ error: errors.join(",") });
    return;
  }
  var data = {
    name: req.body.name,
    email: req.body.email,
    password: md5(req.body.password),
  };
  var sql = "INSERT INTO user (name, email, password) VALUES (?,?,?)";
  var params = [data.name, data.email, data.password];
  db.run(sql, params, function (err, result) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: data,
      id: this.lastID,
    });
  });
}); */

/* app.patch("/api/user/:id", (req, res, next) => {
  var data = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password ? md5(req.body.password) : null,
  };
  db.run(
    `UPDATE user set 
         name = COALESCE(?,name), 
         email = COALESCE(?,email), 
         password = COALESCE(?,password) 
         WHERE id = ?`,
    [data.name, data.email, data.password, req.params.id],
    function (err, result) {
      if (err) {
        res.status(400).json({ error: res.message });
        return;
      }
      res.json({
        message: "success",
        data: data,
        changes: this.changes,
      });
    }
  );
}); */

/* app.delete("/api/user/:id", (req, res, next) => {
  db.run(
    "DELETE FROM books WHERE id = ?",
    req.params.id,
    function (err, result) {
      if (err) {
        res.status(400).json({ error: res.message });
        return;
      }
      res.json({ message: "deleted", changes: this.changes });
    }
  );
}); */

// Default response for any other request
app.use(function (req, res) {
  res.status(404);
});
