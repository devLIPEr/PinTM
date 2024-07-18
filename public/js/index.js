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
            alert(data['error']);
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
            alert(data['error']);
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
            alert(data['error']);
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
/*
<script type = "module">
    import { atualizarNomeUsuario, auth} from '../js/firebase.js';

    auth.onAuthStateChanged(async (usuario) => {
        if (usuario) {
            var nome = usuario.displayName;
            var divNome = document.getElementsByClassName("accNome")[0];
            divNome.getElementsByClassName("accInfo")[0].innerHTML = "Nome: " + nome;
            var email = usuario.email;
            var divEmail = document.getElementsByClassName("accEmail")[0];
            divEmail.getElementsByClassName("accInfo")[0].innerHTML = "Email: " + email;
        }
    });

    function edit(){
        document.getElementsByClassName("accTitleAndEdit")[0].remove(document.getElementsByClassName("editBtn")[0]);
        var divNome = document.getElementsByClassName("accNome")[0];
        divNome.innerHTML = "<p class='accInfo', style='font-size:20px; width:100%;'>Nome: </p><input type='text' style = 'width:100%;' class = 'tfName'>";
        divNome.setAttribute("style", "margin-top:30%; width:100%;");
        var divEmail = document.getElementsByClassName("accEmail")[0]; 
        divEmail.innerHTML = "";
        var btnSubmit = document.createElement('button');
        btnSubmit.innerHTML = "<p>Enviar</p>";
        btnSubmit.setAttribute("class", "btnIndex");
        btnSubmit.setAttribute("onclick", "atualizar()");
        document.getElementsByClassName("telaAcc")[0].appendChild(btnSubmit);
    }

    async function atualizar(){
        var tfName = document.getElementsByClassName("tfName")[0];
        var newName = tfName.value;
        let retorno;

        if (newName != ""){
            retorno = await atualizarNomeUsuario(newName); 
        } else {
            retorno = false;
        }
        
        if(retorno){
            var warn1 = document.createElement('p');
            window.location.href = window.location.href;
        } else {
            var warn = document.createElement('p');
            warn.innerHTML = "Erro na atualização de informações";
            warn.setAttribute("style", "color:red;");
            document.getElementsByClassName("telaAcc")[0].appendChild(warn);
        }
    }

    function verifyAuthentication(){
        var user = verifyUser();
        if(user === undefined){
            window.location.href = "/user/login"
        }
    }

    window.verifyAuthentication = verifyAuthentication;
    
    window.verifyUser = verifyUser;
    window.edit = edit;
    window.atualizar = atualizar;
</script>
*/