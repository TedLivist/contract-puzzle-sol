const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');

describe('Game4', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game4');
    const game = await Game.deploy();

    const sender1 = ethers.provider.getSigner(0);
    const sender2 = ethers.provider.getSigner(1);

    return { game, sender1, sender2 };
  }
  it('should be a winner', async function () {
    const { game, sender1, sender2 } = await loadFixture(deployContractAndSetVariables);

    const sender2_address = await sender2.getAddress();
    const sender1_address = await sender1.getAddress();
    
    // nested mappings are rough :}
    await game.connect(sender1).write(sender2_address);
    await game.connect(sender2).win(sender1_address);

    // leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  });
});
