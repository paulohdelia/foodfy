const faker = require("faker");
const { hash } = require("bcryptjs");

const { checkout } = require("./src/routes/public");

const User = require("./src/app/models/User");
const Chef = require("./src/app/models/Chef");
const File = require("./src/app/models/File");
const Recipe = require("./src/app/models/Recipe");
const { file } = require("./src/app/models/Chef");

let usersIds = [];

// Chef should have 4 images - ID 0 - 3
let totalChefs = 4;
let totalRecipes = 5;
let totalUsers = 3;

async function createUsers() {
  const users = [];
  const password = await hash("1111", 8);
  let is_admin = true;

  while (users.length < totalUsers) {
    users.push({
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password,
      is_admin,
    });
    is_admin = !is_admin;
  }

  const usersPromise = users.map(async (user) => await User.create(user));

  usersIds = await Promise.all(usersPromise);
}

function createChefs() {
  let chefs = [];
  let filesPromise = [];

  let file_id = 1;
  while (chefs.length < totalChefs) {
    chefs.push({
      file_id,
      name: faker.name.firstName(),
    });

    const name = `${file_id}.png`;
    const path = `public/images/${file_id}.png`;
    filesPromise.push(File.create({ name, path }));
    file_id++;
  }
  Promise.all(filesPromise).then(() => {
    const chefsPromise = chefs.map((chef) => Chef.create(chef));
    Promise.all(chefsPromise);
  });
}

(async function init() {
  await createUsers();
  await createChefs();
})();
