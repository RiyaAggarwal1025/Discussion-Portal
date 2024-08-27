let subject = document.getElementById("Subject");
let question = document.getElementById("Question");
let submit = document.getElementById("Submit");
let QuesList = document.getElementById("listQues");
let responsePage = document.getElementById("responsePage");
let quesPage = document.getElementById("ques");
let newBtn = document.getElementById("NewQues");
let resQues = document.getElementById("ResQues");
let Uname = document.getElementById("name");
let comment = document.getElementById("Comment");
let addComment = document.getElementById("add");
let myResponses = document.getElementById("myResponses");
let searchInput = document.getElementById("search");
let currentQuestionId = null;
let displayedResponses = new Set();
let likeCount = 0;
let dislikeCount = 0;
let getTheQues;

document.addEventListener("DOMContentLoaded", () => {       //For loading of questions when refreshing
    loadQuestions();
});

submit.addEventListener("click", () => {                    //it will add questions in the list when submitting the subject and question
    createList();
});

newBtn.addEventListener("click", () => {                   //mew form button will simply be hiding and displaying welcome and responses pages 
    responsePage.style.display = "none";
    quesPage.style.display = "block";
});

searchInput.addEventListener("input", () => {               //the search button 
    searchQuestions();
});

function createList() {
    let value1 = subject.value.trim();
    let value2 = question.value.trim();
    let quesId = getNextQuestionId();
    let ques = {
        id: quesId,
        sub: value1,
        que: value2,
        imageState: 1,
        counter: 0,
        time: new Date()
    };
    //console.log(ques.time);
    if (value1 && value2) {
        addQuestion(quesId, value1, value2, ques.imageState, ques.counter, ques.time);
        saveQuestion(ques);
        subject.value = '';
        question.value = '';
    }
    else {
        alert("Enter the subject and question both");
    }
}

function createDivElement(list, quesId) {
    let div = document.createElement("div");

    div.addEventListener("click", (e) => {
        responsePage.style.display = "block";
        quesPage.style.display = "none";
        resQues.innerHTML = '';

        let myques = createResolveQuestion(e);
        resQues.appendChild(myques);
        currentQuestionId = quesId;
        displayedResponses.clear();
        loadResponses(quesId);
    });
    return div;
}

function createResolveQuestion(e) {
    getTheQues = e.currentTarget;
    let subject = getTheQues.querySelector(".subject");
    let ques = getTheQues.querySelector(".questions");
    let element = document.createElement("div");
    let sub = document.createElement("h4");
    let q = document.createElement("p");
    sub.textContent = subject.textContent;
    q.textContent = ques.textContent;
    element.append(sub, q);
    return element;
}

function createListElement(value1, value2) {
    let list = document.createElement("li");
    list.classList.add("listItem");
    let listText = document.createElement("span");
    listText.classList.add("subject");
    let newline = document.createElement("br");
    let qText = document.createElement("span");
    qText.classList.add("questions");
    listText.textContent = value1;
    qText.textContent = value2;
    list.append(listText, newline, qText);
    return {
        listElement: list
    };
}

function toggleImage(img, div, newState) {
    const firstImage = "https://i.pinimg.com/originals/7d/90/95/7d9095e38cd55a8fc5b00fc2bf870418.png";
    const secondImage = "https://t4.ftcdn.net/jpg/05/40/09/17/360_F_540091788_AvDyNUSbtnKQfNccukuFa3ZlsHFnMYrK.webp";
    if (newState === 2) {
        img.src = secondImage;
    }
    else {
        img.src = firstImage;
    }
    let questions = JSON.parse(localStorage.getItem("questions")) || {};
    let quesId = div.getAttribute("data-id");
    questions[quesId].imageState = newState;
    localStorage.setItem("questions", JSON.stringify(questions));
    //console.log(questions[quesId].imageState);
}

function addQuestion(quesId, value1, value2, imageState = 1, counter, time) {
    let list = createListElement(value1, value2);
    let div = createDivElement(list, quesId);
    div.appendChild(list.listElement);
    let img = document.createElement("img");
    img.src = imageState === 1 ?
        "https://i.pinimg.com/originals/7d/90/95/7d9095e38cd55a8fc5b00fc2bf870418.png" :
        "https://t4.ftcdn.net/jpg/05/40/09/17/360_F_540091788_AvDyNUSbtnKQfNccukuFa3ZlsHFnMYrK.webp";

    img.classList.add("image");
    div.appendChild(img);

    img.addEventListener("click", (e) => {
        let newState = img.src === "https://i.pinimg.com/originals/7d/90/95/7d9095e38cd55a8fc5b00fc2bf870418.png" ? 2 : 1;
        e.stopPropagation();

        toggleImage(img, div, newState);
        let questions = JSON.parse(localStorage.getItem("questions")) || {};
        let quesId = div.getAttribute("data-id");
        if (newState === 2) {
            questions[quesId].counter = 1;
            QuesList.insertBefore(div, QuesList.firstChild);

        }
        else if (newState === 1) {
            questions[quesId].counter = 0;
            QuesList.after(div);
        }
        localStorage.setItem("questions", JSON.stringify(questions));
    });


    let t = document.createElement("span");
    updateTimeDisplay(t, time);
    setInterval(() => updateTimeDisplay(t, time), 1000);
    div.appendChild(t);

    div.classList.add("myQues");
    div.setAttribute("data-id", quesId.toString());
    if (counter == 1)
        QuesList.insertBefore(div, QuesList.firstChild);
    else {
        QuesList.after(div);
    }
}

function updateTimeDisplay(element, time) {
    const now = new Date();
    const current = now - new Date(time);
    const t = Math.floor(current / 1000);
    let timeString;
    if (t < 10) {
        timeString = `a few seconds ago`;
    }
    else if (t < 60) {
        timeString = `${t} seconds ago`;
    } else if (t < 3600) {
        let minutes = Math.floor(t / 60);
        timeString = `${minutes} minutes ago`;
    } else if (t < 86400) {
        let hours = Math.floor(t / 3600);
        timeString = `${hours} hours ago`;
    } else {
        let days = Math.floor(t / 86400);
        timeString = `${days} days ago`;
    }
    element.textContent = timeString;
}

function saveQuestion(ques) {
    let questions = JSON.parse(localStorage.getItem("questions")) || {};
    questions[ques.id] = ques;
    localStorage.setItem("questions", JSON.stringify(questions));
}

function loadQuestions() {
    let questions = JSON.parse(localStorage.getItem("questions")) || {};
    for (let quesId in questions) {
        let ques = questions[quesId];
        addQuestion(ques.id, ques.sub, ques.que, ques.imageState, ques.counter, ques.time);
    }
}

function addCommentToResponses(value1, value2, responseId, likeCount, dislikeCount) {
    if (displayedResponses.has(responseId)) {
        return;
    }
    let comments = createCommentElement(value1, value2);
    let div = createMyResponsesDivElement();
    div.classList.add("ResponsesComments");
    div.setAttribute("data-id", responseId);

    let likeImg = document.createElement("img");
    likeImg.src = "https://www.iconpacks.net/icons/3/free-green-thumbs-up-icon-11246-thumb.png";
    likeImg.style.marginLeft = "70%";
    let c1 = document.createElement("p");
    c1.textContent = likeCount;
    let additionalImg = document.createElement("img");
    additionalImg.src = "https://cdn-icons-png.flaticon.com/512/3128/3128319.png";
    let c2 = document.createElement("p");
    c2.textContent = dislikeCount;
    likeImg.classList.add("likeImages");
    additionalImg.classList.add("likeImages");

    div.appendChild(comments.commentElement);
    div.appendChild(likeImg);
    div.appendChild(c1);
    div.appendChild(additionalImg);
    div.appendChild(c2);

    myResponses.appendChild(div);
    displayedResponses.add(responseId);

    if (myResponses.children.length > 1) {
        myResponses.classList.add('scrollable');
    }
    else {
        myResponses.classList.remove('scrollable');
    }

    likeImg.addEventListener("click", () => {
        let responses = JSON.parse(localStorage.getItem("responses")) || {};

        if (responses[currentQuestionId] && responses[currentQuestionId][responseId]) {
            responses[currentQuestionId][responseId].likeCount++;
            localStorage.setItem("responses", JSON.stringify(responses));
            c1.textContent = responses[currentQuestionId][responseId].likeCount;
            reorderResponses(currentQuestionId);
        }
    });

    additionalImg.addEventListener("click", () => {
        let responses = JSON.parse(localStorage.getItem("responses")) || {};
        if (responses[currentQuestionId] && responses[currentQuestionId][responseId]) {
            responses[currentQuestionId][responseId].dislikeCount++;
            localStorage.setItem("responses", JSON.stringify(responses));
            c2.textContent = responses[currentQuestionId][responseId].dislikeCount;
            reorderResponses(currentQuestionId);
        }
    });
}

function reorderResponses(quesId) {
    let responses = JSON.parse(localStorage.getItem("responses")) || {};
    if (responses[quesId]) {
        let sortedResponses = Object.values(responses[quesId]).slice();
        sortedResponses.sort((a, b) => {
            const dA = a.likeCount - a.dislikeCount;
            const dB = b.likeCount - b.dislikeCount;

            if (dA !== dB) {
                return dB - dA;
            } else {
                return b.likeCount - a.likeCount;
            }
        });

        myResponses.innerHTML = '';
        //displayedResponses.clear();

        sortedResponses.forEach(response => {
            addCommentToResponses(response.name, response.text, response.id, response.likeCount, response.dislikeCount);
        });
    }
}

function createMyResponsesDivElement() {
    let div = document.createElement("div");
    div.classList.add("myResponsesDiv");
    return div;
}

addComment.addEventListener("click", () => {
    createComment();
});

function createCommentElement(value1, value2) {
    let comment = document.createElement("div");
    let commentText = document.createElement("h4");
    let nText = document.createElement("span");
    commentText.textContent = value1;
    nText.textContent = value2;
    comment.append(commentText, nText);
    return {
        commentElement: comment
    };
}

function createComment() {
    let value1 = Uname.value.trim();
    let value2 = comment.value.trim();
    let responseId = getNextResponseId(currentQuestionId);
    let response = {
        id: responseId,
        name: value1,
        text: value2,
        likeCount: 0,
        dislikeCount: 0
    };
    if (value1 && value2) {
        addCommentToResponses(value1, value2, responseId, response.likeCount, response.dislikeCount);
        saveResponse(currentQuestionId, response);
        Uname.value = '';
        comment.value = '';
    }
    else {
        alert("For your response to be added enter your name and comment both");
    }
}

function saveResponse(quesId, response) {
    let responses = JSON.parse(localStorage.getItem("responses")) || {};
    if (!responses[quesId]) {
        responses[quesId] = {};
    }
    responses[quesId][response.id] = response;
    localStorage.setItem("responses", JSON.stringify(responses));
}

function loadResponses(quesId) {
    myResponses.innerHTML = '';
    let responses = JSON.parse(localStorage.getItem("responses")) || {};
    if (responses[quesId]) {
        for (let responseId in responses[quesId]) {
            let response = responses[quesId][responseId];
            reorderResponses(quesId);
            //addCommentToResponses(response.name, response.text, responseId, response.likeCount, response.dislikeCount);
        }
    }
}

document.getElementById("Resolve").addEventListener("click", () => {
    getTheQues.remove();
    deleteQuestion(currentQuestionId);
    responsePage.style.display = "none";
    quesPage.style.display = "block";
    currentQuestionId = null;
});

function deleteQuestion(quesId) {
    let questions = JSON.parse(localStorage.getItem("questions")) || {};
    let responses = JSON.parse(localStorage.getItem("responses")) || {};
    delete questions[quesId];
    delete responses[quesId];
    localStorage.setItem("questions", JSON.stringify(questions));
    localStorage.setItem("responses", JSON.stringify(responses));
    removeQuestionFromDOM(quesId);
}

function removeQuestionFromDOM(quesId) {
    let questionElements = document.querySelectorAll(`[data-id='${quesId}']`);
    questionElements.forEach(element => {
        element.remove();
    });
    myResponses.innerHTML = '';
}

function getNextQuestionId() {
    let nextId = parseInt(localStorage.getItem("nextQuestionId") || "1");
    localStorage.setItem("nextQuestionId", nextId + 1);
    return nextId;
}

function getNextResponseId(quesId) {
    let nextResponseIds = JSON.parse(localStorage.getItem("nextResponseIds")) || {};
    if (!nextResponseIds[quesId]) {
        nextResponseIds[quesId] = 1;
    }
    let responseId = nextResponseIds[quesId];
    nextResponseIds[quesId]++;
    localStorage.setItem("nextResponseIds", JSON.stringify(nextResponseIds));
    return responseId;
}

function searchQuestions() {
    let searchValue = searchInput.value.trim().toLowerCase();
    let questions = document.querySelectorAll(".myQues");

    questions.forEach(question => {
        let questionTextElement = question.querySelector(".questions");
        let subjectTextElement = question.querySelector(".subject");
        let questionText = questionTextElement.textContent.toLowerCase();
        let subjectText = subjectTextElement.textContent.toLowerCase();
        if (subjectText.includes(searchValue) || questionText.includes(searchValue)) {
            question.style.display = "flex";
            if (subjectText.includes(searchValue)) {
                highlightText(subjectTextElement, searchValue);
            } else {
                resetHighlight(subjectTextElement);
            }
            if (questionText.includes(searchValue)) {
                highlightText(questionTextElement, searchValue);
            } else {
                resetHighlight(questionTextElement);
            }
        } else {
            question.style.display = "none";
            resetHighlight(subjectTextElement);
            resetHighlight(questionTextElement);
        }
    });
}

function highlightText(element, searchValue) {
    let innerHTML = element.textContent;
    let regex = new RegExp(`(${searchValue})`, 'gi');   //Regular expressions here g means global identifier i.e. it will check for the exact matching but i will not be checking exactly
    innerHTML = innerHTML.replace(regex, '<span class="highlight">$1</span>');
    element.innerHTML = innerHTML;
}

function resetHighlight(element) {
    element.innerHTML = element.textContent;
}
