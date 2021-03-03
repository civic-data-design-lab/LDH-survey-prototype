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
    if (event.target == modalVoluntary) {
        closeModal('modal-voluntary')
    }
}

function continueQuestions() {
    window.location.href = "./questions.html";
}