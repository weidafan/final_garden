var resources = require('./../../resources/model');
var actuator, interval;
var model = resources.pi.actuators.valve;
var pluginName = model.name;
var localParams = {'simulate': false, 'frequency': 2000};

exports.start = function (params) {
  localParams = params;

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

    console.log("The Valve status is: "+model.status);
    //The button has three control mode: 1(on), 0(off), -1(neutral)
    //MANUAL MODE
    if(resources.pi.sensors.soil.control==1){
       Valve.writeSync(1);
    }
    else if(resources.pi.sensors.soil.control==0){
          Valve.writeSync(0);
    }
        //AUTO MODE
    else{
        //if valve initial value is off and soil humidity less than 650 then turn the valve on
    if(model.status && resources.pi.sensors.soil.value <=650){
    Valve.writeSync(1);
    }
  //if valve initial value is on and soil humidity greater than 700 then turn the valve off
    else if(!model.status || resources.pi.sensors.soil.value>700){
    Valve.writeSync(0);
    }
    }
    setTimeout(connectHardware, localParams.frequency);	
};
