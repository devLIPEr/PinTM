import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-analytics.js";
import { getAuth, signOut, signInWithEmailAndPassword, sendPasswordResetEmail, verifyPasswordResetCode, confirmPasswordReset, updateProfile } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCbLFlTxsmqNklacg5jHm_ciJ8S33fRDeA",
  authDomain: "pintm-4b550.firebaseapp.com",
  databaseURL: "https://pintm-4b550-default-rtdb.firebaseio.com",
  projectId: "pintm-4b550",
  storageBucket: "pintm-4b550.appspot.com",
  messagingSenderId: "76436511253",
  appId: "1:76436511253:web:60f85da6d20841846b4c1c",
  measurementId: "G-7J4E7D965X"
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);

export async function atualizarNomeUsuario(nome){
  var valor;
  try {
    await updateProfile(auth.currentUser, {
      displayName: nome
    });
    valor = true;
  } catch (error) {
    console.error(error);
    valor = false;
  }

  return valor;
}

const validateEmail = (email) => {
  return String(email).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
};

export function getUserId(){
  if(auth.currentUser != null){
    return auth.currentUser.uid;
  }
  return undefined;
}

export function verificaUsuario(){
  auth.onAuthStateChanged((user) => {
    if(!user){
      window.location.href = '../user/login';
    }
  });
}

export function loadRepositions(){
  auth.onAuthStateChanged((user) => {
    if(user){
      fetch('../reposition/getRepositions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({userId: user.uid})
      })
      .then(response => response.json())
      .then(repositions => {
        if(repositions['repositions']){
          document.getElementById('emptyRepos').remove();
          var main = document.getElementById('main');
          var table = document.createElement('table');
          var div = document.createElement("div");
          div.setAttribute('class', 'reposTable');
          table.innerHTML += '<tr><th>Matéria</th><th>Curso</th><th>Data</th><th>Horário</th><th>Local</th><th>Ações</th></tr>';
          Object.entries(repositions['repositions']).forEach(([k,v]) => {
            var repo = document.createElement('tr');
            repo.setAttribute('id', `repo${k}`);
            repo.innerHTML = `<td>${v.materia}</td><td>${v.curso}</td><td>${v.data}</td><td>${v.start}</td><td>${v.sala}</td>`;
            repo.innerHTML += `<td><div class="repositionActions"><img src="../images/compartilharEmail.png" title="Compartilhar como mensagem" alt="Compartilhar como mensagem" onclick="copiarAreaTransferencia('${v.materia}', '${v.curso}', '${v.data}', '${v.start}', '${v.sala}')"><img src="../images/compartilharPDF.png" title="Compartilhar como PDF" alt="Compartilhar como PDF" onclick="printPDF('${user.uid}', '${k}')"><img src="../images/deletarReposicao32.png" title="Deletar reposição" alt="Deletar reposição" onclick="deleteReposition('${user.uid}', '${k}')"></div></td>`;
            table.appendChild(repo);
          });
          div.appendChild(table);
          main.appendChild(div);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    }
  });
}

export function resetarSenha(email){
  if(validateEmail(email)){
    sendPasswordResetEmail(auth,email)
    .catch((error)=>{
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(error);
    });  
  }
}

export function logOut(){
  var login = document.querySelector('#headerLogin');
  signOut(auth).then(()=>{
    login.innerHTML = "Login";
    console.assert("Log out feito com sucesso.");
  }).catch((error)=>{
    console.error(error);
  });
  window.location.href = window.location.href.split('/user')[0];
}

export function authState(){
  auth.onAuthStateChanged(function(user) {
    if(user){
      document.querySelectorAll('.sepBar')[1].style = 'display: inherit;'
      document.querySelectorAll('.navButton')[0].style = 'display: inherit;'
      var login = document.querySelector('#headerLogin');
      if(login){
        login.removeAttribute('href');
        login.innerHTML = user.displayName;

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
  });
}

export function resetPassword(actionCode, newPassword){
  verifyPasswordResetCode(auth, actionCode).then((email) => {
    const accountEmail = email;

    confirmPasswordReset(auth, actionCode, newPassword).then(async (resp) => {
      var login = await signInWithEmailAndPassword(auth, accountEmail, newPassword);

      window.location.href = window.location.href.split('/user')[0];
    }).catch((error) => {
      var message = error.message;
      if(message == 'Firebase: Password should be at least 6 characters (auth/weak-password).'){
        alert("A senha precisar ter pelo menos 6 caracteres.");
      }else if(message == 'Firebase: Error (auth/weak-password).'){
        alert("Insira uma senha.");
      }
    });
  }).catch((error) => {
    alert("Código de verificação inválido.");
  });
}