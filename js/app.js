import question from "./question.js";
import Quiz from "./Quiz.js";

const App = (() => {
    //Caching the DOM 
    const quizEl = document.querySelector(".jabquiz");
    const quizQuestionEl = document.querySelector(".jabquiz-question");
    const trackerEl = document.querySelector(".jabquiz-tracker");
    const taglineEl = document.querySelector(".jabquiz-tagline");
    const choicesEl = document.querySelector(".jabquiz-choices");
    const progressInnerEl = document.querySelector(".progress-inner");
    const nextButtonEl = document.querySelector(".next");
    const restartButtonEl = document.querySelector(".restart");
    

    const Q1 = new question(
        "Where was the 2015 Rugby World Cup Held?", 
        ["USA", "Japan", "England", "New Zealand"],
        2
    )
    const Q2 = new question(
        "Which Country Won The 2003 Rugby World Cup?", 
        ["Australia", "England", "South Africa", "New Zealand"],
        1
    )
    const Q3 = new question(
        "Which Country Has Won The Most Rugby World Cups?", 
        ["New Zealand", "Ireland", "England", "Australia"],
        0
    )
    const Q4 = new question(
        "Where is the 2019 Rugby World Cup Being Held?", 
        ["Ireland", "Japan", "England", "Canada"],
        1
    )
    const Q5 = new question(
        "What year did Rugby 7s Become an Olympic Sport?", 
        ["2001", "2019", "2003", "2009"],
        3
    )

    const myQuiz = new Quiz([Q1, Q2, Q3, Q4, Q5]);

    const listeners = _ => {
        nextButtonEl.addEventListener("click", function() {
            const selectedRadioElem = document.querySelector('input[name="choice"]:checked');
            if (selectedRadioElem){
                const key = Number(selectedRadioElem.getAttribute("data-order"));
                myQuiz.guess(key);
                renderAll();
            } else {
                alert("Pick an option");
            }
            
        })

        restartButtonEl.addEventListener("click", function(){
            myQuiz.reset();
           renderAll();
           nextButtonEl.style.opacity = 1;
           setValue(taglineEl, `Pick an option below!`)
        })
    }

    const setValue = (elem, value) => {
        elem.innerHTML = value;
    }

    const renderQuestion = _ => {
        const question = myQuiz.getCurrentQuestion().question;
        setValue(quizQuestionEl, question);        
    }
    
    const renderChoicesElement = _ => {
        let markup = "";
        const currentChoices = myQuiz.getCurrentQuestion().choices;
        currentChoices.forEach(function(element, index) {
           markup += `
                        <li class="jabquiz-choice">
                            <input type="radio" name="choice" class="jabquiz-input" data-order="${index}" id="choice${index}">
                            <label for="choice${index}" class="jabquiz-label">
                                <i></i>
                                <span>${element}</span>
                            </label>
                        </li>
           ` 
        });
        setValue(choicesEl, markup);
    }
    
    const renderTracker = _ => {
        const index = myQuiz.currentIndex;
        setValue(trackerEl, `${index+1} of ${myQuiz.questions.length}`);
    }

    const getPercentage = (num1, num2) => {
        return Math.round((num1/num2) * 100);
    }

    const launch = (width, maxPercent) => {
        let loadingbar = setInterval(() => {
            if (width > maxPercent) {
                clearInterval(loadingbar);
            } else {
                width++;
                progressInnerEl.style.width = width + "%";
            }
        }, 3);
    }

    const renderProgress = _ => {
        const currentWidth = getPercentage(myQuiz.currentIndex, myQuiz.questions.length);
        launch(0, currentWidth);
    }
    
    const renderEndScreen = _ => {
        setValue(quizQuestionEl, `Great Job!`);
        setValue(taglineEl, `Complete!`);
        setValue(trackerEl, `Your Score: ${getPercentage(myQuiz.score, myQuiz.questions.length)}%`);
        nextButtonEl.style.opacity = 0;
        renderProgress();
    }


    const renderAll = _ => {
        if (myQuiz.hasEnded()){
            // render end screen
            renderEndScreen();
        } else {
            // 1. Render the question
            renderQuestion();
            // 2. Render the choices element
            renderChoicesElement();
            // 3. Render the jabquiz-tracker
            renderTracker();
            // 4. Render the progress
            renderProgress();
        }
    }

    

    return {
        renderAll: renderAll,
        listeners: listeners
    }
})();

App.renderAll();
App.listeners();

