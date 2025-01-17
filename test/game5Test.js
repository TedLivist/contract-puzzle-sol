const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');

describe('Game5', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game5');
    const game = await Game.deploy();

    return { game };
  }
  it('should be a winner', async function () {
    const { game } = await loadFixture(deployContractAndSetVariables);

    // good luck
    const signers = await ethers.getSigners();
    
    const threshold = BigInt("0x00FfFFfFFFfFFFFFfFfFfffFFFfffFfFffFfFFFf");
    
    let wallet;
    let attempts = 0;
    do {
      wallet = ethers.Wallet.createRandom().connect(ethers.provider);
      attempts++;
      if (attempts % 100 === 0) {
        console.log(`Tried ${attempts} wallets...`);
      }
    } while (BigInt(wallet.address) >= threshold);
    
    console.log("Found valid wallet address:", wallet.address);
    
    const tx = await signers[1].sendTransaction({
      to: wallet.address,
      value: ethers.utils.parseEther("1.0")
    });
    await tx.wait();
    console.log("Funded wallet with 1 ETH");

    await game.connect(wallet).win();

    // leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  });
});
