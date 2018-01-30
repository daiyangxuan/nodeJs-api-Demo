const express = require('express');
const router = express.Router();
const request = require('request-promise');
const config = require('./config');

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

router.get("/blockNumber",function(req, res) {
    sendGet(`${config.middleware}/common/blockNumber.json`)
    .then((resData) => {
        console.log(resData.detail);
        res.send(`blockNUmber:${resData.detail}`);
        return resData.detail;
    });
});

module.exports = router;