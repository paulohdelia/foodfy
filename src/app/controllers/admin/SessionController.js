module.exports = {
  loginForm(req, res) {
    return res.render("session/login");
  },
  forgotForm(req, res) {
    return res.render("session/forgot-password");
  },
};
