const request = require('request-promise');
const config = require('./config');

/**
 * 对get请求获取值以json形式返回
 * @param {*} url 请求地址
 */
function sendGet(url) {
  console.log(`sendGet: ${url}`);
  return request(url)
    .then((resData) => {
      return JSON.parse(resData);
    }).then((resData) => {
      console.log('resData', resData);
      return resData;
    });
}

/**
 * 对post请求获取值以json形式返回
 * @param {*} url 请求地址
 * @param {*} data 请求参数
 */
function sendPost(url, data) {
  console.log(`sendPOst URL: ${url}, sendPost data: ${JSON.stringify(data)}`);
  return request.post(url,{
    headers:{
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  }).then((resData) => {
    return JSON.parse(resData);
  }).then((resData) => {
    console.log('resData', resData);
    return resData;
  });
}

/**
 * 获取当前块号
 */
function getBlockNumber() {
  return sendGet(`${config.middleware}/common/blockNumber.json`)
  .then((resData) => {
    return resData.detail;
  });
}

/**
 * 获取代签原文
 * @param {*} buildInfoReq 
 */
function getBuildInfo(...buildInfoReq) {
  return sendPost(`${config.middleware}/common/buildSendInfo.json`, ...buildInfoReq)
  .then((resData) => {
    return resData.detail;
  });
}

/**
 * 获取签名数据
 * @param {*} signReq 
 */
function getSign(signReq) {
  return sendGet(`${config.hsmServer}/crypt/sign.json?userId=${config.hsmUserId}&messageHash=${signReq}`)
  .then((resData) => {
    return resData.detail;
  });
}

/**
 * 发送交易
 * @param {*} txReq 
 */
function sendTx(...txReq) {
  return sendPost(`${config.middleware}/common/sendTx.json`, ...txReq)
  .then((resData) => {
    return resData.detail;
  });
}

/**
 * 轮询校验交易结果
 * @param {*} txHash 
 */
function printTxInfo(txHash) {
  new Promise((resolve, reject) => {
    let tryCount = 0;
    const timeId = setInterval(() => {
      sendGet(`${config.middleware}/transaction/${txHash}.json`)
        .then((txData) => {
          tryCount ++;
          if (txData.detail && txData.detail.transaction) {
            clearInterval(timeId);
            console.log('txInfo: ', JSON.stringify(txData.detail, null, 2));
            resolve(txData.detail);
          } else if (tryCount >= 10) {
            clearInterval(timeId);
            reject(new Error('txInfo not found'));
          }
        });
    }, 3000);
  });
}

/**
 * 只读接口
 * @param {*} contractReq 
 */
function contract(...contractReq) {
  return sendPost(`${config.middleware}/common/contract.json`, ...contractReq)
  .then((resData) => {
    return resData.detail;
  });
}

exports = module.exports = {
  printTxInfo,
  getBlockNumber,
  sendPost,
  sendGet,
  getBuildInfo,
  getSign,
  sendTx,
  contract,
};