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

      await AlgoSigner.connect()

      const algodServer = 'https://testnet-algorand.api.purestake.io/ps2'
      const indexerServer = 'https://testnet-algorand.api.purestake.io/idx2'
      const token = { 'X-API-Key': 'cnPOsJmkLV99ccOnzgC3d9DOrHyXrs5ka9JB2Vcl' }
      const port = ''

      const algodClient = new algosdk.Algodv2(token, algodServer, port)
      const indexerClient = new algosdk.Indexer(token, indexerServer, port)

      const health = await algodClient.healthCheck().do()
      console.log(health)

      const accounts = await AlgoSigner.accounts({
        ledger: 'TestNet',
      })
      address = accounts[0]?.address
      console.log(address)

      params = await algodClient.getTransactionParams().do()
      console.log(params)

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
    const resp = await AlgoSigner.indexer({
      ledger: 'TestNet',
      path: `/v2/assets?name=${'ALGOSPACE Ship'}&limit=${4}&creator=${address}`,
    })

    resp.assets.forEach((nft: any) => {
      if (nft.params.name.indexOf('ALGOSPACE Ship') >= 0) {
        state.ownedShips.push({
          tokenId: nft.index,
          shipCode: nft.params.name.replace('ALGOSPACE Ship ', ''),
        })
      }
    })
  } catch (e: any) {
    console.log(e)
    // window.location.reload()
  }
}

export const mintShip = async () => {
  const creator = address
  const defaultFrozen = false
  const unitName = 'DSL'
  const assetName = 'ALGOSPACE Ship 0000'
  const url = 'https://algospace.app/assets/ships/0000.json'
  const managerAddr = undefined
  const reserveAddr = undefined
  const freezeAddr = undefined
  const clawbackAddr = undefined
  const total = 1 // NFTs have totalIssuance of exactly 1
  const decimals = 0 // NFTs have decimals of exactly 0

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
  const signedTxs = await AlgoSigner.signTxn([{ txn: txn_b64 }])
  const sent = await AlgoSigner.send({
    ledger: 'TestNet',
    tx: signedTxs[0].blob,
  })
  console.log(sent)
}

export const upgradeShip = async (ship: ShipToken) => {
  const creator = address
  const defaultFrozen = false
  const unitName = 'DSL'
  const assetName = `ALGOSPACE Ship ${ship.shipCode}`
  const url = `https://algospace.app/assets/ships/${ship.shipCode}.json`
  const managerAddr = undefined
  const reserveAddr = undefined
  const freezeAddr = undefined
  const clawbackAddr = undefined
  const total = 1 // NFTs have totalIssuance of exactly 1
  const decimals = 0 // NFTs have decimals of exactly 0

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
  const signedTxs = await AlgoSigner.signTxn([{ txn: txn_b64 }])
  const sent = await AlgoSigner.send({
    ledger: 'TestNet',
    tx: signedTxs[0].blob,
  })
  console.log(sent)
}

export const getTokenBalance = async () => {}

export const mintTokens = async () => {}

export const burnTokens = async () => {}
