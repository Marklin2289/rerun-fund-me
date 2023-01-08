//import
// main function
//  calling  of main function

const { network } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

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

    // const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    let ethUsdPriceFeedAddress
    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }

    // Mock contract:
    /* if the contract doesn't exist, we deploy a minimal version of the contract
     * for local testing, therefore, we create 00-deploy-mocks.js
     */
    log("-----------------------------------------")
    log("Deploying FundMe and waiting for confirmations...")
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [ethUsdPriceFeedAddress], // put price feed
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    log("FundMe address: " + fundMe.address)

    if (
        !developmentChains.includes(network.name) &&
        (process.env.ETHERSCAN_API_KEY || process.env.POLYGONSCAN_API_KEY)
    ) {
        await verify(fundMe.address, [ethUsdPriceFeedAddress])
    }
}

module.exports.tags = ["all", "fundme"]
