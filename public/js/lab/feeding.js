const web3 = new Web3(Web3.givenProvider)
//get card that we want to feed
const card = document.getElementById('card')
//get card abilities
const numAbilities = document.getElementsByClassName("numAbility")
//get initial abilities
const alwaysAbilities = document.getElementsByClassName("alwaysAbility")

async function toggleButton() {
    //checks if abilities is equal
    for (let i = 0; i < numAbilities.length; i++) {
        //if equal we cant feed
        if (numAbilities[0].lastChild.innerText == alwaysAbilities[0].lastChild.innerText){
            return;
        } else {
            continue;
        }
    }
    //get digibytes contract
    let DBT = await fetch("/getDBT")
        .then(response => {
            return response.json();
        })
    const instance = new web3.eth.Contract(
        DBT.abi,
        "0xEadb2cf873CA28E262a622Efdf376Fd60fcBC103"
    );
    let accounts = await web3.eth.getAccounts();
    //send with price for feed
    instance.methods.transfer(
        "0xA841a2a238Fa48D1C409D95E64c3F08d8Dd5DdA7",
        web3.utils.toWei("0.01").toString()
    ).send(
        {from: accounts[0]}
    )
    .then((res)=>{
        //send request for feed to server
        if (res.status == true) {
            fetch("/laboratory/feeding/feed", {
                method: "POST",
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    card: card.value
                })
            })
            alert(`You just fed your golem with id: ${card.value}`)
        } else {
            return;
        }
    })
}
