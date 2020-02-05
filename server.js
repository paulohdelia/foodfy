const express = require('express');
const nunjucks = require('nunjucks');

const server = express();
const recipes = require('./data');

server.use(express.static("public"));

server.set("view engine", "njk");

nunjucks.configure("views", {
    express: server, 
    autoescape: false,
    noCache: true
})

server.get("/", function(req, res){
    return res.render("home", { 
        items: recipes,
        banner: {
            image: "https://github.com/Rocketseat/bootcamp-launchbase-desafios-02/blob/master/layouts/assets/chef.png?raw=true",
            image_alt: "Desenho de um chef de cozinha"   
        },
    });
});

server.get("/about", function(req, res){
    return res.render("about", { link_style: "about" });
});

server.get("/recipes", function(req, res){
    return res.render("recipes", { items: recipes, link_style: "recipes"});
});



server.listen(5000, function(){
    console.log("server is running");
})