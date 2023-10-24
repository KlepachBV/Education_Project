let sqlite3 = require("sqlite3").verbose();

const DBSOURCE = "./db.sqlite";

let db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    // Cannot open database
    console.error(err.message);
    throw err;
  } else {
    console.log("Connected to the SQLite database.");
    db.run(
      `CREATE TABLE books (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text, 
            authors text,
            genre text,
            publish_date text,
            dsc text,
            rating real,
            is_reading Integer
            )`,
      (err) => {
        if (err) {
          // Table already created
        } else {
          // Table just created, creating some rows
          let insert =
            "INSERT INTO books (name, authors, genre, publish_date, dsc, rating, is_reading) VALUES (?,?,?,?,?,?,?)";
          db.run(insert, [
            "Foundation",
            "Isaac Asimov",
            "Science fiction",
            "1942",
            "Восторг!",
            5.0,
            1,
          ]);
          db.run(insert, [
            "Gentle Introduction To Haskell",
            "Paul Hudak, John Peterson. Joseph Fase",
            "Programming",
            "2000",
            "Сложно",
            4.0,
            1,
          ]);
        }
      }
    );
  }
});

module.exports = db;
