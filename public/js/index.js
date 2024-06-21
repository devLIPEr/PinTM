function setUI(data){
    console.log(data);
    /**
     * data = {
     *      username: string,
     *      isColorBlind: bool
     * }
     **/ 
    // set interface based on user
}

function signUp(email, password, username, isColorBlind = false){
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
        setUI(data);
        if(Object.keys(data).length){
            window.location.href = '/user/account';
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
        setUI(data);
        if(Object.keys(data).length){
            window.location.href = '/user/account';
        }
    })
    .catch((err) => {
        console.error(err);
    });
}

function resetPassword(id, password){
    fetch(`/user/resetPassword/${id}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            password: password
        })
    })
    .then((response) => {
      if (response.redirected) {
        window.location.href = response.url;
      }
    })
    .catch((err) => {
        console.error(err);
    });
}



// Função retirada do firebase.js e modificada para atender às novas particularidades do projeto
function authState(username){
    document.querySelectorAll('.sepBar')[1].style = 'display: inherit;'
    document.querySelectorAll('.navButton')[0].style = 'display: inherit;'
    var login = document.querySelector('#headerLogin');
    if(login){
        login.removeAttribute('href');
        login.innerHTML = username;

        var dropDown = document.createElement("div");
        dropDown.setAttribute('class', "accountActions")
        dropDown.innerHTML = "<button name = 'aaBtn1' class = 'accountActionsBtn' onclick = \"location.href='/user/account'\">Minhas reposições</button><button name = 'aaBtn2' class = 'accountActionsBtn' onclick = \"location.href='/user/accountInfo'\">Minha conta</button><button name = 'aaBtn3' class = 'accountActionsBtn' onclick = \"logOut()\">Sair</button>";
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

function verifyToken(){
    fetch("/user/verifyToken", {
        method: "POST",
        credentials : "include"
    }).then(response => {
        if(response.status === 403){
            console.log("Token inválido");
            return undefined;
        } else {
            return response.json();
        }
    }).then(username => {
        if(!(username === undefined)){
            authState(username);
        }
    }).catch(error => console.log("Erro: ", error));
}