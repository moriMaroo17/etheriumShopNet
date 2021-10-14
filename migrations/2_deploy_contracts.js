const ReviewBook = artifacts.require("ReviewBook");

module.exports = function (deployer) {
  deployer.deploy(ReviewBook);
};
