# Change Log

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

- DB Event: 'dbConnected'
- DB Event: 'dbError'
- DB Event: 'dbDisconnected'

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
