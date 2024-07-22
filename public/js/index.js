function signUp(email, password, username, isColorBlind){
    fetch("/user/signup", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            email: email,
            password: password,
            isColorBlind: isColorBlind
        })
    })
    .then(response => response.json())
    .then((data) => {
        if(data['error']){
            createAlert('Erro. ', data['error'], 'red');
        }else{
            if(Object.keys(data).length){
                sessionStorage.setItem("isColorBlind", data.isColorBlind);
                sessionStorage.setItem("isAdmin", data.isAdmin);
                window.location.href = '../reposition/account';
            }
        }
    })
    .catch((err) => {
        console.error(err);
    });
}

function signIn(email, password){
    fetch("/user/signin", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    })
    .then(response => response.json())
    .then((data) => {
        if(data['error']){
            createAlert('Erro. ', data['error'], 'red');
        }else{
            if(Object.keys(data).length){
                sessionStorage.setItem("isColorBlind", data.isColorBlind);
                sessionStorage.setItem("isAdmin", data.isAdmin);
                window.location.href = '../reposition/account';
            }
        }
    })
    .catch((err) => {
        console.error(err);
    });
}

function resetPassword(password, email, code){
    let path = `/user/resetPassword/${email}/${code}`;
    fetch(path, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            password: password
        })
    })
    .then(response => response.json())
    .then((data) => {
        if(data['error']){
            createAlert('Erro. ', data['error'], 'red');
        }else{
            if(Object.keys(data).length){
                sessionStorage.setItem("isColorBlind", data.isColorBlind);
                window.location.href = '../reposition/account';
            }
        }
    })
    .catch((err) => {
        console.error(err);
    });
}

function dropdown(isAdmin){
    document.getElementById("dropdown").classList.toggle("hidden");
    if(isAdmin){
        document.getElementById("admin").classList.toggle("hidden");
    }
}

// Função retirada do firebase.js e modificada para atender às novas particularidades do projeto
function authState(username){
    sessionStorage.setItem("username", username);
    document.getElementById('headerConsulta').classList.toggle("hidden");
    var login = document.getElementById('headerLogin');
    if(login){
        login.removeAttribute('href');
        login.innerHTML = username;

        login.addEventListener("click", function(){
            dropdown(sessionStorage.getItem("isAdmin") === 'true');
        });

        document.addEventListener('click', (e) => {
            var dropDown = document.getElementById("dropdown");
            if(e.target.id != 'headerLogin' && !dropDown.classList.contains("hidden")){
                dropDown.classList.toggle("hidden");
                if(sessionStorage.getItem("isAdmin") === 'true'){
                    document.getElementById("admin").classList.toggle("hidden");
                }
            }
        });
    }
}

async function verifyUser(){
    var username = sessionStorage.getItem("username");
    var isColorBlind = sessionStorage.getItem("isColorBlind");
    console.log("isColorBlind:", isColorBlind);
    if(username == "null" || username === undefined || username == null){
        return await verifyToken();
    } else {
        // var isColorBlind = sessionStorage.getItem("isColorBlind");
        authState(username)
        return username;
    }
}

async function verifyToken(){
    return fetch("/user/verifyToken", {
        method: "GET",
        credentials : "include"
    }).then(response => {
        if(response.status === 403){
            return undefined;
        } else {
            return response.json();
        }
    }).then(username => {
        if(!(username === undefined)){
            authState(username);
            sessionStorage.setItem("debug", username);
            return username;
        } else {
            return undefined;
        }
    }).catch(error => console.log("Erro: ", error));
}

function logOut(){
    fetch('/user/deleteCookie', {
        method: 'GET',
        credentials: 'include'
    }).then(response => {
        console.log(response)
        sessionStorage.clear();
        window.location.href = "/";
    }).catch(error => console.log(error));
}

async function verifyAuthentication(){
    var user = await verifyUser();
    if(user === undefined){
        window.location.href = "/user/login"
    }
}

function createAlert(title, message, color){
    var alertDiv = document.createElement("div");
    var strong = document.createElement("strong");
    var span = document.createElement("span");

    alertDiv.setAttribute('class', `animate-fade w-fit bg-${color}-100 border border-${color}-400 text-${color}-700 px-4 py-3 rounded relative`);
    alertDiv.role = "alert";

    strong.setAttribute('class', "font-extrabold");
    strong.innerText = title;

    span.setAttribute('class', "block sm:inline");
    span.innerText = message;

    alertDiv.append(strong);
    alertDiv.append(span);

    setTimeout(() => {
        alertDiv.remove();
    }, 4500);
    document.getElementById("alerts").append(alertDiv);
}