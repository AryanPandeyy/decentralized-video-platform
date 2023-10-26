const Migrations = artifacts.require("PlayList");

module.exports = function (deployer) {
  deployer.deploy(Migrations);
};
