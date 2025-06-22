const container = document.getElementById("random-container");
const randomButton = document.getElementById("random");
if (randomButton) {
    randomButton.addEventListener("click", fechdata);
}

async function fechdata() {
    try {
        const response = await fetch("/recipes/random");
        const data = await response.json();

        container.innerHTML = '';
        data.forEach(recipe => {
            container.innerHTML += `
          <div class="recipe">
            <h2>${recipe.title}</h2>
            <img src="${recipe.image}"/>
            <div class="details" style="display: none;">
            <p><strong>Used Ingredients:</strong> ${recipe.instructions}</p>
            <p><strong>Missing Ingredients: </strong>${recipe.extendedIngredients.map(ingredient => ingredient.original).join(', ')}</p></div>
            
            <button 
                  class="add-favorite" 
                  data-id="${recipe.id}" 
                  data-title="${recipe.title}" 
                  data-image="${recipe.image}">
                  Add to Favorite
                </button>
                 
                <div id="info-button">
                <button class="toggle-details">Show Details</button>
                </div>
          </div>
        `;
        });
        document.addEventListener('click', function (event) {
  if (event.target.classList.contains('toggle-details')) {
    const card = event.target.closest('.recipe');
    const details = card.querySelector('.details');

    if (details.style.display === 'none') {
      details.style.display = 'block';
      event.target.textContent = 'Hide Details';
    } else {
      details.style.display = 'none';
      event.target.textContent = 'Show Details';
    }
  }
});
document.querySelectorAll(".add-favorite").forEach(button=>{
    button.addEventListener("click",function(){
        const items={
        id:this.dataset.id,
        title:this.dataset.title,
        image:this.dataset.image,
        };
   
    let favorite=JSON.parse(localStorage.getItem("favoriteRecipes"))||[];
    if(!favorite.find(i=>i.id===items.id)){
        favorite.push(items);
        localStorage.setItem("favoriteRecipes",JSON.stringify(favorite));
        
    }
    else{
        alert("this item already added to favorite recipes");
    } })
})

    


    } catch (error) {
        console.log(error);

    }
}

