
const url = 'https://webhook.site/f7499a86-a3f7-42f1-88a9-b5561e83cdac';
const form = document.querySelector('[form]');
const attemptButton = document.querySelector('[attempt-button]');
const rouletteDisc = document.querySelector("[roulette-disc]");

const hiddenAttr = "hidden";

const showOnWin         = document.querySelectorAll('[show-on-win]');
const showOnLoss        = document.querySelectorAll('[show-on-loss]');
const showOnAttempt     = document.querySelectorAll('[show-on-attempt]');
const hideOnWin         = document.querySelectorAll('[hide-on-win]');
const hideOnLoss        = document.querySelectorAll('[hide-on-loss]');
const hideOnAttempt     = document.querySelectorAll('[hide-on-attempt]');

const prizesList = {
    win: [1, 3, 5, 6, 7, 8],
    loss: [2, 4],
    count: 8
}
const attemptsMax = 3;
const animSpeed = 3;
const dummyResponse = {prize: 3, winnum: 3} //заменить переменную 'dummyResponse' на ответ с эндпоинта далее в коде

let current = 0;
let dataResponse;

form.addEventListener('submit', (e) => {
    e.preventDefault();
    form.querySelector(".btn").setAttribute("disabled", "disabled");
    form.querySelector(".btn").setAttribute("value", "Перевіряємо...");
    const formData = new FormData(form);
    postData(url, { email: formData.get('email'), phone: formData.get('phone') }).then((data) => {
        form.querySelector(".btn").setAttribute("value", "Все добре!");
        //console.log("data response", data);
        dataResponse = dummyResponse
        current++;
        rouletteStart(dataResponse)
        
        attemptButton.addEventListener('click', (e) => {
            console.log("attemptButton click")
            e.preventDefault();
            current++;
            rouletteStart(dataResponse);
        });
    });
});

async function postData(url, data) {
    const response = await fetch(url, {
        method: 'POST', 
        mode: 'no-cors',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });
    return await response;
}

const rouletteStart = (data)=>{
    if(data.winnum===0){
        if(current===attemptsMax){
            console.log("LOSS", current, data.winnum)
            rouletteAnimate(prizesList.loss[0])
            elementsShow(showOnLoss)
            elementsHide(hideOnLoss)
        }else{
            console.log("another", current, data.winnum)
            rouletteAnimate(prizesList.loss[0])
            elementsShow(showOnAttempt)
            elementsHide(hideOnAttempt)
        }
    }else{
        if(data.winnum===current){
            console.log("WIN", current, data.winnum)
            rouletteAnimate(data.prize)
            elementsShow(showOnWin)
            elementsHide(hideOnWin)
        }else{
            console.log("another", current, data.winnum)
            rouletteAnimate(prizesList.loss[0])
            elementsShow(showOnAttempt)
            elementsHide( hideOnAttempt)
        }
    }
}

const rouletteAnimate = (prize)=>{
    console.log("rouletteAnimate prize", prize)
    let angle = getRandomArbitrary(1,4) - 1/prizesList.count*(prize-1);
    rouletteDisc.style.transform = 'rotate('+angle+'turn)';
    rouletteDisc.style.transition = animSpeed+'s';
}

const elementsHide = (elements)=>{
    setTimeout(()=>{
        elements.forEach(item=>{
            item.setAttribute(hiddenAttr,"")
        })
    }, animSpeed*1000)
}
const elementsShow = (elements)=>{
    setTimeout(()=>{
        elements.forEach(item=>{
            item.removeAttribute(hiddenAttr)
        })
    }, animSpeed*1000)
}

let lastRand;
const getRandomArbitrary = (min, max)=>{
    const rand = Math.floor(Math.random() * (max - min) + min)
    let c = lastRand === rand ? 1 : 0
    lastRand = rand + c
    return rand + c; 
}