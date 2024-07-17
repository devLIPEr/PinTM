
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
            createAlert(data['error'], 'danger');
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
    fetch("/user/login", {
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
            createAlert(data['error'], 'danger');
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
            createAlert(data['error'], 'danger');
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

// Função retirada do firebase.js e modificada para atender às novas particularidades do projeto
function authState(username){
    sessionStorage.setItem("username", username);
    document.querySelectorAll('.sepBar')[1].style = 'display: inherit;'
    document.querySelectorAll('.navButton')[0].style = 'display: inherit;'
    var login = document.querySelector('#headerLogin');
    if(login){
        login.removeAttribute('href');
        login.innerHTML = username;

        var dropDown = document.createElement("div");
        dropDown.setAttribute('class', "accountActions")
        var adminBtn = (sessionStorage.getItem("isAdmin") === 'true') ? "<button name = 'admBtn' class = 'accountActionsBtn' onclick = \"location.href='/admin/index'\">Administrador</button>" : "";
        dropDown.innerHTML = adminBtn+"<button name = 'aaBtn1' class = 'accountActionsBtn' onclick = \"location.href='../reposition/account'\">Minhas reposições</button><button name = 'aaBtn2' class = 'accountActionsBtn' onclick = \"location.href='/user/accountInfo'\">Minha conta</button><button name = 'aaBtn3' class = 'accountActionsBtn' onclick = \"logOut()\">Sair</button>";
        login.addEventListener("click", function(){
        if(!login.contains(dropDown)){
            login.parentElement.parentElement.appendChild(dropDown);
        }
        });
        document.addEventListener("click", function(event){
        if(event.target !== login && event.target !== dropDown && event.target !== dropDown.childNodes){
            if(login.parentElement.parentElement.contains(dropDown)){
            login.parentElement.parentElement.removeChild(dropDown);
            }
        }
        });
    }
}

async function verifyUser(){
    var username = sessionStorage.getItem("username");
    var isColorBlind = sessionStorage.getItem("isColorBlind");
    if(username == "null" || username === undefined || username == null){
        return await verifyToken();
    } else {
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
        // console.log(response)
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

function createAlert(message, type){
    var alertDiv = document.createElement("div");
    alertDiv.setAttribute("class", `alert alert-${type}`);
    alertDiv.innerText = message;
    setTimeout(() => {
        alertDiv.remove();
    }, 4500);
    document.querySelector(".alerts").append(alertDiv);
}