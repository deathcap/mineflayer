var mc = require('minecraft-protocol')
  , EventEmitter = require('events').EventEmitter
  , util = require('util')
  , path = require('path')
  , plugins = {
      bed: require('./lib/plugins/bed'),
      block_actions: require('./lib/plugins/block_actions'),
      blocks: require('./lib/plugins/blocks'),
      chat: require('./lib/plugins/chat'),
      digging: require('./lib/plugins/digging'),
      entities: require('./lib/plugins/entities'),
      experience: require('./lib/plugins/experience'),
      game: require('./lib/plugins/game'),
      health: require('./lib/plugins/health'),
      inventory: require('./lib/plugins/inventory'),
      kick: require('./lib/plugins/kick'),
      physics: require('./lib/plugins/physics'),
      rain: require('./lib/plugins/rain'),
      settings: require('./lib/plugins/settings'),
      spawn_point: require('./lib/plugins/spawn_point'),
      time: require('./lib/plugins/time')
    };

module.exports = {
  vec3: require('vec3'),
  createBot: createBot,
  Block: require('./lib/block'),
  Location: require('./lib/location'),
  Biome: require('./lib/biome'),
  Entity: require('./lib/entity'),
  Painting: require('./lib/painting'),
  Item: require('./lib/item'),
  Recipe: require('./lib/recipe'),
  windows: require('./lib/windows'),
  Chest: require('./lib/chest'),
  Furnace: require('./lib/furnace'),
  Dispenser: require('./lib/dispenser'),
  EnchantmentTable: require('./lib/enchantment_table'),
  blocks: require('./lib/enums/blocks'),
  biomes: require('./lib/enums/biomes'),
  items: require('./lib/enums/items'),
  recipes: require('./lib/enums/recipes'),
  instruments: require('./lib/enums/instruments'),
  materials: require('./lib/enums/materials'),
};

function createBot(options) {
  options = options || {};
  options.username = options.username || 'Player';
  var bot = new Bot();
  bot.connect(options);
  return bot;
}

function Bot() {
  EventEmitter.call(this);
  this.client = null;
}
util.inherits(Bot, EventEmitter);

Bot.prototype.connect = function(options) {
  var self = this;
  self.client = mc.createClient(options);
  self.username = self.client.username;
  self.client.on('session', function() {
    self.username = self.client.username;
  });
  self.client.on('connect', function() {
    self.emit('connect');
  });
  self.client.on('error', function(err) {
    self.emit('error', err);
  });
  self.client.on('end', function() {
    self.emit('end');
  });
  for (var pluginName in plugins) {
    plugins[pluginName](self, options);
  }
};

Bot.prototype.end = function() {
  this.client.end();
};
