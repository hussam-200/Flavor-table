const searchCon = document.getElementById("search-Container");
const ingredientInput = document.getElementById('ingredient-input');
const searchButton = document.getElementById("search-btn");
if (searchButton) {
    searchButton.addEventListener("click", search)
}
async function search() {
    let ingredient = ingredientInput.value.trim();
    if (!ingredient) {
        alert("please enter ingredients");
        return;
    }
    
    try {
        const response = await fetch(`/recipes/search?ingredients=${encodeURIComponent(ingredient)}`);
        const data = await response.json();
        searchCon.innerHTML = '';
        data.forEach(recipe => {
            if(ingredient!==recipe){
            searchCon.innerHTML += `
    <div class="recipe1">
                    <h2>${recipe.title}</h2>
                    <img src="${recipe.image}" alt="${recipe.title}" />
                    <p><strong>Used Ingredients:</strong> ${recipe.usedIngredients.join(', ')}</p>
                    <p><strong>Missing Ingredients:</strong> ${recipe.missedIngredients.join(', ')}</p>
                   <button class="add-favorite" 
                  data-id="${recipe.id}" 
                  data-title="${recipe.title}" 
                  data-image="${recipe.image}">
                  Add to Favorite
                </button></div>
                
    `;}
    else{
        alert("not fund")
    }
            document.querySelectorAll(".add-favorite").forEach(button => {
                button.addEventListener("click", function () {
                    const parse = {
                        id: this.dataset.id,
                        title: this.dataset.title,
                        image:this.dataset.image
                    }
                    let items = JSON.parse(localStorage.getItem("favoriteRecipes")) || [];
                    if (!items.find(i => i.id === parse.id)) {
                        items.push(parse);
                        localStorage.setItem("favoriteRecipes", JSON.stringify(items));

                    }
                    else {
                        alert("items already in favoarite list ")
                    }
                })
            })
        });

    } catch (error) {
        console.log(error)
    }

}