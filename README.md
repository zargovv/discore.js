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
    <div>
      <a href="https://twitter.com/intent/follow?screen_name=zargovv">
        <img src="https://img.shields.io/twitter/follow/zargovv?style=flat&logo=twitter" alt="Follow On Twitter">
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
  eventsFolder: 'events',
  commandsFolder: 'commands',
  monitorsFolder: 'monitors',
  triggersFolder: 'triggers',
  token: null,
  // To make multiple prefixes you can make an array
  // Example: ['!', '.']
  prefix: undefined,
  spaceAfterPrefix: false,
  splitArgs: ' ',
  ignoreCase: true,
  permLevels: new PermissionLevels(),
  ignoreSelf: true,
  ignoreBots: true,
  db: null,
});
```

- Per-guild configuration.

```js
this.client.config.guild.set('guild_id', {
  // Default settings:
  prefix: undefined,
  splitArgs: ' ',
  ignoreCase: true,
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

#### Methods

- `uniqid.gen()` // Generates unique identificator

### Events

Events are placed in `.\events\`(**eventsFolder** option).
For instance creating `.\events\Main\ready.js` will be an event `ready` in the `Main` category. Subcategories are also allowed and gonna be a second and more folder levels.

Their structure (options argument defined with default configuration):

```js
const { Event } = require('discore.js');

module.exports = class extends Event {
  get options() {
    return {
      // Will run run() method if true, otherwise disabledRun() method.
      enabled: true,
      key: null, // Same as name but more important.
      name: null, // Key is going to be event name.
      once: false, // Unloads after first use if true.
      id: undefined, // UniqID if not defined. Used to get the event.
    };
    // If key and name are null then they will be defined as file name.
    // For example, ready.js is gonna be 'ready'
  }

  get customOptions() {
    return {
      // You can put any options you want.
      // And use it via this.custom.
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
    // data via this.client.
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
      // Will run run() method if true, otherwise disabledRun() method.
      enabled: true,
      key: null, // Same as name but more important.
      name: null, // Key is going to be command name.
      id: undefined, // UniqID if not defined. Used to get the event.
      cooldown: 0, // In milliseconds
      aliases: [],
      permLevel: 0, // Runs noPermsRun() method if tests not passed.
      description: undefined,
      usage: undefined,
      once: false, // Unloads after first use if true.
    };
    // If key and name are null then they will be defined as file name.
    // For example, test.js is gonna be 'test'
  }

  get customOptions() {
    return {
      // You can put any options you want.
      // And use it via this.custom.
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

  init() {
    // Optional method. Runs on 'ready'
    // event so you are able to use discord
    // data via this.client.
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

##### Method Examples

```js
const command = this.client.commands.get('command');
command
  .toggle()
  .enable()
  .disable()
  .unload()
  .reload()
  .toString();
```

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
      // Will run run() method if true, otherwise disabledRun() method.
      enabled: true,
      key: null, // Same as name but more important.
      name: null, // Key is going to be monitor name.
      id: undefined, // UniqID if not defined. Used to get the monitor.
      once: false, // Unloads after first use if true.
    };
    // If key and name are null then they will be defined as file name.
    // For example, filter.js is gonna be 'filter'
  }

  get customOptions() {
    return {
      // You can put any options you want.
      // And use it via this.custom.
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
    // data via this.client.
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
      // Will run run() method if true, otherwise disabledRun() method.
      enabled: true,
      key: null, // Same as name but more important.
      name: null, // Key is going to be trigger name.
      id: undefined, // UniqID if not defined. Used to get the trigger.
      once: false, // Unloads after first use if true.
    };
    // If key and name are null then they will be defined as file name.
    // For example, xp.js is gonna be 'xp'
  }

  get customOptions() {
    return {
      // You can put any options you want.
      // And use it via this.custom.
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
    // data via this.client.
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
      // Will run run() method if true, otherwise disabledRun() method.
      enabled: true,
      key: null, // Same as name but more important.
      name: null, // Key is going to be event name.
      id: undefined, // UniqID if not defined. Used to get the event.
      once: false, // Unloads after first use if true.
    };
    // If key and name are null then they will be defined as file name.
    // For example, inhibit.js is gonna be 'inhibit'
  }

  get customOptions() {
    return {
      // You can put any options you want.
      // And use it via this.custom.
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
  }

  disabledRun(message, cmd) {
    // Same as run but runs only if disabled.
  }

  init() {
    // Optional method. Runs on 'ready'
    // event so you are able to use discord
    // data via this.client.
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

##### Method Examples

```js
this.client.events.load('./events/event');
this.client.commands.load('./commands/command');

this.client.events.get('event_id');
this.client.events.get('event_name'); // Same as previous example

this.client.commands.get('command_id');
this.client.commands.get('command_name'); // Same as previous example
this.client.commands.get('command_alias'); // Same as previous example
```

### Permission Levels

Their structure:

```js
const { Core, PermissionLevels } = require('discore.js');
const config = require('./config');

const permLevels = new PermissionLevels();
permLevels
  .add(0, true, msg => msg.author.id === '1') // Throws error.
  // Permissions Level 1 is true only if message author id is '1'
  .add(1, false, msg => msg.author.id === '1')
  // Same as previous example
  .addLevel(2, false, (msg, client) => {
    return msg.author.id === client.user.id;
  });

// Test for a role.
permLevels.add(3, true, msg => msg.member.roles.has('roleid'));

// Testing. Returns boolean.
permLevels.test(3, msg);

// You can define client as third argument if needed.
permLevels.test(2, msg, this.client);

new Core(config);
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

### Embed ( RichEmbed )

Their structure:

```js
const { Embed } = require('discore.js');

const embed = new Embed()
  .addBlankField()
  .addField('Title', 'Description')
  .attachFile(file)
  .attachFiles(files)
  .setAuthor('author', 'image url')
  .setColor(color)
  .setDescription('description')
  .setFooter('footer', 'image url')
  .setImage('image url')
  .setThumbnail('image url')
  .setTimestamp()
  .setTitle('title')
  .setURL('url');
```

#### Methods

- `addBlankField()`
- `addField()`
- `attachFile()`
- `attachFiles()`
- `setAuthor()`
- `setColor()`
- `setDescription()`
- `setFooter()`
- `setImage()`
- `setThumbnail()`
- `setTimestamp()`
- `setTitle()`
- `setURL()`

#### Properties

- `author`
- `color`
- `description`
- `fields`
- `file`
- `files`
- `footer`
- `image`
- `length`
- `thumbnail`
- `timestamp`
- `title`
- `url`

## Databases

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

#### Events

- `dbConnected`
- `dbError`
- `dbDisconnected`

#### Methods

- `addModel()`
- `open()` ( Open connection )
- `close()` ( Close connection )

#### Properties

- `collection`

### DB Models

Their structure:

```js
// Must define all default properties.
// You can leave properties as undefined.
const data = {
  id: { type: Mongo.Types.String, default: undefined },
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

- `hasOne()`
- `findOne()`
- `insertOne()`
- `deleteOne()`
- `updateOne()`
- `upsertOne()`

##### hasOne()

```js
// Working with model from previous example.
// You can use `db['modelName']`

// Searches for document with `id` of '123'.
let res1 = db.modelName.hasOne({ id: '123' });
let res2 = db.modelName.hasOne('id', '123'); // Same.
let res3 = db.modelName.hasOne(val => val.id === '123'); // Same.

console.log(typeof res); // Returns true or false (Boolean).
console.log(typeof res2); // Same.
console.log(typeof res3); // Same.
```

##### findOne()

```js
// Working with model from previous example.
// You can use `db['modelName']` or `db.modelName`

// Searches for document with `id` of '123'.
let res1 = db.modelName.findOne({ id: '123' });
let res2 = db.modelName.findOne('id', '123'); // Same.
let res3 = db.modelName.findOne(val => val.id === '123'); // Same.

/*
  Returns document. If there is no document
  then you will getdefault settings which
  were defined by yourself.

  That means you can not get undefined or
  null.
*/
console.log(typeof res);
console.log(typeof res2); // Same.
console.log(typeof res3); // Same.
```

##### insertOne()

```js
// **upsertOne() method is recommended to use!**
db.modelName.insertOne({
  id: '3213',
  messageCount: 1, // If not defined, going to be 0.
});
```

##### deleteOne()

```js
// returns null or document.
db.modelName.deleteOne({ id: '3213' });

/*
  Does the same thing but returns null
  because document is already deleted.
*/
db.modelName.deleteOne('id', '3212');

// Same as previous example.
db.modelName.deleteOne(val => val.id === '3212');
```

##### updateOne()

```js
// **upsertOne() method is recommended to use!**

/*
  All of these examples are going to search
  for `id` of '3213' and update 
*/
db.modelName.updateOne({ id: '3213' }, { messageCount: 2 });
db.modelName.updateOne('id', '3212', { messageCount: 2 });
db.modelName.updateOne(val => val.id === '3212', { messageCount: 2 });
```

##### upsertOne()

```js
/*
  upsertOne() method is trying to update
  a document. If document is not exists then
  is going to insert it.
*/

// All of these examples are going to search
// for `id` of '3213' and update
// messageCount to 2.
db.modelName.upsertOne({ id: '3213' }, { messageCount: 2 });
db.modelName.upsertOne('id', '3212', { messageCount: 2 });
db.modelName.upsertOne(val => val.id === '3212', { messageCount: 2 });
```

### MySQL

Structure:

```js
const { Core, MySql } = require('discore.js');

const db = new MySql('url');

new Core({
  db,
});
```

#### Events

- `dbConnected`
- `dbError`
- `dbDisconnected`

#### Methods

- `addModel()`
- `open()` ( Open connection )
- `close()` ( Close connection )

#### Properties

- `collection`

### DB Models

Their structure:

```js
// Must define all default properties.
// You can leave properties as undefined.
const data = {
  id: { type: MySql.Types.VarChar(18), default: undefined },
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

- `hasOne()`
- `findOne()`
- `insertOne()`
- `deleteOne()`
- `updateOne()`
- `upsertOne()`

##### hasOne()

```js
// Working with model from previous example.
// You can use `db['modelName']`

// Searches for document with `id` of '123'.
let res1 = db.modelName.hasOne({ id: '123' });
let res2 = db.modelName.hasOne('id', '123'); // Same.
let res3 = db.modelName.hasOne(val => val.id === '123'); // Same.

console.log(typeof res); // Returns true or false (Boolean).
console.log(typeof res2); // Same.
console.log(typeof res3); // Same.
```

##### findOne()

```js
// Working with model from previous example.
// You can use `db['modelName']` or `db.modelName`

// Searches for document with `id` of '123'.
let res1 = db.modelName.findOne({ id: '123' });
let res2 = db.modelName.findOne('id', '123'); // Same.
let res3 = db.modelName.findOne(val => val.id === '123'); // Same.

/*
  Returns document. If there is no document
  then you will getdefault settings which
  were defined by yourself.

  That means you can not get undefined or
  null.
*/
console.log(typeof res);
console.log(typeof res2); // Same.
console.log(typeof res3); // Same.
```

##### insertOne()

```js
// **upsertOne() method is recommended to use!**
db.modelName.insertOne({
  id: '3213',
  messageCount: 1, // If not defined, going to be 0.
});
```

##### deleteOne()

```js
// returns null or document.
db.modelName.deleteOne({ id: '3213' });

/*
  Does the same thing but returns null
  because document is already deleted.
*/
db.modelName.deleteOne('id', '3212');

// Same as previous example.
db.modelName.deleteOne(val => val.id === '3212');
```

##### updateOne()

```js
// **upsertOne() method is recommended to use!**

/*
  All of these examples are going to search
  for `id` of '3213' and update 
*/
db.modelName.updateOne({ id: '3213' }, { messageCount: 2 });
db.modelName.updateOne('id', '3212', { messageCount: 2 });
db.modelName.updateOne(val => val.id === '3212', { messageCount: 2 });
```

##### upsertOne()

```js
/*
  upsertOne() method is trying to update
  a document. If document is not exists then
  is going to insert it.
*/

// All of these examples are going to search
// for `id` of '3213' and update
// messageCount to 2.
db.modelName.upsertOne({ id: '3213' }, { messageCount: 2 });
db.modelName.upsertOne('id', '3212', { messageCount: 2 });
db.modelName.upsertOne(val => val.id === '3212', { messageCount: 2 });
```


## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fzargovv%2Fdiscore.js.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fzargovv%2Fdiscore.js?ref=badge_large)