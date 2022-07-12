const web3 = new Web3(Web3.givenProvider)
//get card that we want to conserve
const card = document.getElementById('card')
//and get ability that we what to increase
const ability = document.getElementById("ability")

async function toggleButton() {
    //get Digibytes token
    let DBT = await fetch("/getDBT")
        .then(response => {
            return response.json();
        })
    const instance = new web3.eth.Contract(
        DBT.abi,
        "0xEadb2cf873CA28E262a622Efdf376Fd60fcBC103"
    );
    console.log(card.value)
    //get user account
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    if (!accounts) { return }
    //send to our account conservation price
    instance.methods.transfer(
        "0xA841a2a238Fa48D1C409D95E64c3F08d8Dd5DdA7",
        web3.utils.toWei("0.05").toString()
    ).send(
        {from: accounts[0]}
    ) //then send request to server for conserving
    .then((res)=>{
        if (res.status == true) {
            fetch("/laboratory/conservation/conserve", {
                method: "POST",
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    card: card.value,
                    ability: ability.value
                })
            })
            alert("You just conserve your golem!")
        } else {
            return;
        }
    })
}