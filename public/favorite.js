const favoriteContainer = document.getElementById("favorite-Item");
const deleteItem = document.getElementById("Delete");


function render() {
    favoriteContainer.innerHTML = '';
    let data = JSON.parse(localStorage.getItem("favoriteRecipes")) || [];

    data.forEach(element => {
        const li = document.createElement("li");
        li.innerHTML = `
    <div class="recipe2">
        <p>${element.id}</p>
            <h2>${element.title}</h2>
            <img src="${element.image}"/>
            
            <button 
                  class="delete" 
                  data-id="${element.id}" 
                  data-title="${element.title}" 
                  data-image="${element.image}">
                  Delete from favorite
                </button>
                
    `
        favoriteContainer.appendChild(li);
        document.querySelectorAll(".delete").forEach(element => {
            element.addEventListener("click", function () {
                const parse = {
                    id: this.dataset.id
                }
                let items = JSON.parse(localStorage.getItem("favoriteRecipes")) || [];
                items = items.filter(i => i.id != parse.id);
                localStorage.setItem("favoriteRecipes", JSON.stringify(items));
                location.reload();
            })

        })




    });
    console.log(data);



}

deleteItem.addEventListener("click", function () {
    const remove = localStorage.removeItem("favoriteRecipes");
    alert("all items removed from favorite recipes");
    location.reload();

})
render();