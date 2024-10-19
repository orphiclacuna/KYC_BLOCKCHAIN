const KYCVerification = artifacts.require("KYCVerification");

module.exports = function (deployer) {
  deployer.deploy(KYCVerification);
};
