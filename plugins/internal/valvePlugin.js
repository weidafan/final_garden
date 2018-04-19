var resources = require('./../../resources/model');
var actuator, interval;
var model = resources.pi.actuators.valve;
var pluginName = model.name;
var localParams = {'simulate': false, 'frequency': 2000};

exports.start = function (params) {
  localParams = params;
  //observe(model); //#A
  if (localParams.simulate) {
    simulate();
  } else {
    connectHardware();
  }
};

exports.stop = function () {
  if (localParams.simulate) {
    clearInterval(interval);
  } else {
    actuator.unexport();
  }
  console.info('%s plugin stopped!', pluginName);
};


function connectHardware() {
  var Gpio = require('onoff').Gpio;
  Valve = new Gpio(model.gpio, 'out');
  // switchOnOff(model.value);
    console.log("The Valve status is: "+model.status);
    if(resources.pi.sensors.soil.control){
       Valve.writeSync(1);
    }
    else if(!resources.pi.sensors.soil.control){
          Valve.writeSync(0);
    }
    else{
    if(model.status && resources.pi.sensors.soil.value <=650){
    Valve.writeSync(1);
    }
    else if(!model.status || resources.pi.sensors.soil.value>700){
    Valve.writeSync(0);
    }
    }
    setTimeout(connectHardware, localParams.frequency);	
};
