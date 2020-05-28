// https://opentdb.com/api.php?amount=20&category=9&difficulty=medium&type=multiple

// VARIABLES
const apiLoc =
    "https://opentdb.com/api.php?amount=20&category=9&difficulty=medium&type=multiple";
const unansweredQuestions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    answeredQuestions = [],
    questions = [];

let playerAnswer,
    correctAnswer,
    progressCounter = 0,
    playerScore = 0,
    questionText,
    questionChoices = [],
    correctIndex,
    barColor,
    bar;

const questionDOM = document.querySelector(".quiz__text"),
    choicesDOM = document.querySelectorAll(".answer"),
    quizApp = document.querySelector(".quiz .container"),
    loader = document.querySelector(".loader"),
    progressBar = document.querySelector(".progress"),
    countLabel = document.querySelector(".quiz__count"),
    scoreBoard = document.querySelector(".result"),
    scoreText = document.querySelector(".score"),
    playAgain = document.querySelector(".playAgain");

class Question {
    constructor(question, choices, answer) {
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
    } catch (error) {
        alert(error);
    }
}

let quizData = getDataFromAPI().then((result) => {
    quizData = result.results;

    quizData.forEach((item) => {
        let newQuestion = new Question(
            item.question,
            [...item.incorrect_answers, item.correct_answer],
            item.correct_answer
        );
        questions.push(newQuestion);
    });

    //questions are stored
    // console.log(questions);
    //get random number then get question
    // First Call
    getAnotherQuestion();
    checkForAnswer(choicesDOM);
});

playAgain.addEventListener("click", function () {
    progressCounter = 1;
    playerScore = 0;
    scoreBoard.style.display = "none";
    getAnotherQuestion();
    progressBar.innerHTML = '<div class="progress__bar"></div>';
    countLabel.textContent = progressCounter ;
    answeredQuestions.length = 0;
});

function getAnotherQuestion() {
    loader.style.display = "block";
    quizApp.style.display = "none";
    setTimeout(() => {
        if (progressCounter === 10) {
            quizApp.style.display = "none";
            loader.style.display = "none";
            scoreBoard.style.display = "grid";
            scoreText.textContent = `${playerScore} / 10`;
        } else {
            resetDisplay();
            loader.style.display = "none";
            quizApp.style.display = "block";
        }
    }, 1000);

    updateProgress();
    let random = getRandom(answeredQuestions);
    getQuestion(questions[random]);
    displayQuestion();
}

function getRandom(answered) {
    let random = Math.floor(Math.random() * unansweredQuestions.length); // random number between 0 and 9
    // console.log(answered);
    //calls the function
    if (answered.includes(random)) {
        getRandom(answered);
    } else {
        answered.push[random];
        return random;
    }
}

function decodeText(text) {
    const textBox = document.createElement("textarea");
    textBox.innerHTML = text;
    return textBox.value;
}

function getQuestion(questionItem) {
    // console.log(questionItem);
    const order = [0, 1, 2, 3]; // created order of the questions
    questionText = questionItem.question; // assign the question to be displayed
    correctAnswer = questionItem.answer; // assigns the correct answer to the current question
    shuffle(order); // shuffle choices order
    // console.log(order);
    //create a new data structure for the shuffled choices
    order.forEach((num) => {
        questionChoices.push(questionItem.choices[num]);
    });

    // console.log(questionChoices);
}

function displayQuestion() {
    countLabel.textContent = progressCounter + 1;
    questionDOM.textContent = decodeText(questionText);
    choicesDOM.forEach((item, index) => {
        item.textContent = decodeText(questionChoices[index]);
    });
    Array.from(choicesDOM).findIndex((text) => text === correctAnswer);
    questionChoices.length = 0;
}

function checkForAnswer(answers) {
    answers.forEach((btn) => {
        btn.addEventListener("click", function () {
            if (btn.textContent === correctAnswer) {
                barColor = 'green';
                btn.style.backgroundColor = "green";
                playerScore++;
            } else {
                answers.forEach((btn) => {
                    if (btn.textContent === correctAnswer) {
                        btn.style.backgroundColor = "green";
                    }else{
                        btn.disabled = true;
                    }
                });
                barColor = 'red';
                btn.style.backgroundColor = "red";
            }

            progressCounter++;
            setTimeout(getAnotherQuestion,1000);
        });
    });
}

function updateProgress() {
    bar = document.createElement('div');
    bar.className = `progress__bar ${barColor}`;
    for (let i = 0; i < progressCounter; i++) {
        progressBar.appendChild(bar);
    }
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function resetDisplay() {
    choicesDOM.forEach((btn) => {
        btn.style.backgroundColor = "#3498db";
        btn.disabled = false;
    });
}
