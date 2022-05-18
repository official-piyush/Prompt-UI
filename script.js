function wait(ms = 0) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(`done`), ms);
    });
}


async function destroyPopup(popup) {
    popup.classList.remove(`open`);
    await wait(500);
    popup.remove();
    popup = null;
}


function ask(options) {
    return new Promise(async function(resolve) {
        // create a pop up with all the fields in it !
        let popup = document.createElement(`form`);
        console.log(options);
        popup.insertAdjacentHTML(`afterbegin`, `
            <fieldset>
                <label>${options.question}</label>
                <input type="${options.dataType}" name="input">
                <button type="submit">Submit</button> 
            </fieldset>`
            );

        if(options.shouldCancel) {
            const skipButton = document.createElement(`button`);
            skipButton.type = `button`;
            skipButton.textContent = `Cancel`;
            popup.firstElementChild.appendChild(skipButton);
            skipButton.addEventListener(`click`, (event) => {
                resolve(null);
                destroyPopup(popup);
            }, {once: true})
        }

        // put the popup on page
        popup.classList.add(`popup`);
        document.body.appendChild(popup);

        // make the prompt show up after a delay
        await wait(50);
        popup.classList.add(`open`);


        // submitting the form
        popup.addEventListener(`submit`, async (event) => {
            event.preventDefault();
            resolve(event.currentTarget.input.value);
            destroyPopup(popup);
        }, {once: true});

        
    });
}


const askQuestion = async function(event) {
    const question = event.currentTarget.dataset.question;
    const shouldCancel = `cancel` in event.currentTarget.dataset
    const dataType =  event.currentTarget.dataset.type;
    const answer = await ask({ question, shouldCancel, dataType});
    console.log(answer);
}


const buttons = document.querySelectorAll(`[data-question]`);
buttons.forEach(button => button.addEventListener(`click`, askQuestion));


// PART: 2 - Asking a series of questions
// for-of loop makes the next iteration to wait until a previous iteration is not finished

const mcqs = [
    {question: "First Name ?", dataType: "text",},
    {question: "Last Name ?", shouldCancel: true, dataType: "text",},
    {question: "Salary ?", dataType: "text",},
];

async function getAnswers(mcqs) {
    const answers = [];

    for(mcq of mcqs) {
        const ans = await ask(mcq);
        answers.push(ans);
    }

    console.log(answers);
}

getAnswers(mcqs);