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
  type Id = any;
  type Level = number;
  type Prefix = string | string[] | RegExp | RegExp[];
  type DB = Mongo | MySql;
  type ArgsSeparator = string | RegExp;
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
  interface IFolderOptions {
    inhibitors?: string;
    commands?: string;
    monitors?: string;
    triggers?: string;
    events?: string;
  }
  interface IPrefixOptions {
    spaceSeparator?: boolean;
    ignoreCase?: boolean;
    mention?: boolean;
  }
  interface ICommandConfig {
    argsSeparator?: string;
    permLevels?: PermissionLevels;
    ignoreCase?: boolean;
    ignoreBots?: boolean;
    ignoreSelf?: boolean;
  }
  interface IConfigOptions extends IConfigAddOptions {
    prefixOptions: IPrefixOptions;
    commandOptions?: ICommandConfig;
    prefix?: Prefix;
  }
  interface ICoreOptions extends IConfigOptions {
    mainPath?: string;
    folders?: IFolderOptions;
    mobile?: boolean;
    token?: string;
    db?: DB;
  }
  interface IBaseOptions {
    enabled?: boolean;
    key?: any;
    name?: any;
    id?: any;
    once?: boolean;
  }
  interface ICommandOptions extends IBaseOptions {
    cooldown?: number;
    aliases?: Aliases;
    permLevel?: number;
    description?: any;
    usage?: any;
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

  interface IDocument {
    [key: string]: any;
  }
  class Doc implements IDocument {
    [key: string]: any;

    public populate(keys: string[], remove?: boolean): Doc;
    public json(keys: string[], remove?: boolean): object;
  }

  type TCollections = Collection<string, JsonModel>;
  type TQueryKey = any;
  type TQueryValue = any;
  type TQueryResolvable =
    | { [key: number]: any }
    | { [key: string]: any }
    | ((key: any, value: any) => boolean)
    | TQueryKey;

  interface IModelBody {
    [key: string]: any;
  }
  interface IQueueIterator {
    path: string;
    data: string;
  }

  export class SqlModel {
    constructor(db: any, name: string, options?: object, defaults?: object);

    public emitter: EventEmitter;
    public db: any;
    public defaults: object;
    public name: string;
    public options: object;
    public data: SqlCollection;

    public fetch(): Promise<SqlCollection>;

    public filterKeys(query: string, value: string): string[];
    public filterKeys(query: { [key: string]: any }): string[];
    public filterKeys(
      query: (value: any, key: string, collection: SqlCollection) => boolean
    ): string[];
    public filterKeys(query: QueryResolvable, value?: QueryValue): string[];

    public filter(query: string, value: string): SqlCollection;
    public filter(query: { [key: string]: any }): SqlCollection;
    public filter(
      query: (value: any, key: string, collection: SqlCollection) => boolean
    ): SqlCollection;
    public filter(query: QueryResolvable, value?: QueryValue): SqlCollection;

    public findKey(query: string, value: string): string | null;
    public findKey(query: { [key: string]: any }): string | null;
    public findKey(
      query: (value: any, key: string, collection: SqlCollection) => boolean
    ): string | null;
    public findKey(query: QueryResolvable, value?: QueryValue): string | null;

    public findOne(query: string, value: string): Doc | null;
    public findOne(query: { [key: string]: any }): Doc | null;
    public findOne(
      query: (value: any, key: string, collection: SqlCollection) => boolean
    ): Doc | null;
    public findOne(query: QueryResolvable, value?: QueryValue): Doc | null;

    public getOne(query: string, value: string): Doc;
    public getOne(query: { [key: string]: any }): Doc;
    public getOne(
      query: (value: any, key: string, collection: SqlCollection) => boolean
    ): Doc;
    public getOne(query: QueryResolvable, value?: QueryValue): Doc;

    public insertOne(data: IDocument): Doc;

    public insertMany(data: IDocument[]): Doc;

    public deleteOne(query: string, value: string): Doc | null;
    public deleteOne(query: { [key: string]: any }): Doc | null;
    public deleteOne(
      query: (value: any, key: string, collection: SqlCollection) => boolean
    ): Doc | null;
    public deleteOne(query: QueryResolvable, value?: QueryValue): Doc | null;

    public updateOne(
      query: string,
      value: string,
      newData: IDocument
    ): Doc | null;
    public updateOne(
      query: { [key: string]: any },
      newData: IDocument
    ): Doc | null;
    public updateOne(
      query: (value: any, key: string, collection: SqlCollection) => boolean,
      newData: IDocument
    ): Doc | null;
    public updateOne(query: QueryResolvable, value?: QueryValue): Doc | null;

    public upsertOne(query: string, value: string, newData: IDocument): Doc;
    public upsertOne(query: { [key: string]: any }, newData: IDocument): Doc;
    public upsertOne(
      query: (value: any, key: string, collection: SqlCollection) => boolean,
      newData: IDocument
    ): Doc;
    public upsertOne(query: QueryResolvable, value?: QueryValue): Doc;
  }
  export class MySql {
    constructor(url: any);

    public collections: Collection<string, SqlModel>;
    public url: any;
    public emitter: EventEmitter;

    public static readonly Types: MySqlTypes;

    public close(): any;
    public open(url: any): Promise<any>;
    public addModel(name: string, options: IMySqlModelOptions): MySql;
    public getCollection(name: string): SqlModel | undefined;
  }
  class MongoModel {
    constructor(db: any, name: string, options?: object, defaults?: object);

    public data: MongoCollection;
    public defaults: object;
    public name: string;
    public options: object;
    public db: any;

    public fetch(): Promise<MongoCollection>;

    public filterKeys(query: string, value: string): string[];
    public filterKeys(query: { [key: string]: any }): string[];
    public filterKeys(
      query: (value: any, key: string, collection: MongoCollection) => boolean
    ): string[];
    public filterKeys(query: QueryResolvable, value?: QueryValue): string[];

    public filter(query: string, value: string): MongoCollection;
    public filter(query: { [key: string]: any }): MongoCollection;
    public filter(
      query: (value: any, key: string, collection: MongoCollection) => boolean
    ): MongoCollection;
    public filter(query: QueryResolvable, value?: QueryValue): MongoCollection;

    public findKey(query: string, value: string): string | null;
    public findKey(query: { [key: string]: any }): string | null;
    public findKey(
      query: (value: any, key: string, collection: MongoCollection) => boolean
    ): string | null;
    public findKey(query: QueryResolvable, value?: QueryValue): string | null;

    public findOne(query: string, value: string): Doc | null;
    public findOne(query: { [key: string]: any }): Doc | null;
    public findOne(
      query: (value: any, key: string, collection: MongoCollection) => boolean
    ): Doc | null;
    public findOne(query: QueryResolvable, value?: QueryValue): Doc | null;

    public getOne(query: string, value: string): Doc;
    public getOne(query: { [key: string]: any }): Doc;
    public getOne(
      query: (value: any, key: string, collection: MongoCollection) => boolean
    ): Doc;
    public getOne(query: QueryResolvable, value?: QueryValue): Doc;

    public insertOne(data: IDocument): Doc;

    public insertMany(data: IDocument[]): Doc;

    public deleteOne(query: string, value: string): Doc | null;
    public deleteOne(query: { [key: string]: any }): Doc | null;
    public deleteOne(
      query: (value: any, key: string, collection: MongoCollection) => boolean
    ): Doc | null;
    public deleteOne(query: QueryResolvable, value?: QueryValue): Doc | null;

    public updateOne(
      query: string,
      value: string,
      newData: IDocument
    ): Doc | null;
    public updateOne(
      query: { [key: string]: any },
      newData: IDocument
    ): Doc | null;
    public updateOne(
      query: (value: any, key: string, collection: MongoCollection) => boolean,
      newData: IDocument
    ): Doc | null;
    public updateOne(query: QueryResolvable, value?: QueryValue): Doc | null;

    public upsertOne(query: string, value: string, newData: IDocument): Doc;
    public upsertOne(query: { [key: string]: any }, newData: IDocument): Doc;
    public upsertOne(
      query: (value: any, key: string, collection: MongoCollection) => boolean,
      newData: IDocument
    ): Doc;
    public upsertOne(query: QueryResolvable, value?: QueryValue): Doc;
  }
  export class Mongo {
    constructor(url: string, options?: object);

    public collections: Collection<string, MongoModel>;
    public connection: any;
    public url: string;
    public defaultOptions: object;
    public options: object;

    public static readonly Types: MongoTypes;

    public close(): any;
    public open(url?: string, options?: object): any;
    public addModel(name: string, options?: IMongoModelOptions): Mongo;
    public getCollection(name: string): MongoModel | undefined;
  }

  class JsonModel {
    public data: Collection<string, Doc>;
    public db: Json;
    public name: string;
    public path: string;
    public defaults: object;

    constructor(worker: Worker, name: string, path: string, defaults: object);

    public save(): void;

    public filterKeys(query: IDocument): string[];
    public filterKeys(query: string, value: any): string[];
    public filterKeys(
      query: (value: Doc, key: string, model: JsonModel) => boolean
    ): string[];
    public filterKeys(query: TQueryResolvable, value?: TQueryValue): string[];

    public filter(query: IDocument): Doc[];
    public filter(query: string, value: any): Doc[];
    public filter(
      query: (value: Doc, key: string, model: JsonModel) => boolean
    ): Doc[];
    public filter(query: TQueryResolvable, value?: TQueryValue): Doc[];

    public findKey(query: IDocument): string | null;
    public findKey(query: string, value: any): string | null;
    public findKey(
      query: (value: Doc, key: string, model: JsonModel) => boolean
    ): string | null;
    public findKey(query: TQueryResolvable, value?: TQueryValue): string | null;

    public findOne(query: IDocument): Doc | null;
    public findOne(query: string, value: any): Doc | null;
    public findOne(
      query: (value: Doc, key: string, model: JsonModel) => boolean
    ): Doc | null;
    public findOne(query: TQueryResolvable, value?: TQueryValue): Doc | null;

    public getOne(query: IDocument): Doc;
    public getOne(query: string, value: any): Doc;
    public getOne(
      query: (value: Doc, key: string, model: JsonModel) => boolean
    ): Doc;
    public getOne(query: TQueryResolvable, value?: TQueryValue): Doc;

    public insertOne(data: Doc | IDocument): Doc;

    public insertMany(data: Doc[] | IDocument[]): Doc[];

    public deleteOne(query: IDocument): Doc | null;
    public deleteOne(query: string, value: any): Doc | null;
    public deleteOne(
      query: (value: Doc, key: string, model: JsonModel) => boolean
    ): Doc | null;
    public deleteOne(query: TQueryResolvable, value?: TQueryValue): Doc | null;

    public deleteMany(query: IDocument): Doc | null;
    public deleteMany(query: string, value: any): Doc | null;
    public deleteMany(
      query: (value: Doc, key: string, model: JsonModel) => boolean
    ): Doc | null;
    public deleteMany(query: TQueryResolvable, value?: TQueryValue): Doc | null;

    public updateOne(query: IDocument, newData: IDocument): Doc | null;
    public updateOne(query: string, value: any, newData: IDocument): Doc | null;
    public updateOne(
      query: (value: Doc, key: string, model: JsonModel) => boolean,
      newData: IDocument
    ): Doc | null;
    public updateOne(
      query: TQueryResolvable,
      value: TQueryValue,
      newData?: TQueryValue
    ): Doc | null;

    public upsertOne(query: IDocument, newData: IDocument): Doc;
    public upsertOne(query: string, value: any, newData: IDocument): Doc;
    public upsertOne(
      query: (value: Doc, key: string, model: JsonModel) => boolean,
      newData: IDocument
    ): Doc;
    public upsertOne(
      query: TQueryResolvable,
      value: TQueryValue,
      newData?: TQueryValue
    ): Doc;
  }
  export default class Json {
    public path: string;
    public collections: TCollections;
    public savingQueue: Collection<string, IQueueIterator>;

    constructor(dirPath: string);

    public addModel(key: string, modelBody: IModelBody): Json;
    public getCollection(key: string): JsonModel;
    public save(collection?: string | null): boolean;

    private processQueue(): void;
  }
  export class Store extends Collection<
    string,
    Command | Event | Trigger | Inhibitor | object
  > {
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
    public get(key: string): IConfigOptions;
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
    public static readonly index: number;
    public id?: String;

    constructor();

    public static randomBytes(size: number): Uint8Array;
    public static getInc(): number;
    public static generate(time?: number): Buffer;
    public toString(): String;
  }
  export class Core extends DiscordClient {
    constructor(options?: ICoreOptions);

    private _private: {
      folders: IFolderOptions;
      sentPages: Collection<string, Pages>;
      fullpath: string;
      dirpath: string;
    };

    public config: { guild: Config };
    public prefix: Prefix;
    public argsSeparator: ArgsSeparator;
    public ignoreCase: boolean;
    public permLevels: PermissionLevels;
    public ignoreBots: boolean;
    public ignoreSelf: boolean;
    public ignorePrefixCase: boolean;
    public db: DB;

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
