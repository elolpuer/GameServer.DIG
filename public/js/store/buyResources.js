
// var Web3 = require('web3');
// // use the given Provider, e.g in Mist, or instantiate a new websocket provider

// var web3 = new Web3(window.ethereum)
const web3 = new Web3(Web3.givenProvider)
// window.userWalletAddress = null
// const buyButton = document.getElementById('buyButton')
// const userWallet = document.getElementById('userWallet')
const inputs = document.querySelectorAll('input');

async function toggleButton() {
    let DBT = await fetch("/getDBT")
        .then(response => {
            return response.json();
        })
    const instance = new web3.eth.Contract(
        DBT.abi,
        "0xEadb2cf873CA28E262a622Efdf376Fd60fcBC103"
    );
    // console.log(DBT.networks[networkId])
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    if (!accounts) { return }
    let countsValue = 0
    inputs.forEach((input) => {
        countsValue+=parseInt(input.value)
    })
    instance.methods.transfer(
        "0xA841a2a238Fa48D1C409D95E64c3F08d8Dd5DdA7",
        (web3.utils.toWei("0.01") * countsValue).toString()
    ).send(
        {from: accounts[0]}
    )
    .then((res)=>{
        if (res.status == true) {
            fetch("/store/resources/buy", {
                method: "POST",
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    lymph: {id: 0, amount:inputs[0].value},
                    ash: {id: 1, amount:inputs[1].value},
                    flowerum: {id: 2, amount:inputs[2].value},
                    electron: {id: 3, amount:inputs[3].value}
                })
            })
            alert("You just bougth resources!")
        } else {
            return;
        }
    })
    // web3.eth.sendTransaction({
    //     from: accounts[0],
    //     to: '0xA841a2a238Fa48D1C409D95E64c3F08d8Dd5DdA7',
    //     value: web3.utils.toWei("0.01") * countsValue
    // })
    // .then((res)=>{
    //     if (res.status == true) {
    //         fetch("/store/augmentations/buy", {
    //             method: "POST",
    //             headers: {
    //               'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify({
    //                 telekinetics: inputs[0].value,
    //                 ichthyo: inputs[1].value,
    //                 ornio: inputs[2].value,
    //                 hacker: inputs[3].value,
    //                 shair: inputs[4].value,
    //                 impulse: inputs[5].value,
    //                 meteodron: inputs[6].value,
    //                 vibroImpact: inputs[7].value,
    //                 holdIncrease: inputs[8].value
    //             })
    //         })
    //     } else {
    //         return;
    //     }
    // });
    // alert(accounts[0])
    // buyButton.addEventListener('click', sendAlert)
    // sendAlert()
}

function sendAlert() {
    alert("BUY")
}