import { isEthAddress, isEthBlockTag, isEthNonce, isEthTxHash, isHex, toBoolean } from '@/core/validation/eth.helpers'
import { Joi, JoiRpcSchemas } from '@/core/validation/joi'
import _ from 'lodash'
const Method = require('web3-core-method') // tslint:disable-line

/** Override basic web3 'Method' class to allow having better params validation */
export class Web3Method extends Method {
  constructor(options: any) {
    super(options)
    super.validate = options.validate || (() => true)
    super.schema = options.schema || {}
  }

  validateArgs(args: any[] = []) {
    if (args.length !== super.params) {
      throw errors.InvalidNumberOfParams(args.length, super.params, super.name)
    }

    const result = super.validate(args)
    if (!result) {
      throw errors.InvalidNumberOfParams(args.length, super.params, super.name)
    }
  }

  formatOutput(result) {
    if (super.outputFormatter) {
      return super.outputFormatter(result)
    }
    return result
  }
}

export const WEB3_SUPPORTED_RPC_METHODS = [
  new Web3Method({
    name: 'web3_clientVersion',
    call: 'web3_clientVersion',
  }),
  new Web3Method({
    name: 'net_version',
    call: 'net_version',
  }),
  new Web3Method({
    name: 'net_listening',
    call: 'net_listening',
  }),
  new Web3Method({
    name: 'net_peerCount',
    call: 'net_peerCount',
  }),
  new Web3Method({
    name: 'eth_protocolVersion',
    call: 'eth_protocolVersion',
  }),
  new Web3Method({
    name: 'eth_syncing',
    call: 'eth_syncing',
  }),
  new Web3Method({
    name: 'eth_mining',
    call: 'eth_mining',
  }),
  new Web3Method({
    name: 'eth_hashrate',
    call: 'eth_hashrate',
  }),
  new Web3Method({
    name: 'eth_gasPrice',
    call: 'eth_gasPrice',
  }),
  new Web3Method({
    name: 'eth_accounts',
    call: 'eth_accounts',
    outputFormatter: res => (_.isNull(res) ? [] : res),
  }),
  new Web3Method({
    name: 'eth_blockNumber',
    call: 'eth_blockNumber',
  }),
  new Web3Method({
    name: 'eth_getCompilers',
    call: 'eth_getCompilers',
  }),
  new Web3Method({
    name: 'eth_getWork',
    call: 'eth_getWork',
    outputFormatter: res => (_.isNull(res) ? [] : res),
  }),
  new Web3Method({
    name: 'eth_getBalance',
    call: 'eth_getBalance',
    params: 2,
    validate: args => {
      const address = args[0]
      const isAddress =  isEthAddress(address)
      if (!isAddress) {
        return false
      }

      const quantity = args[1]
      const isQuantity = isEthBlockTag(quantity) || isHex(quantity)
      if (!isQuantity) {
        return false
      }

      return true
    },
  }),
  new Web3Method({
    name: 'eth_getStorageAt',
    call: 'eth_getStorageAt',
    params: 3,
    validate: args => {
      const address = args[0]
      const isAddress = isEthAddress(address)
      if (!isAddress) {
        return false
      }

      const position = args[1]
      const isPosition = isHex(position)
      if (!isPosition) {
        return false
      }

      const blockNumber = args[2]
      const isBlockNumber = isEthBlockTag(blockNumber) || isHex(blockNumber)
      if (!isBlockNumber) {
        return false
      }

      return true
    },
  }),
  new Web3Method({
    name: 'eth_getTransactionCount',
    call: 'eth_getTransactionCount',
    params: 2,
    validate: args => {
      const address = args[0]
      const isAddress = isEthAddress(address)
      if (!isAddress) {
        return false
      }

      const quantity = args[1]
      const isQuantity = isEthBlockTag(quantity) || isHex(quantity)
      if (!isQuantity) {
        return false
      }

      return true
    },
  }),
  new Web3Method({
    name: 'eth_getBlockTransactionCountByHash',
    call: 'eth_getBlockTransactionCountByHash',
    params: 1,
    validate: args => {
      const txHash = args[0]
      return isEthTxHash(txHash)
    },
    outputFormatter: res => (_.isNull(res) ? '' : res),
  }),
  new Web3Method({
    name: 'eth_getBlockTransactionCountByNumber',
    call: 'eth_getBlockTransactionCountByNumber',
    params: 1,
    validate: args => {
      const quantity = args[0]
      return isEthBlockTag(quantity) || isHex(quantity)
    },
    outputFormatter: res => (_.isNull(res) ? '' : res),
  }),
  new Web3Method({
    name: 'eth_getUncleCountByBlockHash',
    call: 'eth_getUncleCountByBlockHash',
    params: 1,
    validate: args => {
      const txHash = args[0]
      return isEthTxHash(txHash)
    },
    outputFormatter: res => (_.isNull(res) ? '' : res),
  }),
  new Web3Method({
    name: 'eth_getUncleCountByBlockNumber',
    call: 'eth_getUncleCountByBlockNumber',
    params: 1,
    validate: args => {
      const quantity = args[0]
      return isEthBlockTag(quantity) || isHex(quantity)
    },
    outputFormatter: res => (_.isNull(res) ? '' : res),
  }),
  new Web3Method({
    name: 'eth_getCode',
    call: 'eth_getCode',
    params: 2,
    validate: args => {
      const address = args[0]
      const isAddress = isEthAddress(address)
      if (!isAddress) {
        return false
      }

      const quantity = args[1]
      const isQuantity = isEthBlockTag(quantity) || isHex(quantity)
      if (!isQuantity) {
        return false
      }

      return true
    },
    outputFormatter: res => (_.isNull(res) ? '' : res),
  }),
  new Web3Method({
    name: 'eth_call',
    call: 'eth_call',
    params: 2,
    validate: args => {
      const obj = args[0]
      const isObj = _.isObject(obj)
      if (!isObj) {
        return false
      }

      const result = Joi.validate(obj, JoiRpcSchemas.SendTx)
      if (result.error) {
        return false
      }

      const quantity = args[1]
      const isQuantity = isEthBlockTag(quantity) || isHex(quantity)
      if (!isQuantity) {
        return false
      }

      return true
    },
  }),
  new Web3Method({
    name: 'eth_getBlockByHash',
    call: 'eth_getBlockByHash',
    params: 2,
    validate: args => {
      const txhash = args[0]
      const isTxHash = isEthTxHash(txhash)
      if (!isTxHash) {
        return false
      }

      const bool = args[1]
      const isBool = _.isBoolean(toBoolean(bool))
      if (!isBool) {
        return false
      }

      return true
    },
    outputFormatter: res => (_.isNull(res) ? {} : res),
  }),
  new Web3Method({
    name: 'eth_getBlockByNumber',
    call: 'eth_getBlockByNumber',
    params: 2,
    validate: args => {
      const blockNumber = args[0]
      const isBlockNumber = isEthBlockTag(blockNumber) || isHex(blockNumber)
      if (!isBlockNumber) {
        return false
      }

      const bool = args[1]
      const isBoolean = _.isBoolean(toBoolean(bool))
      if (!isBoolean) {
        return false
      }

      return true
    },
  }),
  new Web3Method({
    name: 'eth_getTransactionByHash',
    call: 'eth_getTransactionByHash',
    params: 1,
    validate: args => {
      const txHash = args[0]
      const isTxHash = isEthBlockTag(txHash) || isHex(txHash)
      return isTxHash
    },
    outputFormatter: res => (_.isNull(res) ? {} : res),
  }),
  new Web3Method({
    name: 'eth_getTransactionByBlockHashAndIndex',
    call: 'eth_getTransactionByBlockHashAndIndex',
    params: 2,
    validate: args => {
      const txHash = args[0]
      const isTxHash = isEthTxHash(txHash)
      if (!isTxHash) {
        return false
      }

      const index = args[1]
      const isIndex = isHex(index)
      if (!isIndex) {
        return false
      }

      return true
    },
    outputFormatter: res => (_.isNull(res) ? {} : res),
  }),
  new Web3Method({
    name: 'eth_getTransactionByBlockNumberAndIndex',
    call: 'eth_getTransactionByBlockNumberAndIndex',
    params: 2,
    validate: args => {
      const blockNumber = args[0]
      const isBlockNumber = isEthBlockTag(blockNumber) || isHex(blockNumber)
      if (!isBlockNumber) {
        return false
      }

      const index = args[1]
      const isIndex = isHex(index)
      if (!isIndex) {
        return false
      }

      return true
    },
    outputFormatter: res => (_.isNull(res) ? {} : res),
  }),
  new Web3Method({
    name: 'eth_getTransactionReceipt',
    call: 'eth_getTransactionReceipt',
    params: 1,
    validate: args => {
      const txHash = args[0]
      return isEthTxHash(txHash)
    },
    outputFormatter: res => (_.isNull(res) ? {} : res),
  }),
  new Web3Method({
    name: 'eth_getUncleByBlockNumberAndIndex',
    call: 'eth_getUncleByBlockNumberAndIndex',
    params: 2,
    validate: args => {
      const blockNumber = args[0]
      const isBlockNumber = isEthBlockTag(blockNumber) || isHex(blockNumber)
      if (!isBlockNumber) {
        return false
      }

      const indexPos = args[1]
      const isIndexPos = isHex(indexPos)
      if (!isIndexPos) {
        return false
      }

      return true
    },
  }),
  new Web3Method({
    name: 'eth_getUncleByBlockHashAndIndex',
    call: 'eth_getUncleByBlockHashAndIndex',
    params: 2,
    validate: args => {
      const txHash = args[0]
      const isTxHash = isEthTxHash(txHash)
      if (!isTxHash) {
        return false
      }

      const indexPos = args[1]
      const isIndexPos = isHex(indexPos)
      if (!isIndexPos) {
        return false
      }

      return true
    },
    outputFormatter: res => (_.isNull(res) ? {} : res),
  }),
  new Web3Method({
    name: 'eth_getLogs',
    call: 'eth_getLogs',
    params: 1,
    validate: args => {
      const filterObj = args[0]
      const isObj = _.isObject(filterObj)
      if (!isObj) {
        return false
      }

      const result = Joi.validate(filterObj, JoiRpcSchemas.Filter)
      if (result.error) {
        return false
      }

      return true
    },
    outputFormatter: res => (_.isNull(res) ? [] : res),
  }),
  new Web3Method({
    name: 'eth_sendRawTransaction',
    call: 'eth_sendRawTransaction',
    params: 1,
    validate: args => {
      const txHash = args[0]
      return isEthTxHash(txHash)
    },
  }),
  new Web3Method({
    name: 'eth_estimateGas',
    call: 'eth_estimateGas',
    params: 2,
    validate: args => {
      const obj = args[0]
      const isObj = _.isObject(obj)
      if (!isObj) {
        return false
      }

      const result = Joi.validate(obj, JoiRpcSchemas.Filter)
      if (result.error) {
        return false
      }

      const quantity = args[1]
      const isQuantity = isEthBlockTag(quantity) || isHex(quantity)
      if (!isQuantity) {
        return false
      }

      return true
    },
    outputFormatter: res => (_.isNull(res) ? '' : res),
  }),
  new Web3Method({
    name: 'eth_submitWork',
    call: 'eth_submitWork',
    params: 3,
    validate: args => {
      const nonce = args[0]
      const isNonce = isEthNonce(nonce)
      if (!isNonce) {
        return false
      }

      const headerHash = args[1]
      const isHeaderHash = isEthTxHash(headerHash)
      if (!isHeaderHash) {
        return false
      }

      const mixDigest = args[2]
      const isMixDigest = isEthTxHash(mixDigest)
      if (!isMixDigest) {
        return false
      }

      return true
    },
  }),
  new Web3Method({
    name: 'eth_submitHashrate',
    call: 'eth_submitHashrate',
    params: 2,
    validate: args => {
      const hashrate = args[0]
      const isHashrate = isEthTxHash(hashrate)
      if (!isHashrate) {
        return false
      }

      const id = args[1]
      const isId = isEthTxHash(id)
      if (!isId) {
        return false
      }

      return true
    },
  }),
]