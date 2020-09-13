Projeto desenvolvido para o Bootcamp Launchbase da Rocketseat 🚀

<p>
  <a href="https://www.linkedin.com/in/paulodelia/">
      <img alt="Paulo D'Elia" src="https://img.shields.io/badge/-paulodelia-important?style=flat&logo=Linkedin&logoColor=white" />
   </a>
  <a href="https://github.com/paulohdelia/foodfy/commits/master">
    <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/paulohdelia/foodfy?color=important">
  </a> 
  <img src="https://img.shields.io/github/languages/count/paulohdelia/foodfy?color=important&style=flat-square">
</p>

# :construction_worker: Como rodar

## 📦 Prepare o app para rodar

```bash
# Clone o Repositório
$ git clone https://github.com/paulohdelia/foodfy.git

# Acesse a pasta do projeto
$ cd foodfy

# Instale as dependências
$ npm install
```

Crie um arquivo **.env** na raíz do projeto.

A estrutura deve seguir o arquivo **.env.example**, sendo preenchido com as informações para conexão com banco de dados e com o servidor de envio de email

```bash
# Preencha o banco de dados rodando o arquivo de seeds
$ npm run seeds
```

**OBS:** _Não rode as seeds mais de uma vez, pois o banco de dados está configurado para não receber **emails repetidos**. Portanto, se a seed for rodada mais de uma vez acontecerá um erro indicando que aqueles emails já estão cadastrados_

## 💻 Rode o Projeto

```bash
$ npm start
```

Acesse: http://localhost:5000/ para ver o resultado.

## :exclamation: Importante

### Login com usuários na área de administração

O arquivo de **seeds** gera 3 usuários, 8 receitas (4 para cada usuário comum) e 1 chef.

Usuários comuns: { paulo@test.com, maykao@test.com }.

Usuário administrador: { admin@test.com }. O administrador poderá criar, ver, editar, excluir todas as receitas, chefs e usuários(exceto ele próprio).

A senha para acessá-los é **1111**

A rota de acesso para o **login** é qualquer uma que tenha **/admin** no começo: "localhost:5000/admin", "localhost:5000/admin/recipes"...
