const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const db = require("./db");

module.exports = session({
  store: new pgSession({
    pool: db,
  }),
  secret: "secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 30,
  },
});
