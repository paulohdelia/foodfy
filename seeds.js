const { hash } = require("bcryptjs");

const User = require("./src/app/models/User");
const Chef = require("./src/app/models/Chef");
const File = require("./src/app/models/File");
const Recipe = require("./src/app/models/Recipe");

async function createFile({ name, path }) {
  const file = await File.create({ name, path });
  return file;
}

async function createUser({ name, email }) {
  const password = await hash("1111", 8);

  let user = {
    name,
    email,
    password,
  };

  const user_id = await User.create(user);
  return user_id;
}

async function createAdmin() {
  const password = await hash("1111", 8);

  const admin = {
    name: "adm",
    email: "admin@test.com",
    password,
    is_admin: true,
  };

  await User.create(admin);
}

async function createChef() {
  const file = await createFile({
    name: "Jacquin",
    path: "public/images-fake/jacquin.png",
  });

  const chef = {
    name: "Jacquin",
    file_id: file,
  };

  const chef_id = await Chef.create(chef);
  return chef_id;
}

async function createRecipes({ user_id, chef_id }) {
  const recipes = [
    {
      title: "Triplo bacon burger",
      ingredients: `{${[
        "3 kg de carne moída (escolha uma carne magra e macia)",
        "300 g de bacon moído",
        "1 ovo",
        "3 colheres (sopa) de farinha de trigo",
        "3 colheres (sopa) de tempero caseiro: feito com alho, sal, cebola, pimenta e cheiro verde processados no liquidificador",
        "30 ml de água gelada",
      ]}}`,
      preparation: `{${[
        "Misture todos os ingredientes muito bem e amasse para que fique tudo muito bem misturado.",
        "Faça porções de 90 g a 100 g.",
        "Forre um plástico molhado em uma bancada e modele os hambúrgueres utilizando um aro como base.",
        "Faça um de cada vez e retire o aro logo em seguida.",
        "Forre uma assadeira de metal com plástico, coloque os hambúrgueres e intercale camadas de carne e plásticos (sem apertar).",
        "Faça no máximo 4 camadas por forma e leve para congelar.",
        "Retire do congelador, frite ou asse e está pronto.",
      ]}}`,
      information:
        "Preaqueça a chapa, frigideira ou grelha por 10 minutos antes de levar os hambúrgueres.",
      user_id,
      chef_id,
    },
    {
      title: "Pizza 4 estações",
      ingredients: `{${[
        "1 xícara (chá) de leite",
        "1 ovo",
        "1 colher (chá) de sal",
        "1 colher (chá) de açúcar",
        "1 colher (sopa) de margarina",
        "1 e 1/2 xícara (chá) de farinha de trigo",
        "1 colher (sobremesa) de fermento em pó",
        "1/2 lata de molho de tomate",
        "250 g de mussarela ralada grossa",
        "2 tomates fatiados",
        "azeitona picada",
        "orégano a gosto",
      ]}}`,
      preparation: `{${[
        "No liquidificador bata o leite, o ovo, o sal, o açúcar, a margarina, a farinha de trigo e o fermento em pó até que tudo esteja encorporado.",
        "Despeje a massa em uma assadeira para pizza untada com margarina e leve ao forno preaquecido por 20 minutos.",
        "Retire do forno e despeje o molho de tomate.",
        "Cubra a massa com mussarela ralada, tomate e orégano a gosto.",
        "Leve novamente ao forno até derreter a mussarela.",
      ]}}`,
      information:
        "Pizza de liquidificador é uma receita deliciosa e supersimples de preparar.",
      user_id,
      chef_id,
    },
    {
      title: "Asinhas de frango ao barbecue",
      ingredients: `{${[
        "12 encontros de asinha de galinha, temperados a gosto",
        "2 colheres de sopa de farinha de trigo",
        "1/2 xícara (chá) de óleo",
        "1 xícara de molho barbecue",
      ]}}`,
      preparation: `{${[
        "Em uma tigela coloque o encontro de asinha de galinha e polvilhe a farinha de trigo e misture com as mãos.",
        "Em uma frigideira ou assador coloque o óleo quando estiver quente frite até ficarem douradas.",
        "Para servir fica bonito com salada, ou abuse da criatividade.",
      ]}}`,
      information: "",
      user_id,
      chef_id,
    },
    {
      title: "Lasanha mac n cheese",
      ingredients: `{${[
        "massa pronta de lasanha",
        "400 g de presunto",
        "400 g de mussarela ralada",
        "2 copos de requeijão",
        "150 g de mussarela para gratinar",
      ]}}`,
      preparation: `{${[
        "Em uma panela, coloque a manteiga para derreter.",
        "Acrescente a farinha de trigo e misture bem com auxílio de um fouet.",
        "Adicione o leite e misture até formar um creme homogêneo.",
        "Tempere com sal, pimenta e noz-moscada a gosto.",
        "Desligue o fogo e acrescente o creme de leite; misture bem e reserve.",
      ]}}`,
      information: "Recheie a lasanha com o que preferir.",
      chef_id,
      user_id,
    },
  ];
  const recipePromises = recipes.map((recipe) => Recipe.create(recipe));
  await Promise.all(recipePromises);
}

(async function init() {
  try {
    const paulo_id = await createUser({
      name: "Paulo",
      email: "paulo@test.com",
    });
    const maykao_id = await createUser({
      name: "Maykão",
      email: "maykao@test.com",
    });

    const chef_id = await createChef();
    await createRecipes({ chef_id, user_id: paulo_id });
    await createRecipes({ chef_id, user_id: maykao_id });

    await createAdmin();
  } catch (error) {
    console.error(error);
  }
})();
