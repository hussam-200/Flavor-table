const favoriteContainer = document.getElementById("favorite-Item");
const deleteItem = document.getElementById("Delete");


async function render() {
    favoriteContainer.innerHTML = '';
    const response = await fetch("/api/recipes/all");
    const data = await response.json();
    data.forEach(element => {
        const li = document.createElement("li");
        li.innerHTML = `
    <div class="recipe2">
        <p>${element.id}</p>
            <h2>${element.title}</h2>
            <img src="${element.image}"
            <p>${element.instructions}</p>
            <p>${element.readin}</p>
            />
            
            <button 
                  class="delete" 
                  data-id="${element.id}" 
                  data-title="${element.title}" 
                  data-image="${element.image}">
                  Delete from favorite
                </button>

                 <button class="edit">edit</button>
<form class="edit-form" data-id="${element.id}"  style="display:none;">
  <label><strong>Title: </strong><input type="text" name="title" ></label><br>
<label><strong>Image:</strong> <input type="text" name="image" ></label><br>
<label><strong>Ingredients:</strong> <input type="text" name="ingredients"></label><br>
<label><strong>Instructions:</strong> <input type="text" name="instructions"></label><br>
<label><strong>Readin:</strong> <input type="number" name="readin"></label><br>
<button type="submit" name="save">Save</button>
</form>
                
    `
        favoriteContainer.appendChild(li);
    });

    document.querySelectorAll(".delete").forEach(element => {
        element.addEventListener("click", function () {
            const id = this.dataset.id;
            fetch(`/api/recipes/delete/${id}`, {
                method: "DELETE",
            })
                .then(response => {
                    if (!response.ok) {
                        console.log("its not work ");

                    }
                    return response.json();
                })
                .then(data => {
                    console.log(data);
                    this.closest("li").remove();
                })
                .catch(error => {
                    console.log(error);

                })
        })

    })
    document.querySelectorAll(".edit").forEach(button => {
        button.addEventListener("click", function () {
            const form = this.nextElementSibling;
            form.style.display = form.style.display === 'none' ? 'block' : 'none';

        })


    })
    document.querySelectorAll(".edit-form").forEach(element => {
        element.addEventListener("submit", function (e) {
            e.preventDefault();

            const form = this.closest('.edit-form');
            let ingredientsRaw = form.querySelector('input[name="ingredients"]').value;
            let ingredients = ingredientsRaw.split(',');
            let items = {
                title: form.querySelector('input[name="title"]').value,
                image: form.querySelector('input[name="image"]').value,
                instructions: form.querySelector('input[name="instructions"]').value,
                ingredients: ingredients, // now an array!
                readin: form.querySelector('input[name="readin"]').value
            };
            const id = form.dataset.id;

            if (items.readin === null || items.readin === "" || items.readin === undefined) {
                items.readin = null;
            }
            else {
                items.readin = Number(items.readin)
            }
            console.log("Sending to backend:", items);
            axios.put(`/api/recipes/put/${id}`, items, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    console.log(response);
                    window.location.reload();
                })
                .catch(error => {
                    console.log(error);

                })




        })
    })






}
deleteItem.addEventListener("click", function () {
    fetch("/api/recipes/delete/all", {
        method: "DELETE",
    })
        .then(response => {
            if (!response.ok) {
                console.log("the response not work ");

            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            render();
        })
        .catch(error => {
            console.log("Delete all error", error);
        })

})

render();