const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const txService = require('./txService');
const config = require('./config');

router.use(bodyParser.urlencoded({ extended: false }));  

router.post('/createUnit', function(req, res) {
    let method = "createUnit";
    let params = [
        req.body.dataUnitId,        // 存证流水号，必填，每次写入都需要更新，存证流水号必须唯一，重复提交会失败
        req.body.preDataUnitId,     // 前序存证流水号，可为空
        req.body.existenceHash,     // 存证hash
        req.body.customString,      // 自定义字符串
        req.body.opIdentityAddress  // 当前操作人身份合约地址
    ];
    txService.sendTX(method,params);
});

router.post('/getIdentityInfo', function(req, res) {
    let contractAddress = config.coopUserAddress;
    let functionName = "getIdentityInfo";
    txService.contract(contractAddress, functionName, []);
});

module.exports = router;