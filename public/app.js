
const container = document.getElementById("random-container");
const randomButton = document.getElementById("random");
if (randomButton) {
  randomButton.addEventListener("click", fetchdata);
}

async function fetchdata() {
  try {
    const response = await fetch("/api/recipes/recipes/random");
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
  data-image="${recipe.image}"
  data-instructions="${recipe.instructions}"
  data-ingredients='${JSON.stringify(recipe.extendedIngredients)}'
  data-readin="${recipe.readin || ''}">
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
    document.querySelectorAll(".add-favorite").forEach(button => {
      button.addEventListener("click", function () {
        const items = {
          title: this.dataset.title,
          image: this.dataset.image,
          instructions: this.dataset.instructions,
          ingredients: JSON.parse(this.dataset.ingredients),
          readin: this.dataset.readin
        };
        if(items.readin===""||items.readin===null||items.readin===undefined){
          readin=null;
        }else{
          readin=Number(readin);
        }
        fetch("/api/recipes/post", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(items)
        })
          .then(response => {
            if (!response.ok) {
              throw new Error(response.statusText);

            }
            return response.json();
          }).then(data => {
            console.log("Recipe added:", data);
          })
          .catch(error => {
            console.log(error);
          })


      })
    })
  } catch (error) {
    console.log(error);

  }
}

