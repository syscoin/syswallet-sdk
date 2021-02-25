const sjs = require('syscoinjs-lib')
const axios = require('axios')
const bip39 = require('bip39')
const bip84 = require('bip84')

// const mnemonic = bip39.generateMnemonic()
const mnemonic = "peace uncle grit essence stuff angle cruise annual fury letter snack globe" 

const HDSigner = new sjs.utils.HDSigner(mnemonic, "test", true)
const backendURL = 'https://sys-explorer.tk/' 
const syscoinjs = new sjs.SyscoinJSLib(HDSigner, backendURL)
const Account0Address0 = 'tsys1q73zx5mwe4nhpgchn4fc8432yxuzeyevtyqsmgq'
const Account1Address0 = "tsys1qma37l03q036525653n5m66yun3m7kkjxdm42jk"

async function getFeeRate(){
  const block = await axios.get(backendURL + "/api/v2")
  console.log(block.data.backend.blocks)
  const feeRate = await axios.get(backendURL + "/api/v2/estimatefee/0")
  console.log(feeRate.data.result)
}
// getFeeRate()

function getRoot() {
  console.log('mnemonic:', mnemonic)
  console.log('rootpriv:', HDSigner.fromSeed.getRootPrivateKey())
  console.log('rootpub:', HDSigner.fromSeed.getRootPublicKey())
  console.log('\n');
}
// getRoot()

function getPKeyfromAccountZero(){
  var account0 = HDSigner.accounts[0]
  console.log("Account 0, root = m/84'/0'/0'")
  console.log('Account 0 xprv:', account0.getAccountPrivateKey())
  console.log('Account 0 xpub:', account0.getAccountPublicKey())
  console.log('\n');
}
// getPKeyfromAccountZero()

function getAddressZero(){
  var account0 = HDSigner.accounts[0]
  console.log("Account 0, first receiving address = m/84'/0'/0'/0/0");
  console.log('Prvkey:', account0.getPrivateKey(0))
  console.log('Pubkey:', account0.getPublicKey(0))
  console.log('Address:', account0.getAddress(0))
  console.log('\n');
}
// getAddressZero()

function getChangeZero(){
  var account0 = HDSigner.accounts[0]
  console.log("Account 0, first change address = m/84'/0'/0'/1/0");
  console.log('Prvkey:', account0.getPrivateKey(0,true))
  console.log('Pubkey:', account0.getPublicKey(0,true))
  console.log('Address:', account0.getAddress(0,true))
  console.log('\n');
}
// getChangeZero()


function getXpub(){
  console.log("Account Xpub ", HDSigner.getAccountXpub())
  console.log('\n');
}
// getXpub()

function newAccount(){
  index = HDSigner.createAccount()
  var account = HDSigner.accounts[index]
  console.log("New Account", index,  ", first receiving address = m/84'/x'/x'/0/0");
  console.log('Prvkey:', account.getPrivateKey(0))
  console.log('Pubkey:', account.getPublicKey(0))
  console.log('Address:', account.getAddress(0))
  console.log('\n');
}
// newAccount()


async function sendSys () {
  const _outputsArr = [
    { address: Account0Address0, value: new sjs.utils.BN(100000000) }
  ]
  const res = await syscoinjs.createTransaction(txOpts={ rbf: false }, sysChangeAddress=null, outputsArr=_outputsArr, feeRate=new sjs.utils.BN(10))
  console.log(res) 
}
// sendSys()


async function newAsset () {
  const _assetOpts = { 
    precision: 8, symbol: 'Quan', maxsupply: new sjs.utils.BN(100000000000), description: 'publicvalue' 
  }
  const res = await syscoinjs.assetNew(assetOpts=_assetOpts, txOpts={ rbf: false }, sysChangeAddress=null, sysReceivingAddress=Account0Address0, feeRate = new sjs.utils.BN(10))
  console.log(res)
}
// newAsset()


async function issueAsset () {
  const assetGuid = '382052179'
  const _assetMap = new Map([
    [assetGuid, { changeAddress: null, outputs: [{ value: new sjs.utils.BN(100000000000), address: Account0Address0}]}],
  ])
  const res = await syscoinjs.assetSend(txOpts={ rbf: true }, assetMap=_assetMap, sysChangeAddress=Account0Address0, feeRate=new sjs.utils.BN(10))
}
// issueAsset()
