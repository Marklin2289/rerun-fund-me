// Unit tests are done locally
// local hardhat or forked hardhat

const { assert, expect } = require("chai")
const { deployments, ethers, getNamedAccounts } = require("hardhat")

describe("FundMe", async function () {
    let fundMe
    let deployer
    let mockV3Aggregator
    const sendValue = ethers.utils.parseEther("1")
    beforeEach(async function () {
        // deploy fundMe contract
        // using Hardhat-deploy
        deployer = (await getNamedAccounts()).deployer
        await deployments.fixture(["all"])
        fundMe = await ethers.getContract("FundMe", deployer)
        mockV3Aggregator = await ethers.getContract(
            "MockV3Aggregator",
            deployer
        )
    })
    describe("constructor", function () {
        it("sets the aggregator addresses correctly", async () => {
            const response = await fundMe.getPriceFeed()
            assert.equal(response, mockV3Aggregator.address)
        })
    })
    describe("fund", async () => {
        it("fails if you don't have enough ETH to send", async () => {
            await expect(fundMe.fund()).to.be.revertedWith(
                "You need to spend more ETH!"
            )
        })
        it("updated the amount funded data structure", async () => {
            await fundMe.fund({ value: sendValue })
            const response = await fundMe.getAddressToAmountFunded(deployer)
            console.log(`response is ${response}`)
            assert.equal(response.toString(), sendValue.toString())
        })
        it("adds investor to s_funders array", async () => {
            await fundMe.fund({ value: sendValue })
            const response = await fundMe.getFunder(0)
            console.log(`response address : ${response}`)
            assert.equal(response, deployer)
        })
    })
})
