var modalVoluntary = document.getElementById("modal-voluntary");

var allQs = ["q1", "q1-1", "q1-2", "q1-3", "q2", "q2-1", "q2-2", "q2-3", "q2-4", "q3", "q4"]
var hiddenQs = ["q1-1", "q1-2", "q1-3", "q2", "q2-1", "q2-2", "q2-3", "q2-4"];
var currentQs = ["q1", "q3", "q4"];

var quest1yes = ["q1-1", "q1-2", "q1-3", "q2"],
    quest2yes = ["q2-1", "q2-2", "q2-3"],
    quest2part3yes = ["q2-4"];

var linkedQs = [
    {qId: "q1", qName: "nmsPlans", qList: quest1yes},
    {qId: "q2", qName: "govTalk", qList: quest2yes},
    {qId: "q2-3", qName: "displaced", qList: quest2part3yes}
];

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

function backToWelcome() {
    window.location.href = "./welcome.html";
}

function toThankYou() {
    window.location.href = "./thank-you.html";
}

// function jumpToQuestion(responseId, questionId) {
//     document.getElementById(responseId).onclick = function() {
//         document.getElementById(questionId).focus();
//     }
// }
// document.onload = function() {
//     jumpToQuestion('nmsYes','q1.1');
// }
    
function showHideQs(linkedQuestionObj) {
    inputName = linkedQuestionObj.qName;
    nameYesValue = inputName + "Yes";
    questionList = linkedQuestionObj.qList;
    linkedQIndex = currentQs.indexOf(linkedQuestionObj.qId);

    for (j = 0; j < questionList.length; j++) {
        qId = "#" + questionList[j];

        if ($("input[name='" + inputName + "']:checked").val() == nameYesValue) {
            $(qId).css('display','block');
            currentQs.splice(linkedQIndex + j + 1, 0, questionList[j]);
            // console.log("checked yes");
        }
        else {
            if (linkedQuestionObj.qId == "q1") {
                hideList = quest1yes.concat(quest2yes, quest2part3yes);
            }
            else if (linkedQuestionObj.qId == "q2") {
                hideList = quest2yes.concat(quest2part3yes);
            }
            else {
                hideList = quest2part3yes;
            }

            $(qId).css('display','none');
            currentQs = currentQs.filter(item => !hideList.includes(item));
            // console.log("checked no or not sure");
        }
    }
    console.log("linked Q index: " + linkedQIndex + ", current question list: " + currentQs);
}

$(document).ready(function() {
    $("input").on("change", function() {
        questionName = $(this).attr("name");

        for (i = 0; i < linkedQs.length; i++) {
            if (linkedQs[i].qName == questionName) {
                showHideQs(linkedQs[i]);
            }
        }
    });

});