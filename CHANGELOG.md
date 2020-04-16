# Change Log

## [1.2.1] - Dev

### Added

- JsonModel#fetch event
- JsonModel#insert event
- JsonModel#insertMany event
- JsonModel#delete event
- JsonModel#deleteMany event
- JsonModel#update event

- MongoModel#fetch event
- MongoModel#insert event
- MongoModel#insertMany event
- MongoModel#delete event
- MongoModel#deleteMany event
- MongoModel#update event

- SqlModel#fetch event
- SqlModel#insert event
- SqlModel#insertMany event
- SqlModel#delete event
- SqlModel#deleteMany event
- SqlModel#update event

- Document#save() method.

### Removed

- MongoModel#emitter property.
- SqlModel#emitter property.

- MySql#emitter property.

### Fixed

- `voiceChannelJoin` event.

- Minor fixes.

### Changed

- MySql now extends EventEmitter.

- JsonModel now extends EventEmitter.
- MongoModel now extends EventEmitter.
- SqlModel now extends EventEmitter.

- Core#dbConnected event renamed: dbConnect.
- Core#dbDisconnected event renamed: dbDisconnect.

- Including `default` property isn't necessary when adding a model. It'll be set to `undefined`.

## [1.0.1] - 2020-03-11

### Added

- SqlModel#deleteMany() method.
- MongoModel#deleteMany() method.
- JsonModel#deleteMany() method.

- SqlModel#getData() method.
- MongoModel#getData() method.
- JsonModel#getData() method.

- Command#cdRun() method.

- `Json` structure.
- `JsonModel` structure.

- SqlModel#fetch() method.
- SqlModel#filterKeys() method.
- SqlModel#filter() method.
- SqlModel#findKey() method.
- SqlModel#getOne() method.
- SqlModel#insertMany() method.
- SqlModel#data property.

- `Document` structure.

- Mongo#collections property.
- Mongo#getCollection() method.

- MySql#collections property.
- MySql#getCollection() method.

- CoreOptions#commandOptions option.
- CoreOptions#prefixOptions option.
- CoreOptions#folders option.
- CoreOptions#mobile option.

- Event: `load` (Store).
- Event: `load:{type}s` (Store).

- CommandOptions#splitArgs option.

- Event: `voiceChannelJoin` (oldMember: GuildMember, newMember: GuildMember).
- Event: `voiceChannelSwitch` (oldMember: GuildMember, newMember: GuildMember).
- Event: `voiceChannelLeave` (oldMember: GuildMember, newMember: GuildMember).

- Typings.

- Command#resetCooldowns method.

- And much more.

### Removed

- CommandOptions#usage option.
- CommandOptions#description option.

- SqlModel#collection property.

- Mongo#\_models property.
- MySql#\_models property.

### Fixed

- Minor fixes.

### Changed

- Moved from discord.js v11.5.1 to v12.0.2

- SqlModel#findOne() method.
- SqlModel#insertOne() method.
- SqlModel#deleteOne() method.
- SqlModel#updateOne() method.
- SqlModel#upsertOne() method.

- Model has been renamed into MongoModel.

- CoreOptions#inhibitorsFolder has been put into CoreOptions#folders.
- CoreOptions#commandsFolder has been put into CoreOptions#folders.
- CoreOptions#monitorsFolder has been put into CoreOptions#folders.
- CoreOptions#triggersFolder has been put into CoreOptions#folders.
- CoreOptions#eventsFolder has been put into CoreOptions#folders.

- CoreOptions#inhibitorsFolder has been renamed into inhibitors.
- CoreOptions#commandsFolder has been renamed into commands.
- CoreOptions#monitorsFolder has been renamed into monitors.
- CoreOptions#triggersFolder has been renamed into triggers.
- CoreOptions#eventsFolder has been renamed into events.

- CoreOptions#spaceAfterPrefix has been put into CoreOptions#prefixOptions.
- CoreOptions#ignorePrefixCase has been put into CoreOptions#prefixOptions.
- CoreOptions#mentionPrefix has been put into CoreOptions#prefixOptions.

- CoreOptions#spaceAfterPrefix has been renamed into spaceSeparator.
- CoreOptions#ignorePrefixCase has been renamed into ignoreCase.
- CoreOptions#mentionPrefix has been renamed into mention.

- CoreOptions#splitArgs has been put into CoreOptions#commandOptions.
- CoreOptions#permLevels has been put into CoreOptions#commandOptions.
- CoreOptions#ignoreCase has been put into CoreOptions#commandOptions.
- CoreOptions#ignoreBots has been put into CoreOptions#commandOptions.
- CoreOptions#ignoreSelf has been put into CoreOptions#commandOptions.

- CoreOptions#splitArgs has been renamed into argsSeparator.

- Minor changes.

- And more.

## [0.10.3] - 2020-01-20

### Added

### Fixed

- ClientOptions#ignoreCase option fixed.
- Stores now ignore non-js files.

### Changed

- Minor changes.

## [0.10.1] - 2019-12-20

### Added

- Store#search method.
- ClientOptions#mainPath option.

### Fixed

- Minor bugs.

### Changed

- Minor changes.

## [0.9.8] - 2019-11-30

### Added

### Fixed

- Command handler fix.

### Changed

## [0.9.7] - 2019-11-20

### Added

### Fixed

### Changed

- Now you can create mysql connection using connection options.

## [0.9.6] - 2019-11-04

### Added

### Fixed

- Mention prefix.
- Inhibitors.

### Changed

- Inhibitors should return true if you want a command to run.

## [0.9.5] - 2019-10-27

### Added

- Discord property which extends whole discord.js.
- ClientOptions#ignorePrefixCase option.

### Fixed

- Prefixes.

### Changed

## [0.9.4] - 2019-10-11

### Added

- ClientOptions#mentionPrefix option.

### Fixed

### Changed

- MongoOptions#useUnifiedTopology set to true by default.

## [0.9.2] - 2019-10-01

### Added

### Fixed

### Changed

- Mongo#open method options argument now accepts previous options if not defined.

## [0.9.1] - 2019-09-30

### Added

- Monitor structure.
- Trigger structure.
- Inhibitor structure.
- Command option: once.
- Monitor option: once.
- Trigger option: once.

### Changed

### Fixed

## [0.8.2] - 2019-08-28

### Added

### Changed

### Fixed

- Mongo#addModel method error.

## [0.8.1] - 2019-08-25

### Added

### Changed

### Fixed

- Now you won't get error if there is no events or commands folder created.
- Collection#sort method fixed.

## [0.8.0] - 2019-08-22

### Added

- MySql structure.
- Data Types for DBs.
- Mongo#Types property.

### Changed

- DB structure renamed to Mongo.
- Client variable should be defined in PermissionLevels#test method if it is needed.
- You can use client argument in PermissionLevels#add method.

### Fixed

## [0.7.0] - 2019-08-16

### Added

- Core#spaceAfterPrefix option.

- Per-guild configuration.

- Event#categories property.
- Command#categories property.

- Pages structure.

- DB#open method.
- DB#close method.

### Changed

- Now prefixes can be string, regular expression or array of RegExps or strings.

- Minor changes.

### Fixed

- DB collections & models.

## [0.6.4] - 2019-08-14

### Added

### Changed

### Fixed

- Model methods fixed.

## [0.6.3] - 2019-08-14

### Added

- DB Event: 'dbConnect'
- DB Event: 'dbError'
- DB Event: 'dbDisconnect'

### Changed

### Fixed

## [0.6.2] - 2019-08-14

### Added

### Changed

### Fixed

- Collection methods.
- Model constructor.

## [0.6.1] - 2019-08-14

### Added

- Model.deleteOne() method.

- Command.noPermsRun() method.

- Store.get() method.

- Model JSDoc.

- Command.customOptions property.
- Command.cOptions property.
- Event.customOptions property.
- Event.cOptions property.

- Model.defaults property. ( Default options )
- Model.name property.

- And more.

### Changed

### Fixed

- DB constructor.
- DB.addModel() method.
- Model.insertOne() method.
- Model.deleteOne() method.

- And more.

## [0.3.1] - 2019-08-13

### Added

### Changed

### Fixed

- Core Option: db.

## [0.3.0] - 2019-08-13

### Added

- Core Option: db.
- Commands.load() method.
- Events.load() method.

### Changed

### Fixed

- Command.init() method.

## [0.2.7] - 2019-08-12

### Added

### Changed

### Fixed

- PermissionLevels is not a constructor error.

## [0.2.6] - 2019-08-12

### Added

- id option to commands.
- id option to events.
- Core Option: ignoreSelf.
- Core Option: ignoreBots.
- Usage for commands.
- CHANGELOG.md file.
- Command.reload() method.
- Command.unload() method.
- Event.reload() method.
- Event.unload() method.

### Changed

- README.md file.

### Fixed
