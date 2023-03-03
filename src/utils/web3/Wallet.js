import { clearWalletProvider, connectToWallet, web3ModalProvider } from "./Web3Modal"
import Web3 from "web3"

import { setWallet } from "../../redux/walletSlice"
import store from '../../redux'
import {
  ComunityContractAddr,
  MembershipContractAddr,
  Membership721ContractAddr,
  MarketplaceContractAddr,
  UniftyContractAddr
} from "../../constant/contractAddr"
import MainABI from '../../constant/abi/MainABI.json'
import MembershipABI from '../../constant/abi/MembershipABI.json'
import Membership721ABI from '../../constant/abi/Membership721ABI.json'
import ReadmeABI from '../../constant/abi/ReadmeABI.json'
import MarketplaceABI from '../../constant/abi/MarketplaceABI.json'

export let accountAddress = undefined
export let web3Modal = undefined
export let chainId = null

// todo: this should use the RPC for the currently selected chain, in my case Goerli
const web3http = new Web3(new Web3.providers.HttpProvider("https://polygon-mainnet.public.blastapi.io"))
export let comunityContract = new web3http.eth.Contract(MainABI, ComunityContractAddr)
export let membershipContract = new web3http.eth.Contract(MembershipABI, MembershipContractAddr)
export let membershipContract721 = new web3http.eth.Contract(Membership721ABI, Membership721ContractAddr)
export let uniftyContract = new web3http.eth.Contract(ReadmeABI, UniftyContractAddr)

export const web3given = new Web3(Web3.givenProvider)
export let comunityContract2 = new web3given.eth.Contract(MainABI, ComunityContractAddr)
export let membershipContract2 = new web3given.eth.Contract(MembershipABI, MembershipContractAddr)
export let uniftyContract2 = new web3given.eth.Contract(ReadmeABI, UniftyContractAddr)
export let marketplaceContract2 = new web3given.eth.Contract(MarketplaceABI, MarketplaceContractAddr)

async function updateAccount() {
  const accounts = await web3Modal.eth.getAccounts()
  updateAccountAddress(accounts)

  if (web3ModalProvider !== undefined && web3ModalProvider !== null) {
    web3ModalProvider.on("accountsChanged", (accounts) => {
      updateAccountAddress(accounts)
      store.dispatch(setWallet(accounts[0]))
    })
    web3ModalProvider.on("chainChanged", (id) => {
      window.location.reload()
    })
  }
}

export async function initWallet() {
  try {
    web3Modal = await connectToWallet()
    chainId = await web3Modal.eth.net.getId()
    await updateAccount()
  } catch (e) {
    console.log("wallet connect error, reconnecting")
  }
}

export function updateAccountAddress(accounts) {
  if (accounts !== undefined && accounts.length > 0) {
    accountAddress = accounts[0]
  } else if (accountAddress !== undefined) {
    clearWalletProvider()
    accountAddress = undefined
  }
}

export function closeWalletProvider() {
  clearWalletProvider()
}