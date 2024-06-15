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

function singUp(email, password, username, isColorBlind = false){
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