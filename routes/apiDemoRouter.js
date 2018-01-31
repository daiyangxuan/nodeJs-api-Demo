const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const txService = require('./txService');

router.use(bodyParser.urlencoded({ extended: false }));  

router.post('/createUnit', function(req, res) {
    // 存证流水号，必填，每次写入都需要更新，存证流水号必须唯一，重复提交会失败
    let dataUnitId = req.body.dataUnitId;
    // 前序存证流水号，可为空
    let preDataUnitId = req.body.preDataUnitId;
    // 存证hash
    let existenceHash = req.body.existenceHash;
    // 自定义字符串
    let customString = req.body.customString;
    // 当前操作人身份合约地址
    let opIdentityAddress = req.body.opIdentityAddress;
    let method = "createUnit";
    let params = [dataUnitId,preDataUnitId,existenceHash,customString,opIdentityAddress];
    txService.sendTX(method,params);
});

module.exports = router;