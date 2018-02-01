/**
 * 将交易流程统一于sendTX方法中，以方便调用
 */
const request = require('request-promise');
const util = require('./util');
const config = require('./config');

function sendTX(method,params) {
    util.getBlockNumber().then((blockNumber) => {
        let blockLimit = `${blockNumber + 50}`;
        let bizId = `${Math.random()}`;
        let contractAddress = config.dataUnitAddress;
        // const method = 'createUnit';
        // const params = [dataUnitId, preDataUnitId, existenceHash, customString];
        // 计算代签原文
        util.getBuildInfo({
          blockLimit,
          bizId,
          contractAddress ,
          method,
          params,
        }).then((buildData) => {
          // 签名
          return util.getSign(buildData);
        }).then((signedData) => {
          // 发送交易，写入存证数据
          return util.sendTx({
            blockLimit,
            bizId,
            contractAddress ,
            method,
            params,
            signatureInBase64: signedData,
          });
        }).then((sendTxData) => {
          // 返回交易hash，如果能打印出完成的 txInfo，则数据写入成功
          console.log('交易发送完成, txHash: ', sendTxData);
          util.printTxInfo(sendTxData);
        }).catch((err) => {
          console.error(err);
        });;
      });
}

function contract(contractAddress, functionName, params) {
  util.contract({contractAddress, functionName, params})
  .then((contractData) => {
    return contractData;
  }).then((result)=> {
    console.log(`contractResult: ${JSON.stringify(result)}`);
  });
}

exports = module.exports = {
    sendTX,
    contract,
}