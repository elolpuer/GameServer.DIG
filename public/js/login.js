// import GameContract from './contracts/Card.json';
// import getWeb3 from "./getWeb3";


window.userWalletAddress = null
const loginButton = document.getElementById('loginButton')
const userWallet = document.getElementById('userWallet')
const web3 = new Web3(Web3.givenProvider)

async function loginWithMetaMask() {
  if (!window.ethereum) {
    loginButton.innerText = 'MetaMask is not installed'
    loginButton.classList.remove('bg-purple-500', 'text-white')
    loginButton.classList.add('bg-gray-500', 'text-gray-100', 'cursor-not-allowed')
    return false
  }
  if (loginButton.innerText == "Connect Wallet") {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    if (!accounts) { return }

    window.userWalletAddress = accounts[0]
    loginButton.innerText = window.userWalletAddress
    fetch("/login", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
            address: accounts[0]
      })
    })
  } else {
    fetch("/logout", {
      method: "POST"
    })
    loginButton.innerText = "Connect Wallet"
  }
}
