const { network } = require("hardhat")
const {
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER,
} = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    if (developmentChains.includes(network.name)) {
        /*localhost || hardhat */
        log("-------------------------------------")
        log("Local network detected! Deploying mocks...")
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_ANSWER], // from helper-hardhat-config.js
        })
        log("Mocks deployed successfully...")
        log("-------------------------------------")
    }
}

// 00-deploy-mocks.js is basically for testing, therefore create test/MockV3Aggregator.sol

module.exports.tags = ["all", "mocks"]

// yarn hardhat deploy --tags mocks:

// -------------------------------------
// Local network detected! Deploying mocks...
// deploying "MockV3Aggregator" (tx: 0x48bdfdd64644a5dd70bcefa793bec388fd55ccc9e6c6b6e4988db8d5cafde888)...: deployed at 0x5FbDB2315678afecb367f032d93F642f64180aa3 with 569635 gas
// Mocks deployed successfully...
// -------------------------------------
