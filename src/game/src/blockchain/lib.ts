import algosdk from 'algosdk'
import { ShipToken } from 'state/stateTypes'
import { state } from '../state/state'

declare const AlgoSigner: any

let address: string
let params: any

export const connectWallet = async () => {
  try {
    if (typeof AlgoSigner !== 'undefined') {
      console.log('AlgoSigner is installed.')

      const algodServer = 'https://testnet-algorand.api.purestake.io/ps2'
      const indexerServer = 'https://testnet-algorand.api.purestake.io/idx2'
      const token = { 'X-API-Key': 'cnPOsJmkLV99ccOnzgC3d9DOrHyXrs5ka9JB2Vcl' }
      const port = ''

      const algodClient = new algosdk.Algodv2(token, algodServer, port)
      const indexerClient = new algosdk.Indexer(token, indexerServer, port)

      // Check health
      algodClient
        .healthCheck()
        .do()
        .then((d: any) => {
          console.log(d)

          // Fetch accounts
          AlgoSigner.accounts({
            ledger: 'TestNet',
          })
            .then((d: any) => {
              address = d[0]?.address
              console.log(address)

              // Get params
              algodClient
                .getTransactionParams()
                .do()
                .then((d: any) => {
                  params = d
                })
                .catch((e: any) => {
                  console.error(e)
                })
            })
            .catch((e: any) => {
              console.error(e)
            })
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

export const mintShip = async () => {
  const creator = address
  const defaultFrozen = false
  const unitName = 'ALGOSPACE'
  const assetName = 'ALGOSPACE Ship 0000'
  const url = 'https://algospace.app/assets/ships/0000.json'
  const managerAddr = undefined
  const reserveAddr = undefined
  const freezeAddr = undefined
  const clawbackAddr = undefined
  const total = 1 // NFTs have totalIssuance of exactly 1
  const decimals = 0 // NFTs have decimals of exactly 0

  // const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
  //   from: creator,
  //   assetName,
  //   unitName,
  //   total: 1,
  //   decimals: 0,
  //   suggestedParams: { ...params },
  // })

  const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
    from: creator,
    total,
    decimals,
    assetName,
    unitName,
    assetURL: url,
    // assetMetadataHash: metadata,
    defaultFrozen,
    freeze: freezeAddr,
    manager: managerAddr,
    clawback: clawbackAddr,
    reserve: reserveAddr,
    suggestedParams: params,
  })

  const txn_b64 = AlgoSigner.encoding.msgpackToBase64(txn.toByte())
  let signedTxs

  // Sign Tx
  AlgoSigner.signTxn([{ txn: txn_b64 }])
    .then((d: any) => {
      signedTxs = d

      // Send Tx
      AlgoSigner.send({
        ledger: 'TestNet',
        tx: signedTxs[0].blob,
      })
        .then((d: any) => {
          console.log(d)
        })
        .catch((e: any) => {
          console.error(e)
        })
    })
    .catch((e: any) => {
      console.error(e)
    })
}

export const upgradeShip = async (ship: ShipToken) => {}

export const getTokenBalance = async () => {}

export const mintTokens = async () => {}

export const burnTokens = async () => {}
