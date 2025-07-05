const form = document.getElementById("add-account-form");
form.addEventListener('submit', function (event) {
    event.preventDefault();
    item = {
        username: form.querySelector('input[name=username]').value,
        email: form.querySelector('input[name=email]').value,
        password: form.querySelector('input[name=password]').value
    }
    axios.post("/api/auth/register", item)
        .then(response => {
            alert("your account created  ")
            window.location.href = "index.html"

        })
        .catch(error => {
            if (error.response && error.response.data) {
                alert(error.response.data); 
            } else {
                alert("Unexpected error");
            }

        });


})