var Token = artifacts.require("./token.sol");

module.exports = function(deployer) {
  deployer.deploy(Token);
};