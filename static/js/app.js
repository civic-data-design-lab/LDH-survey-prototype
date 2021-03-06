// add sweet alert
function checkUserEmail(){
    var userEmail = document.getElementById("inputEmail");
    var userEmailFormat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var flag;
    if(userEmail.value.match(userEmailFormat)){
        flag = false;
    }else{
        flag = true;
    }
    if(flag){
        document.getElementById("emailError").style.display = "block";
    }else{
        document.getElementById("emailError").style.display = "none";
    }
}

// xxxxxxxxxx Check email or password exist in firebase authentication xxxxxxxxxx    
function signIn(){
    console.log("ayyy")
    var userEmail = document.getElementById("inputEmail").value;
    var userPassword = document.getElementById("inputPassword").value;
    var userEmailFormat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // var userPasswordFormat = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{10,}/;      

    var checkUserEmailValid = userEmail.match(userEmailFormat);
    // var checkUserPasswordValid = userPassword.match(userPasswordFormat);

    if(checkUserEmailValid == null){
        alert("Invalid email format.")
        return checkUserEmail();
    // }else if(checkUserPasswordValid == null){
    //     return checkUserSIPassword();
    }else{
        firebase.auth().signInWithEmailAndPassword(userEmail, userPassword).then((data) => {
            const user = firebase.auth().currentUser
            const idToken = user.getIdToken()
            localStorage.setItem('email', user.email)
            return idToken
        })
        .then((value) => {
            setTimeout(function(){
                window.location.replace("../welcome.html");
            }, 1000)
        })
        .catch((error) => {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode, errorMessage)
            if (errorCode === "auth/user-not-found"){
                alert("You do not have an account. Please sign-up to access KPSPIN.")
            }
        });
    }
}

function signUp() {
    var userEmail = document.getElementById("inputEmail").value;
    var userPassword = document.getElementById("inputCreatePassword").value;
    var userPasswordConfirm = document.getElementById("inputConfirmPassword").value
    var userEmailFormat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    var checkUserEmailValid = userEmail.match(userEmailFormat);

    if (userPassword !== userPasswordConfirm) {
        alert("Ensure both passwords match.")
        return
    } else if (checkUserEmailValid == null) {
        alert("Email invalid")
        return checkUserEmail();
    } else {
        firebase.auth().createUserWithEmailAndPassword(userEmail, userPassword).then((data) => {
            const user = firebase.auth().currentUser
            const idToken = user.getIdToken()
            const uid = user.uid
            return idToken
        })
            .then((value) => {
                setTimeout(function () {
                    window.location.replace("./welcome.html");
                }, 1000)
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage)
                if (errorCode === "auth/email-already-in-use") {
                    alert("Already signed in.")
                    setTimeout(function () {
                        window.location.replace("./index.html");
                    }, 1000)
                }
            })
    }

}
var modalVoluntary = document.getElementById("modal-voluntary");

function openModal(modalId) {
    document.getElementById("backdrop").style.display = "block"
    document.getElementById(modalId).style.display = "block"
    document.getElementById(modalId).classList.add("show");
}

function closeModal(modalId) {
    document.getElementById("backdrop").style.display = "none"
    document.getElementById(modalId).style.display = "none"
    document.getElementById(modalId).classList.remove("show");
}

window.onclick = function (event) {
    if (event.target === modalVoluntary) {
        closeModal('modal-voluntary')
    }
}

function continueQuestions() {
    window.location.href = "./questions.html";
}
