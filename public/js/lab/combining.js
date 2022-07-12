const web3 = new Web3(Web3.givenProvider)

async function toggleButton() {
    //get sign that we send from server
    const v = document.getElementById('v')
    const r = document.getElementById('r')
    const s = document.getElementById('s')
    //and url of golem's picture
    const url = document.getElementById("url")
    //get Digital Golem contract for mint
    let DIG = await fetch("/getDIG")
        .then(response => {
            return response.json();
        })
    const instance = new web3.eth.Contract(
        DIG.abi,
        "0x1514dC8D47BfC45442387D1f985702e10e2fCDF0"
    );
    //get accounts from user browser
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    if (!accounts) { return }
    //award with sign
    
    instance.methods.awardItem(
        accounts[0],
        url.value,
        v.value,
        r.value,
        s.value
    ).send(
        {from: accounts[0]}
    ) //then send request to server for creating abilities
    .then(async (res)=>{
        if (res.status == true) {
            //get tokenID that we create
            const tokenID = await instance.methods.getCurrentTokenID().call()
            fetch("/laboratory/combining/mint", {
                method: "POST",
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    cardID: tokenID
                })
            })
            alert("You just mint your golem!!!")
        } else {
            return;
        }
    })
}
