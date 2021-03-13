const storekeeperController = require('../../../controllers/supervisorController');


test('reset all values to initial values',  async()=>{

    const result = await supervisorController.initiateProject();
    expect(result).toEqual("reset");
})
