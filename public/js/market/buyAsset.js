const web3 = new Web3(Web3.givenProvider)

async function toggleButton(id, price) {
    //get assets owner by id
    const owner = document.getElementById(`owner-${id}`)
    let DBT = await fetch("/getDBT")
        .then(response => {
            return response.json();
        })
    const instance = new web3.eth.Contract(
        DBT.abi,
        "0xEadb2cf873CA28E262a622Efdf376Fd60fcBC103"
    );
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    if (!accounts) { return }
    //send price to owner
    instance.methods.transfer(
        owner.innerText.substr(7),
        web3.utils.toWei(price.toString()).toString()
    ).send(
        {from: accounts[0]}
    )
    .then((res)=>{
        //adding asset on server to buyer
        //deleting from seller
        if (res.status == true) {
            fetch("/market/assets/buy", {
                method: "POST",
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    marketID: id,
                    buyer: accounts[0]
                })
            })
            alert("You just bougth asset!")
        } else {
            return;
        }
    })
}

function sendAlert() {
    alert("BUY")
}