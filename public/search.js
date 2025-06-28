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
        const response = await fetch(`/api/recipes/recipes/search?ingredients=${encodeURIComponent(ingredient)}`);
        const data = await response.json();
        searchCon.innerHTML = '';
        data.forEach(recipe => {
            if (ingredient !== recipe) {
                searchCon.innerHTML += `
    <div class="recipe1">
                    <h2>${recipe.title}</h2>
                    <img src="${recipe.image}" alt="${recipe.title}" />
                    <p><strong>Used Ingredients:</strong> ${recipe.usedIngredients.join(', ')}</p>
                    <p><strong>Missing Ingredients:</strong> ${recipe.missedIngredients.join(', ')}</p>
                   <button class="add-favorite" 
                  data-id="${recipe.id}" 
                  data-title="${recipe.title}" 
                  data-image="${recipe.image}"
                  data-instructions="${recipe.instructions}"
                  data-ingredient="${recipe.ingredient}"
                data-readin="${recipe.readin}">
                  Add to Favorite
                </button></div>
                
    `;
            }
            else {
                alert("not fund")
            }
                document.querySelectorAll(".add-favorite").forEach(button => {
                    button.addEventListener("click", function () {
                        let item={
                            title:this.dataset.title,
                            image:this.dataset.image, 
                            instructions:this.dataset.instructions,
                            ingredient:this.dataset.ingredient,
                            readin:this.dataset.readin
                        }
                        if(item.readin===""||item.readin===null||item.readin===undefined){
                            item.readin=null;
                        }
                        else{
                            item.readin=Number(item.readin)
                        }
                        axios.post("/api/recipes/post",item)
                        .then(response=>{
                            console.log(response);
                            
                        })
                        .catch(error=>{
                            console.log(error);
                            
                        })

                })
            })
        });

    } catch (error) {
        console.log(error)
    }

}