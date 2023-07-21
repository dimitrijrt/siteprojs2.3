const form = document.querySelector("form");
const errormessage = document.querySelector(".errormsg");
const log = document.querySelector('.login');

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    let user = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    };

    // POST REQUEST
    let response = await fetch("http://localhost:5678/api/users/login", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(user)
    });

    let result = await response.json();
    
    
    if (response.status === 200) {
        window.localStorage.setItem('accessToken', result.token);
        window.location.href = './index.html';
        
      } else if (response.status === 401 || 404) {
        errormessage.style.display = "block";
      };
  


   
    
});


