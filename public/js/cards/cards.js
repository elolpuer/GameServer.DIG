
// var Web3 = require('web3');
// // use the given Provider, e.g in Mist, or instantiate a new websocket provider

// var web3 = new Web3(window.ethereum)
// window.userWalletAddress = null
// const buyButton = document.getElementById('buyButton')
async function getCards() {
    const web3 = new Web3(Web3.givenProvider)
    let DIG = await fetch("/getDIG")
        .then(response => {
            return response.json();
        })
    const instance = new web3.eth.Contract(
        DIG.abi,
        "0x1514dC8D47BfC45442387D1f985702e10e2fCDF0"
    );
    let account = await web3.eth.getAccounts();
    const tokens = await instance.methods.getCurrentTokenID().call()
    let cards = []
    for (let i = 0; i < tokens; i++) {
        let owner = await instance.methods.ownerOf(i+1).call()
        if (owner == account[0]) {
            cards.push(i+1)
        }
    }
    // let userCards = await fetch("/cards/get", {
    //     method: "POST",
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({
    //         cards: cards
    //     })
    // }).then(async (res) => {
    //     return await res.json()
    // })
    // let newDiv = document.createElement("div");
    // let listElement = document.createElement("ul")
    let value = ""
    for(let i = 0; i < cards.length; i++) {
        value += cards[i].toString()
        if (i != cards[i].length - 1) {
            value += ","
        }
    }
    let listChildDiv = document.createElement("input")
    listChildDiv.value = value
    listChildDiv.type = "hidden"
    listChildDiv.name = "cards"
    let button = document.createElement("button")
    button.innerText = "Get Abilities"
    button.type = "submit"
    // newDiv.appendChild(listChildDiv)
    // for (let i=0; i < userCards; i++) {
    //     newDiv.innerHTML =
    // }
    // newDiv.innerHTML = "<h1>Привет!</h1>";
    // newDiv.innerHTML = "<h1>Привет!</h1>";
    document.getElementById("getForm").appendChild(listChildDiv)
    document.getElementById("getForm").appendChild(button)
    // document.body.appendChild(newDiv)
    if (cards.length > 0) {
        alert(`IDs: ${cards}`)
    } else {
        alert(`Your dont have cards`)
    }
}

async function toggleButton(id, maxAbility) {
    const web3 = new Web3(Web3.givenProvider)
    let Rent = await fetch("/getRent")
        .then(response => {
            return response.json();
        })
    const instance = new web3.eth.Contract(
        Rent.abi,
        "0x9173a93CdCEA2E10F6aE64e12A0412f6680FFf29"
    );
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    if (!accounts) { return }
    instance.methods.createOrder(
        id.toString(),
        web3.utils.toWei('1'), //1 DBT
        '10', //time in days
        maxAbility
    ).send(
        {from: accounts[0]}
    )
    .then(async (res)=>{
        console.log(res)
        // if (res.status == true) {
        //     const tokenID = await instance.methods.getCurrentTokenID().call()
        //     fetch("/laboratory/combining/mint", {
        //         method: "POST",
        //         headers: {
        //           'Content-Type': 'application/json'
        //         },
        //         body: JSON.stringify({
        //             cardID: tokenID
        //         })
        //     })
        // } else {
        //     return;
        // }
    })
}