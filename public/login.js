const form = document.getElementById("login-form");
form.addEventListener('submit', function (event) {
    event.preventDefault();
    item = {
        username: form.querySelector('input[name=username]').value,
        email: form.querySelector('input[name=email]').value,
        password: form.querySelector('input[name=password]').value
    }

    // axios.post("/api/auth/login",item)
    // .then(response=>{
    //     console.log(response);
    //     window.

    // })
    // .catch(error=>{
    //     console.log(error);

    // });
    fetch("/api/auth/login",
        {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
        }
    )
        .then(async response => {
            if (!response.ok) {
                let message = await response.text();
                alert(response.statusText + " " + message);
                return;
            }
            const data =await response.json();

            const token = data.token;

            localStorage.setItem('token', token)
            console.log(token);
            

            window.location.href = "/index.html";
        })
        .catch(error => {
            console.log(error);
        })

});
const data=localStorage.getItem('token')
if(data){
    console.log(data);
    
fetch("/api/user/profile",
    {
        method:"GET",
        headers:{
            "Authorization":`Bearer ${data}`
        }
    }
    .then(response=>{console.log(response);
    })
    .then(data=>{console.log(data);
    })
    .catch(error=>{console.log(error);
    })  
)
}
else{
    alert("plz create new account")
}