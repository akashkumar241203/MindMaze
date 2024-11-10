import {quizQuestions} from "./ques.js";

const timerValue = document.querySelector(".timer-value");
const progressBar = document.querySelector(".quiz-progress");
const question = document.querySelector(".question");
const options = document.querySelector(".quiz-options");
const currentQues = document.querySelectorAll(".currentQ");
const totalQues = document.querySelector(".totalQ");
const summary = document.querySelector(".question-answer-container");
const innerContainer = document.querySelector(".inner-container");
const quizApp = document.querySelector(".quiz-app");
const finalScore = document.querySelector(".score");
const playbtn = document.querySelector(".playBtn");
const homepage = document.querySelector(".homepage");
const levelSelect = document.querySelector(".level-select");
const quesSelect = document.querySelector(".ques-select");
const reloadBtn = document.querySelector(".reloadBtn");



summary.style.display = "none";
let questions;
let score = 0;
let timer = 0;
let currentTime = timer;
let currentQuesIndex = 0;
let totalMCQ = 0;

var quesTimer;
// level select event listener
levelSelect.addEventListener('change', (e)=>{
    const selectedLevel = e.target.value;
    if(selectedLevel === "easy"){
        timer = 13;
    }else if(selectedLevel === "medium"){
        timer = 7;
    }else if(selectedLevel === "hard"){
        timer = 4;
    }
})

// ques select event listener
quesSelect.addEventListener('change', (e)=>{
    totalMCQ = e.target.value;
})

// start game
function startGame(){
    console.log(totalMCQ);
    questions = randomQues(totalMCQ);
    updateQues();
     quesTimer = setInterval(()=>{
        timerValue.innerText = currentTime;
        if(currentTime === 1){
            currentQuesIndex++;
            updateQues();
        }
        currentTime--;
    }, 1000)
}

// picking random ques
function randomQues(numberOfQuestion){
    let questions = [];
    for (let i = 0; i < numberOfQuestion; i++) {
        const randomIndex = Math.floor(Math.random() * quizQuestions.length);
        questions.push(quizQuestions[randomIndex]);
    }
    console.log(questions);  
    return questions;  
}

function updateQues(){
    currentTime = timer;
    // changing currQ and totalQ
    if(currentQuesIndex >= totalMCQ){ 
        summary.style.display = "block";
        quizApp.style.display = "none";
        finalScore.innerText = "Score : " + score + "/" + totalMCQ;
        questions.forEach((question)=>{
            summaryPage(question);
        })

        reloadBtn.addEventListener("click", ()=>{
            location.reload();
        });

        clearInterval(quesTimer);
        // div.append(btn);
        summary.append(div);
        
    }else{
        currentQues.forEach((ques) =>{
            ques.innerText = currentQuesIndex + 1;
        })
        totalQues.innerText = questions.length;
    
        const newQues = questions[currentQuesIndex];
        question.innerText = newQues.Question;
        options.innerHTML = "";
        newQues.options.forEach((choice)=>{
            const optionBtn = document.createElement("button");
            optionBtn.classList.add("quiz-option");
    
            const optionText = document.createElement("div");
            optionText.classList.add("quiz-option-text")
            optionText.innerText = choice;
    
            const optionImg = document.createElement("img");
    
            optionBtn.append(optionText, optionImg);
            optionBtn.addEventListener('click', (e)=> {
                if(verifyOption(e, newQues.correctAns)){
                    score++;
                }
                options.querySelectorAll(".quiz-option").forEach((option) => option.disabled = true);
                currentQuesIndex++;
                setTimeout(()=>{
                    updateQues();
                }, 500);
            });
    
            options.appendChild(optionBtn);
        }); 
    }
    
    progressBar.style.width = (currentQuesIndex/totalMCQ) * 100 + "%";
}

function verifyOption(event, answer){
    // console.log(event.target.childNodes[0].innerText)
    const selectedOption = event.currentTarget.innerText;
    if(selectedOption === answer){
        event.currentTarget.classList.add("correct");
        event.currentTarget.childNodes[1].src = "assests/correct-right-arrow-direction-left-down-up-svgrepo-com.svg";
        event.currentTarget.childNodes[1].classList.add("btn-img");
        return true;
    }else{
        event.currentTarget.classList.add("wrong");
        event.currentTarget.childNodes[1].src = "assests/cross-round-svgrepo-com.svg";
        event.currentTarget.childNodes[1].classList.add("btn-img");
        return false;
    }
}

function summaryPage(questions){
    const quesAnsContainer = document.createElement("div");
    quesAnsContainer.classList.add("question-answer-inner-container");

    const ques = document.createElement("h2");
    ques.classList.add("quiz-question", "question")
    ques.innerText = questions.Question;

    const ans = document.createElement("div");
    ans.classList.add("quiz-answer", "quiz-option", "correct");
    ans.innerText = questions.correctAns;

    quesAnsContainer.append(ques, ans);
    innerContainer.appendChild(quesAnsContainer);
    summary.appendChild(innerContainer);
}

// play button event listener
playbtn.addEventListener('click', ()=>{
    if(timer !== 0 && totalMCQ !== 0){
        homepage.style.display = "none";
        quizApp.style.display = "flex";
        startGame();
    }else{
        alert("Please ensure both level and number of questions are selected")
    }
})