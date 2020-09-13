const { unlinkSync } = require("fs");

const Recipe = require("../models/Recipe");
const File = require("../models/File");

function deleteFiles(files) {
  files.forEach(async (file) => {
    try {
      unlinkSync(file.path);
      await File.delete(file.id);
    } catch (err) {
      console.error(err);
    }
  });
}

const LoadService = {
  load(service, filter) {
    this.filter = filter;
    return this[service]();
  },
  async chef() {},
  async recipe() {
    const files = await Recipe.files(this.filter);
    if (files.length > 0) {
      deleteFiles(files);
    }
  },
};

module.exports = LoadService;
