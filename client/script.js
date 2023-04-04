import bot from './assets/bot.svg'
import user from './assets/user.svg'

const form = document.querySelector('form')
const chatContainer = document.querySelector('#chat_container')
// const user_input_container = document.querySelector('#user_input_container') // for Test purposes


const options = [];
const optionCheckboxes = document.querySelectorAll('input[name="options"]:checked');

optionCheckboxes.forEach((checkbox) => {
    options.push(checkbox.value);
});


const optionsA = [];
const optionCheckboxesA = document.querySelectorAll('input[name="options"]:checked');
optionCheckboxesA.forEach((checkbox) => {
    optionsA.push(checkbox.value);
});


let loadInterval

function loader(element) {
    element.textContent = ''

    loadInterval = setInterval(() => {
        // Update the text content of the loading indicator
        element.textContent += '.';

        // If the loading indicator has reached three dots, reset it
        if (element.textContent === '....') {
            element.textContent = '';
        }
    }, 300);
}

function typeText(element, text) {
    let index = 0

    let interval = setInterval(() => {
        if (index < text.length) {
            element.innerHTML += text.charAt(index)
            index++
        } else {
            clearInterval(interval)
        }
    }, 20)
}

// generate unique ID for each message div of bot to display or reuse for Re-Generator.
// necessary for typing text effect for that specific answer
// without unique ID, typing text will work on every element
function generateUniqueId() {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniqueId) {
    return (
        `
        <div class="wrapper ${isAi && 'ai'}">
            <div class="chat">
                <div class="profile">
                    <img 
                      src=${isAi ? bot : user} 
                      alt="${isAi ? 'bot' : 'user'}" 
                    />
                </div>
                <div class="message" id=${uniqueId}>${value}</div>
            </div>
        </div>
    `
    )
}




const handleSubmit = async (e) => {
    e.preventDefault()

    const dataTopic = new FormData(form)
    const dataWord = new FormData(form)
    const dataComplex = new FormData(form)
    const dataTense = new FormData(form)
    const dataGrammar = new FormData(form)

    // user's chatstripe view for data taken by fetched from the client     TESTING PURPOSES 

    // chatContainer.innerHTML += chatStripe(false, dataTopic.get('topic'))
    // chatContainer.innerHTML += chatStripe(false, dataWord.get('words'))
    // chatContainer.innerHTML += chatStripe(false, dataComplex.get('complex'))
    // chatContainer.innerHTML += chatStripe(false, dataTense.get('options'))
    // chatContainer.innerHTML += chatStripe(false, dataGrammar.get('optionsA'))

    // To clear the textarea input 

    //form.reset()

    // bot's chatstripe
    const uniqueId = generateUniqueId()
    chatContainer.innerHTML += chatStripe(true, " ", uniqueId)


    // to focus scroll to the bottom 
    chatContainer.scrollTop = chatContainer.scrollHeight;


    // specific message div 
    const messageDiv = document.getElementById(uniqueId)

    messageDiv.innerHTML = "..."
    loader(messageDiv)

    const response = await fetch('http://localhost:5000', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            promptTopic: dataTopic.get('topic'),
            promptWord: dataWord.get('word'),
            promptComplex: dataComplex.get('complex'),

        })
    })


    clearInterval(loadInterval)
    messageDiv.innerHTML = " "

    if (response.ok) {
        const data = await response.json();
        const parsedData = data.bot.trim() // trims any trailing spaces/'\n' 

        typeText(messageDiv, parsedData)

    } else {
        const err = await response.text()

        messageDiv.innerHTML = "Something went wrong"
        alert(err)
    }
}

form.addEventListener('submit', handleSubmit)
form.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
        handleSubmit(e)
    }
})