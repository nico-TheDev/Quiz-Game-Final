// https://opentdb.com/api.php?amount=20&category=9&difficulty=medium&type=multiple

// VARIABLES
const apiLoc =
    "https://opentdb.com/api.php?amount=20&category=9&difficulty=medium&type=multiple";
const unansweredQuestions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    answeredQuestions = [],
    questions = [];

let playerAnswer,
    correctAnswer,
    progressCounter = 1,
    playerScore = 0,
    questionText,
    questionChoices = [];

const questionDOM = document.querySelector('.quiz__text'),
      choicesDOM = document.querySelectorAll('.answer'),
      quizApp = document.querySelector('.quiz .container'),
      loader = document.querySelector('.loader'),
      progressBar = document.querySelector('.progress'),
      countLabel = document.querySelector('.quiz__count');
      ;

class Question {
    constructor(question,choices,answer){
        this.question = question;
        this.answer = answer;
        this.choices = choices;
    }
}


//fetch the data from the api
async function getDataFromAPI() {
    try {

        const data = await fetch(apiLoc).then((result) => {
            return result.json();
        });
        return data;
    }
    catch(error){
        alert(error);
    }
}

let quizData = getDataFromAPI().then(result =>{
    quizData = result.results;

    quizData.forEach(item =>{
        let newQuestion = new Question(item.question,[...item.incorrect_answers,item.correct_answer],item.correct_answer);
        questions.push(newQuestion);
    });
    
    //questions are stored
    console.log(questions);
    //get random number then get question
    // First Call
    getAnotherQuestion();
    checkForAnswer(choicesDOM);

});    



function getAnotherQuestion(){
    loader.style.display = 'block';
    quizApp.style.display ='none';
    setInterval(()=>{
        resetDisplay();
        loader.style.display = 'none';
        quizApp.style.display = 'block';
    },1000);

    updateProgress();
    let random = getRandom(answeredQuestions,unansweredQuestions);
    getQuestion(questions[random]);
    displayQuestion();
}


function getRandom(answered, unanswered) {
    let random = Math.floor(Math.random() * answered.length); // random number between 0 and 9
    //calls the function
    if (answered.includes(random)) {
        getRandom(answered, unanswered);
    } else {
        answered.push(unanswered[random]);
        return unanswered[random];
    }
}

function decodeText(text){
    const textBox = document.createElement('textarea');
    textBox.innerHTML = text;
    return textBox.value;
}

function getQuestion(questionItem) {
    console.log(questionItem);
    const order = [0,1,2,3]; // created order of the questions 
    questionText = questionItem.question; // assign the question to be displayed
    correctAnswer = questionItem.answer; // assigns the correct answer to the current question
    shuffle(order); // shuffle choices order
    // console.log(order);
    //create a new data structure for the shuffled choices
    order.forEach(num =>{ 
        questionChoices.push(questionItem.choices[num]);
    });

    console.log(questionChoices);
}

function displayQuestion() {
    countLabel.textContent = progressCounter;
    questionDOM.textContent = decodeText(questionText);
    choicesDOM.forEach((item,index) =>{
        item.textContent = decodeText(questionChoices[index]);
    });
}

function checkForAnswer(answers) {
    answers.forEach((btn,index)=>{
        btn.addEventListener('click',function(){
            if(btn.textContent === correctAnswer){
                changeColor('green',btn);
                playerScore++;
            }
            else{
                changeColor('red',btn);
                alert(correctAnswer);
            }

            progressCounter++;
            getAnotherQuestion();
            console.log(`Player Score: ${playerScore}`);
            
        })
    });
}


function updateProgress(){
    const bar = document.createElement('div');
    bar.className = 'progress__bar';
    for(let i = 0; i < progressCounter; i++){
        progressBar.appendChild(bar);
    }
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  
 function resetDisplay(){
     choicesDOM.forEach(btn=>{
         btn.style.backgroundColor = '#3498db';
     })
 }

 function changeColor(color,btn){
    btn.style.backgroundColor = color;
 }