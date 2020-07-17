module.exports = {
  list(req, res) {
    return res.render("admin/users/list.njk");
  },
  create(req, res) {
    return res.render("admin/users/create.njk");
  },
  edit(req, res) {
    return res.render("admin/users/edit.njk");
  },
  post(req, res) {},
  put(req, res) {
    return res.json(req.body);
  },
  delete(req, res) {
    return res.send("delete");
  },
};
