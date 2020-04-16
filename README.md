<div align="center">
  <p>
    <div>
      <a href="https://www.npmjs.com/package/discore.js">
        <img alt="npm version" src="https://img.shields.io/npm/v/discore.js">
      </a>
      <a href="https://www.npmjs.com/package/discore.js">
        <img src="https://img.shields.io/npm/dt/discore.js.svg" alt="npm downloads">
      </a>
<a href="https://app.fossa.io/projects/git%2Bgithub.com%2Fzargovv%2Fdiscore.js?ref=badge_shield" alt="FOSSA Status"><img src="https://app.fossa.io/api/projects/git%2Bgithub.com%2Fzargovv%2Fdiscore.js.svg?type=shield"/></a>
      <a href="https://www.npmjs.com/package/discore.js">
        <img src="https://img.shields.io/snyk/vulnerabilities/npm/discore.js" alt="npm vulnerabilities">
      </a>
    </div>
    <div>
      <a href="https://david-dm.org/zargovv/discore.js">
        <img alt="dependencies" src="https://img.shields.io/librariesio/release/npm/discore.js">
      </a>
      <a href="https://github.com/zargovv/discore.js">
        <img alt="GitHub issues" src="https://img.shields.io/github/issues-raw/zargovv/discore.js">
      </a>
      <a href="https://github.com/zargovv/discore.js">
        <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/zargovv/discore.js">
      </a>
    </div>
    <div>
      <a href="https://github.com/zargovv/discore.js">
        <img alt="GitHub stars" src="https://img.shields.io/github/stars/zargovv/discore.js?logo=github">
      </a>
    </div>
  </p>
  <p>
    <a href="https://nodei.co/npm/discore.js/">
      <img src="https://nodei.co/npm/discore.js.png?downloads=true&stars=true">
    </a>
  </p>
</div>

###### Based on discord.js

## Examples

`index.js` structure:

```js
const { Core } = require('discore.js');
new Core({
  // options
}).login('token');
```

- Alternate login system

```js
const { Core } = require('discore.js');
new Core({
  token: 'token',
});
```

- All options (defaults)

```js
const { Core } = require('discore.js');
new Core({
  folders: {
    inhibitors: 'inhibitors',
    commands: 'commands',
    monitors: 'monitors',
    triggers: 'triggers',
    events: 'events',
  },

  prefixOptions: {
    spaceSeparator: false, // Allow space after prefix
    ignoreCase: false, // Ignore prefix case
    mention: false, // Allow using @mention as prefix
  },

  commandOptions: {
    argsSeparator: ' ', // Regular expressions are allowed
    permLevels: new PermissionLevels(),
    ignoreCase: false,
    ignoreBots: true, // Prevents bots from using commands.
    ignoreSelf: true, // Prevents the bot from using commands on itself.
  },

  mainPath: '.',

  // Displays the bot as online from a mobile
  mobile: false,

  // Regular expressions and arrays (Strings, RegExps) are allowed.
  prefix: undefined,

  token: null,
  db: null,
});
```

- Per-guild configuration.

```js
this.client.config.guild.set('guild_id', {
  prefix: undefined,
  mentionPrefix: false,
  argsSeparator: ' ',
  ignoreCase: true,
  ignorePrefixCase: true,
  permLevels: new PermissionLevels(),
  ignoreSelf: true,
  ignoreBots: true,
});

// If you want to leave current default prefixes
// and add new one then you can use add() method.
this.client.config.guild.add('guild_id', {
  prefix: '.', // Example.
});
```

### Events

Events are placed in `.\events\`(**eventsFolder** option).
For instance creating `.\events\Main\ready.js` will be an event `ready` in the `Main` category. Subcategories are also allowed and gonna be a second and more folder levels.

Their structure (options argument defined with default configuration):

#### All Custom Events

- `load` (Store).
- `load:{type}s` (Store).

- `voiceChannelJoin` (oldState: VoiceState, newState: VoiceState)
- `voiceChannelSwitch` (oldState: VoiceState, newState: VoiceState)
- `voiceChannelLeave` (oldState: VoiceState, newState: VoiceState)

- `dbConnect`
- `dbError`
- `dbDisconnect`

```js
const { Event } = require('discore.js');

module.exports = class extends Event {
  get options() {
    return {
      enabled: true,
      name: null, // Event name.
      once: false, // Unloads after first use.
      id: undefined, // Used to get the event.
    };
    // If name is not defined then it will be defined as file name.
    // For example, ready.js will be 'ready'
  }

  get customOptions() {
    return {
      // You can put any options you want.
      // And use it via this.custom
    };
  }

  get cOptions() {
    return {
      // Same as customOptions property.
      /*
        If you define both customOptions and cOptions
        then customOptions becomes more priority
      */
    };
  }

  // Params of the event
  run(...params) {
    // Event code.
    // Runs only if enabled.
  }

  disabledRun(...params) {
    // Same as run but runs only if disabled.
  }

  init() {
    // Optional method. Runs on 'ready'
    // event so you are able to use discord
    // data via this.client
  }
};
```

#### Methods

- `toggle()`
- `enable()`
- `disable()`
- `unload()`
- `reload()`
- `toString()`

#### Properties

- `categories`

### Commands

Commands are placed in `.\commands\` (**commandsFolder** option).
For instance creating `.\events\Main\Command.js` will be a command `Command` in the `Main` category. Subcategories are also allowed and gonna be a second and more folder levels.

Their structure (options argument defined with default configuration):

```js
const { Command } = require('discore.js');

module.exports = class extends Command {
  get options() {
    return {
      enabled: true,
      name: null, // Command name.
      id: undefined, // Used to get the command.
      cooldown: 0, // In milliseconds
      aliases: [],
      permLevel: 0, // Runs noPermsRun() method if tests not passed.
      once: false, // Unloads after first use.
    };
    // If name is not defined then it will be defined as file name.
    // For example, test.js will be 'test'
  }

  get customOptions() {
    return {
      // You can put any options you want.
      // And use it via this.custom
    };
  }

  get cOptions() {
    return {
      // Same as customOptions property.
      /*
        If you define both customOptions and cOptions
        then customOptions becomes more priority.
      */
    };
  }

  run(message, args) {
    // Command code.
    // Runs only if enabled.
  }

  disabledRun(message, args) {
    // Same as run but runs only if disabled.
  }

  noPermsRun(message, args) {
    // Same as run
    // but runs only if Permission Level test is not passed.
  }

  cdRun(message, args) {
    // Same as run
    // but runs only if user has active cooldown.
  }

  init() {
    // Optional method. Runs on 'ready'
    // event so you are able to use discord
    // data via this.client
  }
};
```

#### Methods

- `toggle()`
- `enable()`
- `disable()`
- `unload()`
- `reload()`
- `toString()`

#### Properties

- `categories`

### Monitors

Monitors are placed in `.\monitors\`(**monitorsFolder** option).
Runs on any message and receives message as first argument.
For instance creating `.\monitors\Main\filter.js` will be a monitor `filter` in the `Main` category. Subcategories are also allowed and gonna be a second and more folder levels.

Their structure (options argument defined with default configuration):

```js
const { Monitor } = require('discore.js');

module.exports = class extends Monitor {
  get options() {
    return {
      enabled: true,
      name: null, // Monitor name.
      id: undefined, // Used to get the command.
      once: false, // Unloads after first use.
    };
    // If name is not defined then it will be defined as file name.
    // For example, filter.js will be 'filter'
  }

  get customOptions() {
    return {
      // You can put any options you want.
      // And use it via this.custom
    };
  }

  get cOptions() {
    return {
      // Shortcut for customOptions property.
      /*
        If you define both customOptions and cOptions
        then customOptions becomes more priority
      */
    };
  }

  run(message) {
    // Monitor code.
    // Runs only if enabled.
  }

  disabledRun(message) {
    // Same as run but runs only if disabled.
  }

  init() {
    // Optional method. Runs on 'ready'
    // event so you are able to use discord
    // data via this.client
  }
};
```

#### Methods

- `toggle()`
- `enable()`
- `disable()`
- `unload()`
- `reload()`
- `toString()`

#### Properties

- `categories`

### Triggers

Triggers are placed in `.\triggers\`(**triggersFolder** option).
Runs on any message if it is not a command and receives message as first argument.
For instance creating `.\triggers\Main\xp.js` will be a trigger `xp` in the `Main` category. Subcategories are also allowed and gonna be a second and more folder levels.

Their structure (options argument defined with default configuration):

```js
const { Trigger } = require('discore.js');

module.exports = class extends Trigger {
  get options() {
    return {
      enabled: true,
      name: null, // Monitor name.
      id: undefined, // Used to get the command.
      once: false, // Unloads after first use.
    };
    // If name is not defined then it will be defined as file name.
    // For example, xp.js will be 'xp'
  }

  get customOptions() {
    return {
      // You can put any options you want.
      // And use it via this.custom
    };
  }

  get cOptions() {
    return {
      // Shortcut for customOptions property.
      /*
        If you define both customOptions and cOptions
        then customOptions becomes more priority
      */
    };
  }

  run(message) {
    // Trigger code.
    // Runs only if enabled.
  }

  disabledRun(message) {
    // Same as run but runs only if disabled.
  }

  init() {
    // Optional method. Runs on 'ready'
    // event so you are able to use discord
    // data via this.client
  }
};
```

#### Methods

- `toggle()`
- `enable()`
- `disable()`
- `unload()`
- `reload()`
- `toString()`

#### Properties

- `categories`

### Inhibitors

Inhibitors are placed in `.\inhibitors\`(**inhibitorsFolder** option).
Runs on any message if it is a command and receives message as first argument
and command as second argument.
For instance creating `.\inhibitors\Main\inhibit.js` will be a inhibitor `inhibit` in the `Main` category. Subcategories are also allowed and gonna be a second and more folder levels.

Their structure (options argument defined with default configuration):

```js
const { Inhibitor } = require('discore.js');

module.exports = class extends Inhibitor {
  get options() {
    return {
      enabled: true,
      name: null, // Monitor name.
      id: undefined, // Used to get the command.
      once: false, // Unloads after first use.
    };
    // If name is not defined then it will be defined as file name.
    // For example, server.js will be 'server'
  }

  get customOptions() {
    return {
      // You can put any options you want.
      // And use it via this.custom
    };
  }

  get cOptions() {
    return {
      // Shortcut for customOptions property.
      /*
        If you define both customOptions and cOptions
        then customOptions becomes more priority
      */
    };
  }

  run(message, cmd) {
    // Inhibitor code.
    // Runs only if enabled.
    // Should return true in the end.
    // Doesn't run commands if return false or undefined.
  }

  disabledRun(message, cmd) {
    // Same as run but runs only if disabled.
  }

  init() {
    // Optional method. Runs on 'ready'
    // event so you are able to use discord
    // data via this.client
  }
};
```

#### Methods

- `toggle()`
- `enable()`
- `disable()`
- `unload()`
- `reload()`
- `toString()`

#### Properties

- `categories`

### Store

Do you want to load event or command in live mode?
You can use load() method!

`.\` is gonna be your main file's root folder.

#### Methods

- `load()`
- `get()`
- `search()`

##### Method Examples

```js
this.client.events.load('./events/event');
this.client.commands.load('./commands/command');

this.client.events.get('event_id');
this.client.events.get('event_name'); // Same as previous example

this.client.commands.get('command_id');
this.client.commands.get('command_name'); // Same as previous example
this.client.commands.get('command_alias'); // Same as previous example

this.client.commands.search('hlp');
this.client.commands.search('hlep');
```

### Permission Levels

Their structure:

```js
const { PermissionLevels } = require('discore.js');

const permLevels = new PermissionLevels();
permLevels
  .add(0, true, (msg) => msg.author.id === '1')

  // Permissions Level 1 gives access only if message author id is equal to '1'
  .add(1, false, (msg) => msg.author.id === '1')

  // Permissions Level 2 gives access only to the bot
  .addLevel(2, false, (msg, client) => {
    return msg.author.id === client.user.id;
  });

// Tests for a role.
permLevels.add(3, true, (msg) => msg.member.roles.has('roleid'));

// Testing. Returns boolean.
permLevels.test(3, msg);

// You can define client as third argument if needed.
permLevels.test(2, msg, this.client);
```

#### Methods

- `addLevel()`
- `add()`
- `test()`

#### Properties

- `length`

### Pages

Their structure:

```js
const { Pages, Embed } = require('discore.js');

const pages = new Pages(this.client, {
  prevPage: '⏮', // Emoji which is used to switch to the previous page.
  nextPage: '⏭', // Emoji which is used to switch to the next page.
  filter: (reaction, user) => user.id === message.author.id, // Example.
});

const embed = new Embed()
  .setTitle('Embedded Page!')
  .setDescription('Yay! You can add embedded page!')
  .setFooter('Page: 2');

pages
  // AddPage method adds only one page.
  .addPage('Hey! You are on the first page!')
  // With add method you can add one page.
  .add(embed)
  // Or tons of pages!
  .add('`Third page.`', '`Fourth and the last page.`');

const msg = await pages.send(message.channel);

const timeout = 5000; // 5000 milliseconds = 5 seconds.
// To turn off pages just delete the message!
// Example:
msg.delete(timeout);
// or
setTimeout(() => msg.delete(), timeout);
```

#### Methods

- `addPage()`
- `add()`
- `send()`

#### Properties

- `client`
- `options`
- `emojis`
- `pages`
- `filter`

## Databases

###### `DBs you use but much faster, powerful and object-oriented`

### Document

#### Methods

- `save()`
- `populate()`
- `json()`

#### Examples

```js
const doc = await db.getCollection('users').findOne({ id: 'some id' });

doc.someProp = 'some value';

doc.save().then(() => console.log('Saved!'));
```

### Global Model Events

### MongoDB

Structure:

```js
const { Core, Mongo } = require('discore.js');

const db = new Mongo('url', {
  /* Options */
});

new Core({
  db,
});
```

#### Methods

- `addModel()`
- `open()` ( Open connection )
- `close()` ( Close connection )
- `getCollection()`

#### Properties

- `collections`
- `connection`

### DB Models

Their structure:

```js
// If default value is not defined, it will be set to undefined.
// You can leave values as undefined.
const data = {
  id: Mongo.Types.String,
  messageCount: { type: Mongo.Types.Number, default: 0 },
};

db.addModel('modelName', data);
```

### Types

- `Number`
- `Double`
- `String`
- `Object`
- `Array`
- `ObjectId`
- `Boolean`
- `Date`
- `RegExp`

#### Methods

- `fetch()`
- `getData()`
- `filterKeys()`
- `filter()`
- `findKey()`
- `findOne()`
- `getOne()`
- `insertOne()`
- `insertMany()`
- `deleteOne()`
- `deleteMany()`
- `updateOne()`
- `upsertOne()`

##### fetch()

```js
// Fetches all documents from the database.
// Returns Promise<Collection<string, MongoDocument>>

const collection = db.getCollection('name');

const data = await collection.fetch();
```

##### getData()

```js
// Returns data from local storage.
// Returns Promise<Collection<string, MongoDocument>>

const collection = db.getCollection('name');

const data = await collection.getData();
```

##### filterKeys()

```js
// Filters the collection and returns only keys.
// Returns Promise<string[]>

const collection = db.getCollection('name');

const keys = await collection.filterKeys(
  (value) => value.username === 'zargovv'
);
```

##### filter()

```js
// Filters the collection.
// Returns Promise<Collection<string, MongoDocument>>

const collection = db.getCollection('name');

const newCollection = await collection.filter(
  (value) => value.username === 'zargovv'
);
```

##### findKey()

```js
// Finds document and returns key.
// Returns Promise<string | undefined>

const collection = db.getCollection('name');

const result = await collection.findKey(
  (value) => value.username === 'zargovv'
);
```

##### findOne()

```js
// Finds document.
// Returns Promise<Document | undefined>

const collection = db.getCollection('name');

const result = await collection.findOne(
  (value) => value.username === 'zargovv'
);
```

##### getOne()

```js
// Gets document
// (Searches for it, if there is no one, then returns default values).
// Returns Promise<Document | undefined>

const collection = db.getCollection('name');

const document = await collection.getOne(
  (value) => value.username === 'zargovv'
);
```

##### insertOne()

```js
// Creates new document
// Returns Document

const collection = db.getCollection('name');

const result = collection.insertOne({ id: '1', username: 'zargovv' });
```

##### insertMany()

```js
// Creates new documents
// Returns Document[]

const collection = db.getCollection('name');

const result = collection.insertMany([
  { id: '1', username: 'zargovv' },
  { id: '2', username: 'discore.js' },
]);
```

##### deleteOne()

```js
// Deletes document
// Returns Promise<Document | undefined>

const collection = db.getCollection('name');

const result = await collection.deleteOne({ username: 'zargovv' });
```

##### deleteMany()

```js
// Deletes document
// Returns Promise<Document[]>

const collection = db.getCollection('messages');

const result = collection.deleteMany((doc) => doc.messageCount < 1);
```

##### updateOne()

```js
// Updates document. Returns undefined if document wasn't found.
// Returns Promise<Document | undefined>

const collection = db.getCollection('name');

const result = await collection.updateOne({ username: 'zargovv' }, { id: '0' });
```

##### upsertOne()

```js
// Updates document. Creates new one if not found.
// Returns Promise<Document>

const collection = db.getCollection('name');

const result = await collection.updateOne({ username: 'zargovv' }, { id: '0' });
```

### MySQL

Structure:

```js
const { Core, MySql } = require('discore.js');

const db = new MySql(/* connection url(string) or connection options(object) */);

new Core({
  db,
});
```

#### Events

- `dbConnect`
- `dbError`
- `dbDisconnect`

#### Methods

- `addModel()`
- `open()` ( Open connection )
- `close()` ( Close connection )
- `getCollection()`

#### Properties

- `collections`

### DB Models

Their structure:

```js
// If default value is not defined, it will be set to undefined.
// You can leave values as undefined.
const data = {
  id: MySql.Types.VarChar(18),
  messageCount: { type: MySql.Types.Int, default: 0 },
  rowId: {
    type: MySql.Types.Int(null, 'NOT NULL', 'AUTO_INCREMENT', 'PRIMARY'),
    default: 0,
  },
};

db.addModel('modelName', data);
```

### Types

- `Double`
- `Boolean`
- `Date`
- `VarChar`
- `TinyText`
- `Text`
- `Blob`
- `MediumText`
- `LongText`
- `LongBlob`
- `TinyInt`
- `SmallInt`
- `MediumInt`
- `Int`
- `BigInt`
- `Float`
- `Decimal`
- `DateTime`
- `Timestamp`
- `Time`
- `Enum`
- `Set`

#### Methods

- `fetch()`
- `getData()`
- `filterKeys()`
- `filter()`
- `findKey()`
- `findOne()`
- `getOne()`
- `insertOne()`
- `insertMany()`
- `deleteOne()`
- `deleteMany()`
- `updateOne()`
- `upsertOne()`

##### fetch()

```js
// Fetches all documents from the database.
// Returns Promise<Collection<string, MongoDocument>>

const collection = db.getCollection('name');

collection.fetch().then((data) => {});
```

##### getData()

```js
// Returns data from local storage.
// Returns Promise<Collection<string, MongoDocument>>

const collection = db.getCollection('name');

const data = await collection.getData();
```

##### filterKeys()

```js
// Filters the collection and returns only keys.
// Returns Promise<string[]>

const collection = db.getCollection('name');

const keys = await collection.filterKeys(
  (value) => value.username === 'zargovv'
);
```

##### filter()

```js
// Filters the collection.
// Returns Promise<Collection<string, MongoDocument>>

const collection = db.getCollection('name');

const newCollection = await collection.filter(
  (value) => value.username === 'zargovv'
);
```

##### findKey()

```js
// Finds document and returns key.
// Returns Promise<string | undefined>

const collection = db.getCollection('name');

const result = await collection.findKey(
  (value) => value.username === 'zargovv'
);
```

##### findOne()

```js
// Finds document.
// Returns Promise<Document | undefined>

const collection = db.getCollection('name');

const result = await collection.findOne(
  (value) => value.username === 'zargovv'
);
```

##### getOne()

```js
// Gets document
// (Searches for it, if there is no one, then returns default values).
// Returns Promise<Document | undefined>

const collection = db.getCollection('name');

const document = await collection.getOne(
  (value) => value.username === 'zargovv'
);
```

##### insertOne()

```js
// Creates new document
// Returns Document

const collection = db.getCollection('name');

const result = collection.insertOne({ id: '1', username: 'zargovv' });
```

##### insertMany()

```js
// Creates new documents
// Returns Document[]

const collection = db.getCollection('name');

const result = collection.insertMany([
  { id: '1', username: 'zargovv' },
  { id: '2', username: 'discore.js' },
]);
```

##### deleteOne()

```js
// Deletes document
// Returns Promise<Document | undefined>

const collection = db.getCollection('name');

const result = collection.deleteOne({ username: 'zargovv' });
```

##### deleteMany()

```js
// Deletes document
// Returns Promise<Document[]>

const collection = db.getCollection('messages');

const result = collection.deleteMany((doc) => doc.messageCount < 1);
```

##### updateOne()

```js
// Updates document. Returns undefined if document wasn't found.
// Returns Promise<Document | undefined>

const collection = db.getCollection('name');

const result = await collection.updateOne({ username: 'zargovv' }, { id: '0' });
```

##### upsertOne()

```js
// Updates document. Creates new one if not found.
// Returns Promise<Document>

const collection = db.getCollection('name');

const result = await collection.updateOne({ username: 'zargovv' }, { id: '0' });
```

### Json

Structure:

```js
const { Core, Json } = require('discore.js');

const db = new Json(/* path to the directory */);

new Core({
  db,
});
```

#### Methods

- `addModel()`
- `getCollection()`
- `save()`

#### Properties

- `collections`

### DB Models

Their structure:

```js
// Default values.
// You can leave values as undefined.
const data = {
  id: undefined,
  messageCount: 0,
  rowId: 0,
};

db.addModel('modelName', data);
```

#### Methods

- `fetch()`
- `getData()`
- `filterKeys()`
- `filter()`
- `findKey()`
- `findOne()`
- `getOne()`
- `insertOne()`
- `insertMany()`
- `deleteOne()`
- `deleteMany()`
- `updateOne()`
- `upsertOne()`

##### fetch()

```js
// Fetches all documents from the database.
// Returns Promise<Collection<string, Document>>

const collection = db.getCollection('name');

collection.fetch().then((data) => {});
```

##### getData()

```js
// Returns data from local storage.
// Returns Promise<Collection<string, MongoDocument>>

const collection = db.getCollection('name');

const data = await collection.getData();
```

##### filterKeys()

```js
// Filters the collection and returns only keys.
// Returns string[]

const collection = db.getCollection('name');

const keys = collection.filterKeys((value) => value.username === 'zargovv');
```

##### filter()

```js
// Filters the collection.
// Returns Collection<string, Document>

const collection = db.getCollection('name');

const newCollection = collection.filter(
  (value) => value.username === 'zargovv'
);
```

##### findKey()

```js
// Finds document and returns key.
// Returns string | undefined

const collection = db.getCollection('name');

const result = collection.findKey((value) => value.username === 'zargovv');
```

##### findOne()

```js
// Finds document.
// Returns Document | undefined

const collection = db.getCollection('name');

const result = collection.findOne((value) => value.username === 'zargovv');
```

##### getOne()

```js
// Gets document
// (Searches for it, if there is no one, then returns default values).
// Returns Document | undefined

const collection = db.getCollection('name');

const document = collection.getOne((value) => value.username === 'zargovv');
```

##### insertOne()

```js
// Creates new document
// Returns Document

const collection = db.getCollection('name');

const result = collection.insertOne({ id: '1', username: 'zargovv' });
```

##### insertMany()

```js
// Creates new documents
// Returns Document[]

const collection = db.getCollection('name');

const result = collection.insertMany([
  { id: '1', username: 'zargovv' },
  { id: '2', username: 'discore.js' },
]);
```

##### deleteOne()

```js
// Deletes document
// Returns Document | undefined

const collection = db.getCollection('name');

const result = collection.deleteOne({ username: 'zargovv' });
```

##### deleteMany()

```js
// Deletes document
// Returns Promise<Document[]>

const collection = db.getCollection('messages');

const result = collection.deleteMany((doc) => doc.messageCount < 1);
```

##### updateOne()

```js
// Updates document. Returns undefined if document wasn't found.
// Returns Document | undefined

const collection = db.getCollection('name');

const result = collection.updateOne({ username: 'zargovv' }, { id: '0' });
```

##### upsertOne()

```js
// Updates document. Creates new one if not found.
// Returns Document

const collection = db.getCollection('name');

const result = collection.updateOne({ username: 'zargovv' }, { id: '0' });
```

## License

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fzargovv%2Fdiscore.js.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fzargovv%2Fdiscore.js?ref=badge_large)
