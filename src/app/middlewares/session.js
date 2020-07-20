function isUser(req, res, next) {
  if (!req.session.userId) {
    return res.redirect("/session/login");
  }
  next();
}

function isLoggedRedirectToUsers(req, res, next) {
  if (req.session.userId) {
    return res.redirect("/users");
  }

  next();
}

module.exports = {
  isUser,
  isLoggedRedirectToUsers,
};
