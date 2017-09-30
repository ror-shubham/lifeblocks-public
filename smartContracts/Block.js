var Block = artifacts.require("./Block.sol");

var bl;
Block.deployed().then(instance=>bl=instance);
bl.issueCertificate(100,"test1");
bl.issueCertificate(100,"test2");

module.exports = function(callback) {
  console.log('123');
}