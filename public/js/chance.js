const web3 = new Web3(Web3.givenProvider)

async function toggleButton(percent) {
    console.log(percent == '75')
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
        "0xA841a2a238Fa48D1C409D95E64c3F08d8Dd5DdA7",
        percent == '50' 
        ?
        (web3.utils.toWei("0.05")).toString()
        :
        (web3.utils.toWei("0.075")).toString()
    ).send(
        {from: accounts[0]}
    )
    .then((res)=>{
        if (res.status == true) {
            fetch(
                percent == '50'
                ?
                "/laboratory/combining/chance50"
                :
                "/laboratory/combining/chance75", 
                {
                method: "POST",
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    address: accounts[0]
                })
            })
            alert("You just bought chance!")
        } else {
            return;
        }
    })
}
