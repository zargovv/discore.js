declare module 'discore.js' {
  import {
    Client as DiscordClient,
    Collection,
    Message,
    Channel,
    MessageReaction,
    User,
    RichEmbed as Embed,
  } from 'discord.js';
  import * as Discord from 'discord.js';
  import { Schema as MongoSchema } from 'mongoose';
  import { EventEmitter } from 'events';

  type Aliases = string | string[];
  type QueryKey = any;
  type QueryResolvable =
    | { [key: number]: any }
    | { [key: string]: any }
    | ((key: any, value: any) => boolean)
    | QueryKey;
  type QueryValue = any;
  type MongoDocument = object;
  type Id = any;
  type Level = number;
  type Prefix = string | string[] | RegExp | RegExp[];
  type DB = Mongo | MySql;
  type SplitArgs = string | RegExp;
  type PageResolvable = any;
  type SqlCollection = Collection<string, any>;
  type MongoCollection = Collection<string, any>;
  type Cooldowns = Collection<string, number>;

  interface MySqlTypes {
    Double: any;
    Boolean: any;
    Date: any;
    Char: any;
    VarChar: any;
    TinyText: any;
    Text: any;
    Blob: any;
    MediumText: any;
    LongText: any;
    LongBlob: any;
    TinyInt: any;
    SmallInt: any;
    MediumInt: any;
    Int: any;
    BigInt: any;
    Float: any;
    Decimal: any;
    DateTime: any;
    Timestamp: any;
    Time: any;
    Enum: any;
    Set: any;
  }
  interface MongoTypes {
    Number: any;
    Double: any;
    String: any;
    Object: any;
    Array: any;
    ObjectId: any;
    Boolean: any;
    Date: any;
    RegExp: any;
  }
  interface IMongoModelOptions {
    [key: string]: { type: any; default: any };
  }
  interface IMySqlModelOptions {
    [key: string]: { type: any; default: any };
  }
  interface IConfigAddOptions {
    prefix?: Prefix;
  }
  interface IConfigOptions extends IConfigAddOptions {
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
    filter?(reaction: MessageReaction, user: User): boolean;
    prevPage?: string;
    nextPage?: string;
  }

  export class SqlModel {
    constructor(db: any, name: string, options?: object, defaults?: object);

    public emitter: EventEmitter;
    public db: any;
    public uniqid: UniqueId;
    public defaults: object;
    public name: string;
    public options: object;
    public collection: SqlCollection;

    private _toCollection(): Promise<void>;

    public getAll(): Promise<SqlCollection>;
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

    public static readonly Types: MySqlTypes;

    public close(): any;
    public open(url: any): Promise<any>;
    public addModel(name: string, options: IMySqlModelOptions): MySql;
  }
  class MongoModel {
    constructor(name: string, options?: object, defaults?: object);

    private _modelName: string;
    private _db: any;

    public defaults: object;
    public name: string;
    public collection: MongoCollection;
    public options: object;
    public Schema: MongoSchema;

    private _toCollection(): Promise<void>;

    public getAll(): Promise<MongoCollection>;
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

    public static readonly Types: MongoTypes;

    public close(): any;
    public open(url?: string, options?: object): any;
    public addModel(name: string, options?: IMongoModelOptions): Mongo;
  }
  export class Store extends Collection<string, object> {
    constructor(client: Core, type: string, defaults?: string);

    public search(query: string): any[];
    public get(key: any): any;
    public load(fileath: string): this;
    public init(filepath: string, foldername: string, onlyfile?: string): this;
  }
  class Config extends Collection<string, object> {
    constructor(client: Core, defaults: ICoreOptions);

    public set(key: string, value: IConfigOptions): any;
    public add(key: string, value: IConfigAddOptions): any;
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
      sentPages: Collection<string, Pages>;
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
    public categories: string[];

    public toggle(): Base;
    public unload(emit: boolean): Base;
    public reload(): Base;
    public disable(): Base;
    public enable(): Base;
    public toString(): string;
  }
  export class Command extends Base {
    constructor(
      client: Core,
      store: Store,
      fullpath: string,
      options?: ICommandOptions
    );

    private _options: ICommandOptions;

    public cooldown: number;
    public aliases: Aliases;
    public permLevel: number;
    public description: any;
    public usage: any;
    public cooldowns: Cooldowns;

    public resetCooldowns(...ids: string[]): Cooldowns;
  }
  export class Event extends Base {
    constructor(
      client: Core,
      store: Store,
      fullpath: string,
      options?: IEventOptions
    );

    private _listener: Function;
    private _options: IEventOptions;

    private _unload(): void;
  }
  export class Inhibitor extends Base {
    constructor(
      client: Core,
      store: Store,
      fullpath: string,
      options?: IInhibitorOptions
    );

    private _options: IInhibitorOptions;

    private _run(): Promise<boolean>;
  }
  export class Monitor extends Base {
    constructor(
      client: Core,
      store: Store,
      fullpath: string,
      options?: IMonitorOptions
    );

    private _options: IMonitorOptions;
  }
  export class Trigger extends Base {
    constructor(
      client: Core,
      store: Store,
      fullpath: string,
      options?: ITriggerOptions
    );

    private _options: ITriggerOptions;
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
  export { Discord, Embed };
}
