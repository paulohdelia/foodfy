module.exports = {
  list(req, res) {
    return res.render("admin/users/list.njk");
  },
  create(req, res) {
    return res.render("admin/users/create.njk");
  },
  post(req, res) {},
  put(req, res) {},
  delete(req, res) {},
};
