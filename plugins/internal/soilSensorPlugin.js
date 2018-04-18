var resources = require('./../../resources/model'),
utils = require('./../../utils/utils.js');

var interval, sensor;
var model = resources.pi.sensors;
var pluginName = 'Soil sensor';
var localParams = { 'simulate': false, 'frequency': 50000 };

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
  sensor.unexport();
}
console.info('%s plugin stopped!', pluginName);
};

function connectHardware() {
    var Gpio = require('onoff').Gpio;
    Valve = new Gpio(27, 'out');
  var Mcp3008 = require('mcp3008.js');
      adc = new Mcp3008();
      channel = 0;
  adc.poll(channel,1000, function (value) {
      console.log("#1The soil humidity is: "+value);
     model.soil.value = value;
  });
      adc.poll(1,1000, function (value) {
      console.log("#2The soil humidity is: "+value);
      model.soil.value2 = value;
  });
      adc.poll(2,1000, function (value) {
      console.log("#3The soil humidity is: "+value);
      model.soil.value3 = value;
  });
      adc.poll(3,1000, function (value) {
      console.log("#4The soil humidity is: "+value);
      model.soil.value4 = value;
  });
};
