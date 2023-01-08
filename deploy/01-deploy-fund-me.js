//import
// main function
//  calling  of main function

const { network } = require("hardhat")
const { networkConfig } = require("../helper-hardhat-config")

// function deployFunc() {
//     console.log("Hi deploy!!")
//      hre.getNamedAccounts()
//      hre.deployments
// }

// module.exports.default = deployFunc

// or

module.exports = async ({ getNamedAccounts, deployments }) => {
    // const { getNamedAccounts, deployments } = hre
    // or
    // hre.getNamedAccounts
    // hre.deployments
    // or
    // put them in the parameters above
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]

    // Mock contract:
    /* if the contract doesn't exist, we deploy a minimal version of the contract
     * for local testing, therefore, we create 00-deploy-mocks.js
     */
    if (!deploy) {
        const fundMe = await deploy("fundMe", {
            from: deployer,
            args: [], // put price feed
            log: true,
        })
    }
}
