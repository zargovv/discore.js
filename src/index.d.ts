declare module 'discore.js' {
  import {
    Client as DiscordClient,
    Collection,
    Message,
    Channel,
    MessageReaction,
    User,
  } from 'discord.js';
  import { Schema as MongoSchema } from 'mongoose';
  import { EventEmitter } from 'events';

  enum MySqlTypes {
    Double,
    Boolean,
    Date,
    Char,
    VarChar,
    TinyText,
    Text,
    Blob,
    MediumText,
    LongText,
    LongBlob,
    TinyInt,
    SmallInt,
    MediumInt,
    Int,
    BigInt,
    Float,
    Decimal,
    DateTime,
    Timestamp,
    Time,
    Enum,
    Set,
  }
  enum MongoTypes {
    Number,
    Double,
    String,
    Object,
    Array,
    ObjectId,
    Boolean,
    Date,
    RegExp,
  }

  interface IMongoModelOptions {
    [key: string]: { type: keyof typeof MongoTypes; default: any };
  }
  interface IMySqlModelOptions {
    [key: string]: { type: keyof typeof MySqlTypes; default: any };
  }
  interface IConfigOptions {
    spaceAfterPrefix?: boolean;
    ignorePrefixCase?: boolean;
    mentionPrefix?: boolean;
    permLevels?: PermissionLevels;
    ignoreCase?: boolean;
    ignoreBots?: boolean;
    ignoreSelf?: boolean;
    splitArgs?: SplitArgs;
    prefix?: Prefix;
  }
  interface ICoreOptions extends IConfigOptions {
    inhibitorsFolder?: string;
    commandsFolder?: string;
    monitorsFolder?: string;
    triggersFolder?: string;
    eventsFolder?: string;
    mainPath?: string;
    token?: string;
    db?: DB;
  }
  interface IBaseOptions {
    enabled: boolean;
    key: any;
    name: any;
    id: any;
    once: boolean;
  }
  interface ICommandOptions extends IBaseOptions {
    cooldown: number;
    aliases: Aliases;
    permLevel: number;
    description: any;
    usage: any;
  }
  interface IEventOptions extends IBaseOptions {}
  interface IInhibitorOptions extends IBaseOptions {}
  interface IMonitorOptions extends IBaseOptions {}
  interface ITriggerOptions extends IBaseOptions {}

  interface IPagesOptions {
    filter(reaction: MessageReaction, user: User): boolean;
    prevPage: string;
    nextPage: string;
  }

  type Aliases = string | string[];
  type QueryKey = any;
  type QueryResolvable = object | Function | QueryKey;
  type QueryValue = any;
  type MongoDocument = object;
  type Id = any;
  type Level = number;
  type Prefix = string | string[] | RegExp | RegExp[];
  type DB = Mongo | MySql;
  type SplitArgs = string | RegExp;
  type PageResolvable = any;

  export class SqlModel {
    constructor(db: any, name: string, options?: object, defaults?: object);

    public emitter: EventEmitter;
    public db: any;
    public uniqid: UniqueId;
    public defaults: object;
    public name: string;
    public options: object;
    public collection: Collection;

    private _toCollection(): Promise<void>;

    public getAll(): Promise<Collection>;
    public hasOne(query: QueryResolvable, value: QueryValue): boolean;
    public findOne(query: QueryResolvable, value: QueryValue): MongoDocument;
    public insertOne(data: MongoDocument): Promise<MongoDocument>;
    public deleteOne(
      query: QueryResolvable,
      value: QueryValue
    ): Promise<MongoDocument | null>;
    public updateOne(
      query: QueryResolvable,
      value: QueryValue,
      newData?: QueryValue
    ): Promise<MongoDocument | null>;
    public upsertOne(
      query: QueryResolvable,
      value: QueryValue,
      newData?: QueryValue
    ): Promise<MongoDocument>;
  }
  export class MySql {
    constructor(url: any);

    private _models: SqlModel[];

    public url: any;
    public emitter: EventEmitter;

    public static readonly Types: keyof typeof MySqlTypes;

    public close(): any;
    public open(url: any): Promise<any>;
    public addModel(name: string, options: IMySqlModelOptions): MySql;
  }
  export class MongoModel {
    constructor(name: string, options?: object, defaults?: object);

    private _modelName: string;
    private _db: any;

    public defaults: object;
    public name: string;
    public collection: Collection;
    public options: object;
    public Schema: MongoSchema;

    private _toCollection(): Promise<void>;

    public getAll(): Promise<Collection>;
    public hasOne(query: QueryResolvable, value: QueryValue): boolean;
    public findOne(query: QueryResolvable, value: QueryValue): MongoDocument;
    public insertOne(data: MongoDocument): Promise<MongoDocument>;
    public deleteOne(
      query: QueryResolvable,
      value: QueryValue
    ): Promise<MongoDocument | null>;
    public updateOne(
      query: QueryResolvable,
      value: QueryValue,
      newData?: QueryValue
    ): Promise<MongoDocument | null>;
    public upsertOne(
      query: QueryResolvable,
      value: QueryValue,
      newData?: QueryValue
    ): Promise<MongoDocument>;
  }
  export class Mongo {
    constructor(url: string, options?: object);

    private _models: MongoModel[];
    public connection: any;
    public url: string;
    public defaultOptions: object;
    public options: object;

    public static readonly Types: keyof typeof MongoTypes;

    public close(): any;
    public open(url?: string, options?: object): any;
    public addModel(name: string, options?: IMongoModelOptions): Mongo;
  }
  export class Store extends Collection {
    constructor(client: Core, type: string, defaults?: string);

    public search(query: string): any[];
    public get(key: any): any;
    public load(fileath: string): Store;
    public init(filepath: string, foldername: string, onlyfile?: string): Store;
  }
  export class Config extends Collection {
    constructor(client: Core, defaults: ICoreOptions);

    public set(key: string, value: object): any;
    public add(key: string, value: object): any;
    public get(key: string): any;
  }
  export class PermissionLevels {
    constructor();

    private _id: Level;
    public readonly length: number;

    public addLevel(level: Level, brk: boolean, fn: Function): PermissionLevels;
    public add(level: Level, brk: boolean, fn: Function): PermissionLevels;
    public test(level: Level, message: Message, client: Core): Promise<boolean>;

    private _getId(): Level;
    private _test(
      level: Level,
      message: Message,
      client: Core
    ): Promise<boolean>;
  }
  export class UniqueId {
    constructor(ids: Id[]);

    public ids: Set<Id[]>;

    public remove(id: Id): Id;
    public delete(id: Id): Id;
    public gen(length?: number): Id;
    public generate(length?: number): Id;
    public generateId(length?: number): Id;
    public genId(length?: number): Id;

    private _genId(length: number): Id;
  }
  export class Core extends DiscordClient {
    constructor(options?: ICoreOptions);

    private _private: {
      inhibitorsFolder: string;
      commandsFolder: string;
      monitorsFolder: string;
      triggersFolder: string;
      eventsFolder: string;
      sentPages: Collection;
      fullpath: string;
      dirpath: string;
    };

    public config: { guild: Config };
    public prefix: Prefix;
    public splitArgs: SplitArgs;
    public ignoreCase: boolean;
    public permLevels: PermissionLevels;
    public ignoreBots: boolean;
    public ignoreSelf: boolean;
    public ignorePrefixCase: boolean;
    public db: DB;
    public uniqid: UniqueId;

    public events: Store;
    public monitors: Store;
    public commands: Store;
    public triggers: Store;
    public inhibitors: Store;
  }
  class Base {
    constructor(
      client: Core,
      store: Store,
      type: string,
      fullpath: string,
      options?: IBaseOptions
    );

    public _options: IBaseOptions;
    public _id: Id;

    public readonly client: Core;
    public readonly store: Store;
    public custom: object;
    public id: any;
    public dir: string;
    public file: string;
    public type: string;
    public enabled: boolean;
    public once: boolean;
    public key: any;
    public name: any;

    public _run(...args: any[]): void;
    private _init(): any;

    public run(): never;
    public disabledRun(): void;
    public toggle(): Base;
    public unload(emit: boolean): Base;
    public reload(): Base;
    public disable(): Base;
    public enable(): Base;
    public toString(): string;
    public init(): void;
  }
  export class Command extends Base {
    constructor(
      client: Core,
      store: Store,
      fullpath: string,
      options?: ICommandOptions
    );

    public _options: ICommandOptions;

    public cooldown: number;
    public aliases: Aliases;
    public permLevel: number;
    public description: any;
    public usage: any;
    public cooldowns: Collection;

    public noPermsRun(): void;
  }
  export class Event extends Base {
    constructor(
      client: Core,
      store: Store,
      fullpath: string,
      options?: IEventOptions
    );

    private _listener: Function;
    public _options: IEventOptions;

    private _unload(): void;
  }
  export class Inhibitor extends Base {
    constructor(
      client: Core,
      store: Store,
      fullpath: string,
      options?: IInhibitorOptions
    );

    public _options: IInhibitorOptions;

    public _run(): Promise<boolean>;
  }
  export class Monitor extends Base {
    constructor(
      client: Core,
      store: Store,
      fullpath: string,
      options?: IMonitorOptions
    );

    public _options: IMonitorOptions;
  }
  export class Trigger extends Base {
    constructor(
      client: Core,
      store: Store,
      fullpath: string,
      options?: ITriggerOptions
    );

    public _options: ITriggerOptions;
  }
  export class Pages {
    constructor(client: Core, options: IPagesOptions);

    public readonly client: Core;
    public options: IPagesOptions;
    public emojis: { prevPage: string; nextPage: string };
    public pages: PageResolvable[];
    public filter: (reaction: MessageReaction, user: User) => boolean;

    public addPage(msg: PageResolvable): Pages;
    public add(...msgs: PageResolvable[]): Pages;
    public send(channel: Channel): Promise<Message>;
  }
}
