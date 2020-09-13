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
  load(service, filter, files) {
    this.filter = filter;
    this.files = files;
    return this[service]();
  },
  removeFiles() {
    const files = this.files;
    deleteFiles(files);
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
