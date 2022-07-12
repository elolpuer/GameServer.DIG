const web3 = new Web3(Web3.givenProvider)
//get all inputs of augment
const inputs = document.querySelectorAll('input');

async function toggleButton() {
    //get DBT contract
    let DBT = await fetch("/getDBT")
        .then(response => {
            return response.json();
        })
    const instance = new web3.eth.Contract(
        DBT.abi,
        "0xEadb2cf873CA28E262a622Efdf376Fd60fcBC103"
    );
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    console.log(inputs[0])
    if (!accounts) { return }
    //count how much augment buyer wants
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
        //adding to db what user bought
        if (res.status == true) {
            fetch("/store/augmentations/buy", {
                method: "POST",
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    telekinetics: {id: 0, amount: inputs[0].value},
                    ichthyo: {id: 1, amount: inputs[1].value},
                    ornio: {id: 2, amount: inputs[2].value},
                    hacker: {id: 3, amount: inputs[3].value},
                    shair: {id: 4, amount: inputs[4].value},
                    impulse: {id: 5, amount: inputs[5].value},
                    meteodron: {id: 6, amount: inputs[6].value},
                    vibroImpact: {id: 7, amount: inputs[7].value},
                    holdIncrease: {id: 8, amount: inputs[8].value}
                })
            })
            alert("You just bougth augmentations!")
        } else {
            return;
        }
    })
}
