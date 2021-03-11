const storekeeperController = require('../../../controllers/storekeeperController');


test('get converted time list',  async()=>{

    const user = await storekeeperController.convertTime([{date:"October 13, 2014"}]);
    expect(user).toEqual(["2014-10-13"]);
})


test('get converted material list',  async()=>{

    const user = await storekeeperController.convertMat([{request_date:"October 13, 2014"}]);
    expect(user).toEqual(["2014-10-13"]);
})


test('get converted material list',  async()=>{

    const user = await storekeeperController.convertOrd([{order_date:"October 13, 2014"}]);
    expect(user).toEqual(["2014-10-13"]);
})


test('get not avaialbe material list',async()=>{
    const materials = await storekeeperController.checkAvailability([{material_name:"Steel", requested_quantity:"1000"}])
    expect(materials).toEqual(["Steel"]);
})

