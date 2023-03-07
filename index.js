'use strict';

const libQ = require('kew');
const libFast = require('fast.js');
const fs = require('fs-extra');
const path = require('path');
const exec = require('child_process').exec;

const musicLibrary = '/mnt/USB';

module.exports = oled1;

function oled(context) {
	const self = this;
	self.context = context;
	self.commandRouter = self.context.coreCommand;
	self.logger = self.context.logger;
	self.configManager = self.context.configManager;
}

oled1.prototype.onVolumioStart = function() {
	const self = this;
	self.configFile = self.commandRouter.pluginManager.getConfigurationFile(self.context, 'config.json');
	self.getConf(self.configFile);

  return libQ.resolve();
}

oled1.prototype.onStart = function() {
	const self = this;
	const defer = libQ.defer();

  // Start the radio
	self.startRadio();

  // Set the OLED display to show the name of the currently playing track
	self.setOledDisplay('Now Playing', 'NRJ');

  // Resolve the promise
 	defer.resolve();

  return defer.promise;
};

oled1.prototype.onStop = function() {
    const self = this;
    const defer=libQ.defer();
	
	
	

    // Once the Plugin has successfull stopped resolve the promise
    defer.resolve();

    return libQ.resolve();
};
oled1.prototype.startRadio = function () {
  const self = this;

  // Get the radio URL from the plugin's configuration file
  const radioUrl = 'https://www.nrj.fr/webradios';

  // Launch the radio using the mplayer command
  exec('mplayer -ao alsa:device=hw=1.0 ' + radioUrl, (error, stdout, stderr) => {
    if (error) {
      self.logger.error('Failed to start radio: ' + error);
    }
  });
};

oled1.prototype.setOledDisplay = function (line1, line2) {
  const self = this;

  // Use the oled1 plugin to set the OLED display text
  self.commandRouter.executeOnPlugin('system_controller', 'oled1', 'write', [line1, line2]);
};

oled1.prototype.getConf = function (configFile) {
  const self = this;

  self.config = new (require('v-conf'))();
  self.config.loadFile(configFile);
};

oled1.prototype.saveConf = function () {
  const self = this;

  self.commandRouter.pluginManager.savePluginConfiguration('radio', self.config.get(), function (err, data) {
    if (err) {
      self.logger.error('Error saving configuration: ' + err);
    }
  });
};

oled1.prototype.getUIConfig = function () {
  const defer = libQ.defer();
  const self = this;

  const lang_code = self.commandRouter.sharedVars.get('language_code');
  const configFile = self.commandRouter.pluginManager.getConfigurationFile(self.context, 'config.json');

  const config = {
    page: {
      title: 'Radio Plugin Settings',
      plugin: 'radio'
    },
    sections: []
  };

  defer.resolve(config);

  return defer.promise;
};

oled1.prototype.setUIConfig = function (data) {
  const self = this;

  self.logger.info('Received UIConfig:', data);
};

oled1.prototype.getConfigurationFiles = function () {
  return ['config.json'];
};

oled1.prototype.addToBrowseSources = function () {
  const self = this;
  return self.commandRouter.v
	
}


