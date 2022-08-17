import algosdk from 'algosdk'
import { ShipToken } from 'state/stateTypes'
import { state } from '../state/state'

export const connectWallet = async () => {
  try {
    //@ts-ignore
    if (typeof AlgoSigner !== 'undefined') {
      console.log('AlgoSigner is installed.')

      const algodServer = 'https://testnet-algorand.api.purestake.io/ps2'
      const indexerServer = 'https://testnet-algorand.api.purestake.io/idx2'
      const token = { 'X-API-Key': 'cnPOsJmkLV99ccOnzgC3d9DOrHyXrs5ka9JB2Vcl' }
      const port = ''

      const algodClient = new algosdk.Algodv2(token, algodServer, port)
      const indexerClient = new algosdk.Indexer(token, indexerServer, port)

      algodClient
        .healthCheck()
        .do()
        .then((d: any) => {
          console.log(d)
        })
        .catch((e: any) => {
          console.error(e)
        })

    } else {
      console.log('AlgoSigner is NOT installed.')
    }
  } catch (e: any) {
    console.log(e)
    // window.location.reload()
  }
}

export const getShips = async () => {
  try {
    state.ownedShips = []
  } catch (e: any) {
    console.log(e)
    // window.location.reload()
  }
}

export const mintShip = async () => {}

export const upgradeShip = async (ship: ShipToken) => {}

export const getTokenBalance = async () => {}

export const mintTokens = async () => {}

export const burnTokens = async () => {}
