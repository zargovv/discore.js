declare module 'discore.js' {
  import {
    Client as DiscordClient,
    Collection,
    Message,
    Channel,
    MessageReaction,
    User,
    MessageEmbed as Embed,
  } from 'discord.js';
  import * as Discord from 'discord.js';
  import { EventEmitter } from 'events';

  export type Aliases = string | string[];
  export type QueryKey = any;
  export type QueryResolvable =
    | { [key: number]: any }
    | { [key: string]: any }
    | ((key: any, value: any) => boolean)
    | QueryKey;
  export type QueryValue = any;
  export type Id = any;
  export type Level = number;
  export type Prefix = string | RegExp | (RegExp | string)[];
  export type DB = Mongo | MySql | Json;
  export type ArgsSeparator = string | RegExp;
  export type PageResolvable = any;
  export type SqlCollection = Collection<string, Doc>;
  export type MongoCollection = Collection<string, Doc>;
  export type Cooldowns = Collection<string, number>;

  export interface MySqlTypes {
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
  export interface MongoTypes {
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
  export interface IMongoModelOptions {
    [key: string]: { type: any; default: any };
  }
  export interface IMySqlModelOptions {
    [key: string]: { type: any; default: any };
  }
  export interface IConfigAddOptions {
    prefix?: Prefix;
  }
  export interface IFolderOptions {
    inhibitors?: string;
    finalizers?: string;
    commands?: string;
    monitors?: string;
    triggers?: string;
    events?: string;
  }
  export interface IPrefixOptions {
    spaceSeparator?: boolean;
    ignoreCase?: boolean;
    mention?: boolean;
  }
  export interface ICommandConfig {
    argsSeparator?: string | RegExp;
    permLevels?: PermissionLevels;
    ignoreCase?: boolean;
    ignoreBots?: boolean;
    ignoreSelf?: boolean;
  }
  export interface IConfigOptions extends IConfigAddOptions {
    mentionPrefix?: boolean;
    ignoreBots?: boolean;
    ignoreSelf?: boolean;
    argsSeparator?: string | RegExp;
    spaceSeparator?: boolean;
    ignoreCase?: boolean;
    prefix?: (string | RegExp)[];
  }
  export interface ICoreOptions {
    prefixOptions?: IPrefixOptions;
    commandOptions?: ICommandConfig;
    mainPath?: string;
    folders?: IFolderOptions;
    mobile?: boolean;
    token?: string;
    prefix?: (string | RegExp)[];
    db?: DB;
  }
  export interface CoreOptions {
    prefixOptions?: IPrefixOptions;
    commandOptions?: ICommandConfig;
    mainPath?: string;
    folders?: IFolderOptions;
    mobile?: boolean;
    token?: string;
    prefix?: string | RegExp | (string | RegExp)[];
    db?: DB;
  }
  export interface IBaseOptions {
    enabled?: boolean;
    key?: any;
    name?: any;
    id?: any;
    once?: boolean;
  }
  export interface ICommandOptions extends IBaseOptions {
    runIn?: string | string[];
    aliases?: Aliases;
    cooldown?: number;
    permLevel?: number;
    requiredPerms?: number | string | Array<string | number>;
    requiredRoles?: string | string[];
  }
  export interface IEventOptions extends IBaseOptions {}
  export interface IInhibitorOptions extends IBaseOptions {}
  export interface IMonitorOptions extends IBaseOptions {}
  export interface ITriggerOptions extends IBaseOptions {}
  export interface IFinalizerOptions extends IBaseOptions {}

  export interface IPagesOptions {
    filter?(reaction: MessageReaction, user: User): boolean;
    prevPage?: string;
    nextPage?: string;
  }

  export interface IDocument {
    [key: string]: any;
  }
  export class Doc implements IDocument {
    [key: string]: any;
    private _model: JsonModel | SqlModel | MongoModel;

    public save(): Promise<Doc>;
    public populate(keys: string[], remove?: boolean): Doc;
    public json(): object;
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

  export class SqlModel extends EventEmitter {
    constructor(db: any, name: string, options?: object, defaults?: object);

    public db: any;
    public defaults: object;
    public name: string;
    public options: object;
    public data: SqlCollection;
    public state: 0 | 1;

    private enqueue(action: () => any): Promise<any>;

    public fetch(): Promise<SqlCollection>;

    public getData(): Promise<SqlCollection>;

    public filterKeys(query: string, value: string): Promise<string[]>;
    public filterKeys(query: { [key: string]: any }): Promise<string[]>;
    public filterKeys(
      query: (value: any, key: string, collection: SqlCollection) => boolean
    ): Promise<string[]>;
    public filterKeys(
      query: QueryResolvable,
      value?: QueryValue
    ): Promise<string[]>;

    public filter(query: string, value: string): Promise<SqlCollection>;
    public filter(query: { [key: string]: any }): Promise<SqlCollection>;
    public filter(
      query: (value: any, key: string, collection: SqlCollection) => boolean
    ): Promise<SqlCollection>;
    public filter(
      query: QueryResolvable,
      value?: QueryValue
    ): Promise<SqlCollection>;

    public findKey(query: string, value: string): Promise<string | undefined>;
    public findKey(query: { [key: string]: any }): Promise<string | undefined>;
    public findKey(
      query: (value: any, key: string, collection: SqlCollection) => boolean
    ): Promise<string | undefined>;
    public findKey(
      query: QueryResolvable,
      value?: QueryValue
    ): Promise<string | undefined>;

    public findOne(query: string, value: string): Promise<Doc | undefined>;
    public findOne(query: { [key: string]: any }): Promise<Doc | undefined>;
    public findOne(
      query: (value: any, key: string, collection: SqlCollection) => boolean
    ): Promise<Doc | undefined>;
    public findOne(
      query: QueryResolvable,
      value?: QueryValue
    ): Promise<Doc | undefined>;

    public getOne(query: string, value: string): Promise<Doc>;
    public getOne(query: { [key: string]: any }): Promise<Doc>;
    public getOne(
      query: (value: any, key: string, collection: SqlCollection) => boolean
    ): Promise<Doc>;
    public getOne(query: QueryResolvable, value?: QueryValue): Promise<Doc>;

    public insertOne(data: IDocument): Doc;

    public insertMany(data: IDocument[]): Doc;

    public deleteOne(query: string, value: string): Promise<Doc | undefined>;
    public deleteOne(query: { [key: string]: any }): Promise<Doc | undefined>;
    public deleteOne(
      query: (value: any, key: string, collection: SqlCollection) => boolean
    ): Promise<Doc | undefined>;
    public deleteOne(
      query: QueryResolvable,
      value?: QueryValue
    ): Promise<Doc | undefined>;

    public deleteMany(query: string, value: string): Promise<Doc[]>;
    public deleteMany(query: { [key: string]: any }): Promise<Doc[]>;
    public deleteMany(
      query: (value: any, key: string, collection: SqlCollection) => boolean
    ): Promise<Doc[]>;
    public deleteMany(
      query: QueryResolvable,
      value?: QueryValue
    ): Promise<Doc[]>;

    public updateOne(
      query: string,
      value: string,
      newData: IDocument
    ): Promise<Doc | undefined>;
    public updateOne(
      query: { [key: string]: any },
      newData: IDocument
    ): Promise<Doc | undefined>;
    public updateOne(
      query: (value: any, key: string, collection: SqlCollection) => boolean,
      newData: IDocument
    ): Promise<Doc | undefined>;
    public updateOne(
      query: QueryResolvable,
      value?: QueryValue
    ): Promise<Doc | undefined>;

    public upsertOne(
      query: string,
      value: string,
      newData: IDocument
    ): Promise<Doc>;
    public upsertOne(
      query: { [key: string]: any },
      newData: IDocument
    ): Promise<Doc>;
    public upsertOne(
      query: (value: any, key: string, collection: SqlCollection) => boolean,
      newData: IDocument
    ): Promise<Doc>;
    public upsertOne(query: QueryResolvable, value?: QueryValue): Promise<Doc>;
  }
  export class MySql extends EventEmitter {
    constructor(url: any);

    public collections: Collection<string, SqlModel>;
    public url: any;

    public static readonly Types: MySqlTypes;

    public close(): any;
    public open(url: any): Promise<any>;
    public addModel(name: string, options: IMySqlModelOptions): MySql;
    public getCollection(name: string): SqlModel | undefined;
  }
  export class MongoModel extends EventEmitter {
    constructor(db: any, name: string, options?: object, defaults?: object);

    public data: MongoCollection;
    public defaults: object;
    public name: string;
    public options: object;
    public db: any;
    public state: 0 | 1;

    private enqueue(action: () => any): Promise<any>;

    public fetch(): Promise<MongoCollection>;

    public getData(): Promise<MongoCollection>;

    public filterKeys(query: string, value: string): Promise<string[]>;
    public filterKeys(query: { [key: string]: any }): Promise<string[]>;
    public filterKeys(
      query: (value: any, key: string, collection: MongoCollection) => boolean
    ): Promise<string[]>;
    public filterKeys(
      query: QueryResolvable,
      value?: QueryValue
    ): Promise<string[]>;

    public filter(query: string, value: string): Promise<MongoCollection>;
    public filter(query: { [key: string]: any }): Promise<MongoCollection>;
    public filter(
      query: (value: any, key: string, collection: MongoCollection) => boolean
    ): Promise<MongoCollection>;
    public filter(
      query: QueryResolvable,
      value?: QueryValue
    ): Promise<MongoCollection>;

    public findKey(query: string, value: string): Promise<string | undefined>;
    public findKey(query: { [key: string]: any }): Promise<string | undefined>;
    public findKey(
      query: (value: any, key: string, collection: MongoCollection) => boolean
    ): Promise<string | undefined>;
    public findKey(
      query: QueryResolvable,
      value?: QueryValue
    ): Promise<string | undefined>;

    public findOne(query: string, value: string): Promise<Doc | undefined>;
    public findOne(query: { [key: string]: any }): Promise<Doc | undefined>;
    public findOne(
      query: (value: any, key: string, collection: MongoCollection) => boolean
    ): Promise<Doc | undefined>;
    public findOne(
      query: QueryResolvable,
      value?: QueryValue
    ): Promise<Doc | undefined>;

    public getOne(query: string, value: string): Promise<Doc>;
    public getOne(query: { [key: string]: any }): Promise<Doc>;
    public getOne(
      query: (value: any, key: string, collection: MongoCollection) => boolean
    ): Promise<Doc>;
    public getOne(query: QueryResolvable, value?: QueryValue): Promise<Doc>;

    public insertOne(data: IDocument): Doc;

    public insertMany(data: IDocument[]): Doc;

    public deleteOne(query: string, value: string): Promise<Doc | undefined>;
    public deleteOne(query: { [key: string]: any }): Promise<Doc | undefined>;
    public deleteOne(
      query: (value: any, key: string, collection: MongoCollection) => boolean
    ): Promise<Doc | undefined>;
    public deleteOne(
      query: QueryResolvable,
      value?: QueryValue
    ): Promise<Doc | undefined>;

    public deleteMany(query: string, value: string): Promise<Doc[]>;
    public deleteMany(query: { [key: string]: any }): Promise<Doc[]>;
    public deleteMany(
      query: (value: any, key: string, collection: MongoCollection) => boolean
    ): Promise<Doc[]>;
    public deleteMany(
      query: QueryResolvable,
      value?: QueryValue
    ): Promise<Doc[]>;

    public updateOne(
      query: string,
      value: string,
      newData: IDocument
    ): Promise<Doc | undefined>;
    public updateOne(
      query: { [key: string]: any },
      newData: IDocument
    ): Promise<Doc | undefined>;
    public updateOne(
      query: (value: any, key: string, collection: MongoCollection) => boolean,
      newData: IDocument
    ): Promise<Doc | undefined>;
    public updateOne(
      query: QueryResolvable,
      value?: QueryValue
    ): Promise<Doc | undefined>;

    public updateMany(
      query: string,
      value: string,
      newData: IDocument
    ): Promise<Doc[] | undefined>;
    public updateMany(
      query: { [key: string]: any },
      newData: IDocument
    ): Promise<Doc[] | undefined>;
    public updateMany(
      query: (value: any, key: string, collection: MongoCollection) => boolean,
      newData: IDocument
    ): Promise<Doc[] | undefined>;
    public updateMany(
      query: QueryResolvable,
      value?: QueryValue
    ): Promise<Doc[] | undefined>;

    public upsertOne(
      query: string,
      value: string,
      newData: IDocument
    ): Promise<Doc>;
    public upsertOne(
      query: { [key: string]: any },
      newData: IDocument
    ): Promise<Doc>;
    public upsertOne(
      query: (value: any, key: string, collection: MongoCollection) => boolean,
      newData: IDocument
    ): Promise<Doc>;
    public upsertOne(query: QueryResolvable, value?: QueryValue): Promise<Doc>;
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

  export class JsonModel extends EventEmitter {
    public data: Collection<string, Doc>;
    public db: Json;
    public name: string;
    public path: string;
    public defaults: object;

    constructor(db: Json, name: string, path: string, defaults: object);

    public fetch(): Collection<string, Doc>;

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

    public findKey(query: IDocument): string | undefined;
    public findKey(query: string, value: any): string | undefined;
    public findKey(
      query: (value: Doc, key: string, model: JsonModel) => boolean
    ): string | undefined;
    public findKey(
      query: TQueryResolvable,
      value?: TQueryValue
    ): string | undefined;

    public findOne(query: IDocument): Doc | undefined;
    public findOne(query: string, value: any): Doc | undefined;
    public findOne(
      query: (value: Doc, key: string, model: JsonModel) => boolean
    ): Doc | undefined;
    public findOne(
      query: TQueryResolvable,
      value?: TQueryValue
    ): Doc | undefined;

    public getOne(query: IDocument): Doc;
    public getOne(query: string, value: any): Doc;
    public getOne(
      query: (value: Doc, key: string, model: JsonModel) => boolean
    ): Doc;
    public getOne(query: TQueryResolvable, value?: TQueryValue): Doc;

    public insertOne(data: Doc | IDocument): Doc;

    public insertMany(data: Doc[] | IDocument[]): Doc[];

    public deleteOne(query: IDocument): Doc | undefined;
    public deleteOne(query: string, value: any): Doc | undefined;
    public deleteOne(
      query: (value: Doc, key: string, model: JsonModel) => boolean
    ): Doc | undefined;
    public deleteOne(
      query: TQueryResolvable,
      value?: TQueryValue
    ): Doc | undefined;

    public deleteMany(query: IDocument): Doc[];
    public deleteMany(query: string, value: any): Doc[];
    public deleteMany(
      query: (value: Doc, key: string, model: JsonModel) => boolean
    ): Doc[];
    public deleteMany(query: TQueryResolvable, value?: TQueryValue): Doc[];

    public deleteMany(query: IDocument): Doc | undefined;
    public deleteMany(query: string, value: any): Doc | undefined;
    public deleteMany(
      query: (value: Doc, key: string, model: JsonModel) => boolean
    ): Doc | undefined;
    public deleteMany(
      query: TQueryResolvable,
      value?: TQueryValue
    ): Doc | undefined;

    public updateOne(query: IDocument, newData: IDocument): Doc | undefined;
    public updateOne(
      query: string,
      value: any,
      newData: IDocument
    ): Doc | undefined;
    public updateOne(
      query: (value: Doc, key: string, model: JsonModel) => boolean,
      newData: IDocument
    ): Doc | undefined;
    public updateOne(
      query: TQueryResolvable,
      value: TQueryValue,
      newData?: TQueryValue
    ): Doc | undefined;

    public updateMany(query: IDocument, newData: IDocument): Doc | undefined;
    public updateMany(
      query: string,
      value: any,
      newData: IDocument
    ): Doc[] | undefined;
    public updateMany(
      query: (value: Doc, key: string, model: JsonModel) => boolean,
      newData: IDocument
    ): Doc[] | undefined;
    public updateMany(
      query: TQueryResolvable,
      value: TQueryValue,
      newData?: TQueryValue
    ): Doc[] | undefined;

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
  export class Json {
    public path: string;
    public collections: TCollections;
    public savingQueue: Collection<string, IQueueIterator>;

    constructor(dirPath: string);

    public addModel(key: string, modelBody: IModelBody): Json;
    public getCollection(key: string): JsonModel;
    public save(collection?: string): boolean;

    private processQueue(): void;
  }
  export class Store<K> extends Collection<string, K> {
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
    constructor(options?: CoreOptions);

    private _private: {
      folders: IFolderOptions;
      sentPages: Collection<string, Pages>;
      fullpath: string;
      dirpath: string;
    };

    public public: { [key: string]: any };
    public config: { guild: Config };
    public prefix: Prefix;
    public argsSeparator: ArgsSeparator;
    public ignoreCase: boolean;
    public permLevels: PermissionLevels;
    public ignoreBots: boolean;
    public ignoreSelf: boolean;
    public ignorePrefixCase: boolean;
    public db: DB;

    public events: Store<Event>;
    public monitors: Store<Monitor>;
    public commands: Store<Command>;
    public triggers: Store<Trigger>;
    public finalizers: Store<Finalizer>;
    public inhibitors: Store<Inhibitor>;
  }
  class Base {
    constructor(
      client: Core,
      store: Store<any>,
      type: string,
      fullpath: string,
      options?: IBaseOptions
    );

    get options(): IBaseOptions;
    get cOptions(): { [key: string]: any };

    public _id: Id;

    public readonly client: Core;
    public readonly store: Store<any>;
    public custom: { [key: string]: any };
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
      store: Store<Command>,
      fullpath: string,
      options?: ICommandOptions
    );

    get options(): ICommandOptions;
    get cOptions(): { [key: string]: any };

    public noRequiredPermsRun(message: Discord.Message, args: string[]): any;
    public noRequiredRolesRun(message: Discord.Message, args: string[]): any;
    public noPermsRun(message: Discord.Message, args: string[]): any;
    public cdRun(message: Discord.Message, args: string[]): any;
    public run(message: Discord.Message, args: string[]): any;

    _run(message: Discord.Message, args: string[]): Promise<boolean>;

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
      store: Store<Event>,
      fullpath: string,
      options?: IEventOptions
    );

    get options(): IEventOptions;
    get cOptions(): { [key: string]: any };

    private _listener: Function;
    private _options: IEventOptions;

    private _unload(): void;
  }
  export class Inhibitor extends Base {
    constructor(
      client: Core,
      store: Store<Inhibitor>,
      fullpath: string,
      options?: IInhibitorOptions
    );

    private _options: IInhibitorOptions;

    _run(message: Discord.Message, cmd: Command): Promise<boolean>;
  }
  export class Monitor extends Base {
    constructor(
      client: Core,
      store: Store<Monitor>,
      fullpath: string,
      options?: IMonitorOptions
    );

    get options(): IMonitorOptions;
    get cOptions(): { [key: string]: any };

    private _options: IMonitorOptions;
  }
  export class Trigger extends Base {
    constructor(
      client: Core,
      store: Store<Trigger>,
      fullpath: string,
      options?: ITriggerOptions
    );

    get options(): ITriggerOptions;
    get cOptions(): { [key: string]: any };

    _run(message: Discord.Message): Promise<boolean>;

    private _options: ITriggerOptions;
  }
  export class Finalizer extends Base {
    constructor(
      client: Core,
      store: Store<Finalizer>,
      fullpath: string,
      options?: IFinalizerOptions
    );

    get options(): IFinalizerOptions;
    get cOptions(): { [key: string]: any };

    _run(message: Discord.Message): Promise<boolean>;

    private _options: IFinalizerOptions;
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
