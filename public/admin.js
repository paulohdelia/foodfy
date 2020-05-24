function addIngredient() {
    const ingredients = document.querySelector("#ingredients");
    const inputIngredient = document.querySelectorAll(".ingredient");

    const newField = inputIngredient[inputIngredient.length - 1].cloneNode(true);

    if(newField.children[0].value == "") return false;

    newField.children[0].value="";

    ingredients.appendChild(newField);
}

function addSteps() {
    const preparation = document.querySelector("#preparation");
    const step = document.querySelectorAll(".step");

    const newField = step[step.length - 1].cloneNode(true);

    if(newField.children[0].value == "") return false;

    newField.children[0].value="";

    preparation.appendChild(newField);
}