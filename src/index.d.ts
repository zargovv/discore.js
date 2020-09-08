declare module 'discore.js' {
  import {
    Client as DiscordClient,
    Collection,
    Message,
    Channel,
    MessageReaction,
    User,
    MessageEmbed as Embed
  } from 'discord.js'
  import * as Discord from 'discord.js'
  import { EventEmitter } from 'events'

  export type Aliases = string | string[]
  export type QueryKey = any
  export type QueryResolvable =
    | { [key: number]: any }
    | { [key: string]: any }
    | ((key: any, value: any) => boolean)
    | QueryKey
  export type QueryValue = any
  export type Id = any
  export type Level = number
  export type Prefix = string | RegExp | (RegExp | string)[]
  export type DB = Mongo | MySql | Json
  export type ArgsSeparator = string | RegExp
  export type PageResolvable = any
  export type SqlCollection = Collection<string, Document>
  export type MongoCollection = Collection<string, Document>
  export type Cooldowns = Collection<string, number>
  export type CommandMessage = Message & { cmd: string }
  export type PartialCommandMessage = Message & { cmd?: string }

  export interface MySqlTypes {
    Double: any
    Boolean: any
    Date: any
    Char: any
    VarChar: any
    TinyText: any
    Text: any
    Blob: any
    MediumText: any
    LongText: any
    LongBlob: any
    TinyInt: any
    SmallInt: any
    MediumInt: any
    Int: any
    BigInt: any
    Float: any
    Decimal: any
    DateTime: any
    Timestamp: any
    Time: any
    Enum: any
    Set: any
  }
  export interface MongoTypes {
    Number: any
    Double: any
    String: any
    Object: any
    Array: any
    ObjectId: any
    Boolean: any
    Date: any
    RegExp: any
  }
  export interface IMongoModelOptions {
    [key: string]: { type: any; default: any }
  }
  export interface IMySqlModelOptions {
    [key: string]: { type: any; default: any }
  }
  export interface IConfigAddOptions {
    prefix?: Prefix
  }
  export interface IFolderOptions {
    inhibitors?: string
    finalizers?: string
    commands?: string
    monitors?: string
    triggers?: string
    events?: string
  }
  export interface IPrefixOptions {
    spaceSeparator?: boolean
    ignoreCase?: boolean
    mention?: boolean
  }
  export interface ICommandConfig {
    argsSeparator?: string | RegExp
    permLevels?: PermissionLevels
    ignoreCase?: boolean
    ignoreBots?: boolean
    ignoreSelf?: boolean
  }
  export interface IConfigOptions extends IConfigAddOptions {
    mentionPrefix?: boolean
    ignoreBots?: boolean
    ignoreSelf?: boolean
    argsSeparator?: string | RegExp
    spaceSeparator?: boolean
    ignoreCase?: boolean
    prefix?: (string | RegExp)[]
  }
  export interface ICoreOptions {
    prefixOptions?: IPrefixOptions
    commandOptions?: ICommandConfig
    mainPath?: string
    folders?: IFolderOptions
    mobile?: boolean
    token?: string
    prefix?: (string | RegExp)[]
    db?: DB
  }
  export interface CoreOptions {
    prefixOptions?: IPrefixOptions
    commandOptions?: ICommandConfig
    mainPath?: string
    folders?: IFolderOptions
    mobile?: boolean
    token?: string
    prefix?: string | RegExp | (string | RegExp)[]
    db?: DB
  }
  export interface IBaseOptions {
    enabled?: boolean
    key?: any
    name?: any
    id?: any
    once?: boolean
  }
  export interface ICommandOptions extends IBaseOptions {
    runIn?: string | string[]
    aliases?: Aliases
    cooldown?: number
    permLevel?: number
    requiredPerms?: number | string | Array<string | number>
    requiredRoles?: string | string[]
  }
  export interface IEventOptions extends IBaseOptions {}
  export interface IInhibitorOptions extends IBaseOptions {}
  export interface IMonitorOptions extends IBaseOptions {}
  export interface ITriggerOptions extends IBaseOptions {}
  export interface IFinalizerOptions extends IBaseOptions {}

  export interface IPagesOptions {
    filter?(reaction: MessageReaction, user: User): boolean
    prevPage?: string
    nextPage?: string
  }

  export interface IDocument {
    [key: string]: any
  }
  export class Document implements IDocument {
    [key: string]: any
    private _model: JsonModel | SqlModel | MongoModel

    public save(): Promise<Document>
    public populate(keys: string[], remove?: boolean): Document
    public json(): object
  }

  type TCollections = Collection<string, JsonModel>
  type TQueryKey = any
  type TQueryValue = any
  type TQueryResolvable =
    | { [key: number]: any }
    | { [key: string]: any }
    | ((key: any, value: any) => boolean)
    | TQueryKey

  interface IModelBody {
    [key: string]: any
  }
  interface IQueueIterator {
    path: string
    data: string
  }

  export class SqlModel<
    T extends Document = Document,
    D = { [K in keyof T]: T[K] } & { [key: string]: any }
  > extends EventEmitter {
    constructor(db: any, name: string, options?: object, defaults?: object)

    public db: any
    public defaults: object
    public name: string
    public options: object
    public data: SqlCollection
    public state: 0 | 1

    private enqueue(action: () => any): Promise<any>

    public fetch(): Promise<SqlCollection>

    public getData(): Promise<SqlCollection>

    public filterKeys(query: string, value: string): Promise<string[]>
    public filterKeys(query: { [key: string]: any }): Promise<string[]>
    public filterKeys(
      query: (value: any, key: string, collection: SqlCollection) => boolean
    ): Promise<string[]>
    public filterKeys(
      query: QueryResolvable,
      value?: QueryValue
    ): Promise<string[]>

    public filter(query: string, value: string): Promise<SqlCollection>
    public filter(query: { [key: string]: any }): Promise<SqlCollection>
    public filter(
      query: (value: any, key: string, collection: SqlCollection) => boolean
    ): Promise<SqlCollection>
    public filter(
      query: QueryResolvable,
      value?: QueryValue
    ): Promise<SqlCollection>

    public findKey(query: string, value: string): Promise<string | undefined>
    public findKey(query: { [key: string]: any }): Promise<string | undefined>
    public findKey(
      query: (value: any, key: string, collection: SqlCollection) => boolean
    ): Promise<string | undefined>
    public findKey(
      query: QueryResolvable,
      value?: QueryValue
    ): Promise<string | undefined>

    public findOne(query: string, value: string): Promise<T | undefined>
    public findOne(query: { [key: string]: any }): Promise<T | undefined>
    public findOne(
      query: (value: any, key: string, collection: SqlCollection) => boolean
    ): Promise<T | undefined>
    public findOne(
      query: QueryResolvable,
      value?: QueryValue
    ): Promise<T | undefined>

    public getOne(query: string, value: string): Promise<T>
    public getOne(query: { [key: string]: any }): Promise<T>
    public getOne(
      query: (value: any, key: string, collection: SqlCollection) => boolean
    ): Promise<T>
    public getOne(query: QueryResolvable, value?: QueryValue): Promise<T>

    public insertOne(data: D): T

    public insertMany(data: D[]): T

    public deleteOne(query: string, value: string): Promise<T | undefined>
    public deleteOne(query: D): Promise<T | undefined>
    public deleteOne(
      query: (value: any, key: string, collection: SqlCollection) => boolean
    ): Promise<T | undefined>
    public deleteOne(
      query: QueryResolvable,
      value?: QueryValue
    ): Promise<T | undefined>

    public deleteMany(query: string, value: string): Promise<T[]>
    public deleteMany(query: D): Promise<T[]>
    public deleteMany(
      query: (value: any, key: string, collection: SqlCollection) => boolean
    ): Promise<T[]>
    public deleteMany(query: QueryResolvable, value?: QueryValue): Promise<T[]>

    public updateOne(
      query: string,
      value: string,
      newData: D
    ): Promise<T | undefined>
    public updateOne(query: D, newData: D): Promise<T | undefined>
    public updateOne(
      query: (value: any, key: string, collection: SqlCollection) => boolean,
      newData: D
    ): Promise<T | undefined>
    public updateOne(
      query: QueryResolvable,
      value?: QueryValue
    ): Promise<T | undefined>

    public upsertOne(query: string, value: string, newData: D): Promise<T>
    public upsertOne(query: D, newData: D): Promise<T>
    public upsertOne(
      query: (value: any, key: string, collection: SqlCollection) => boolean,
      newData: D
    ): Promise<T>
    public upsertOne(query: QueryResolvable, value?: QueryValue): Promise<T>
  }
  export class MySql extends EventEmitter {
    constructor(url: any)

    public collections: Collection<string, SqlModel>
    public url: any

    public static readonly Types: MySqlTypes

    public close(): any
    public open(url: any): Promise<any>
    public addModel(name: string, options: IMySqlModelOptions): MySql
    public getCollection(name: string): SqlModel | undefined
  }
  export class MongoModel<
    T extends Document = Document,
    D = { [K in keyof T]: T[K] } & { [key: string]: any }
  > extends EventEmitter {
    constructor(db: any, name: string, options?: object, defaults?: object)

    public data: MongoCollection
    public defaults: object
    public name: string
    public options: object
    public db: any
    public state: 0 | 1

    private enqueue(action: () => any): Promise<any>

    public fetch(): Promise<MongoCollection>

    public getData(): Promise<MongoCollection>

    public filterKeys(query: string, value: string): Promise<string[]>
    public filterKeys(query: D): Promise<string[]>
    public filterKeys(
      query: (value: any, key: string, collection: MongoCollection) => boolean
    ): Promise<string[]>
    public filterKeys(
      query: QueryResolvable,
      value?: QueryValue
    ): Promise<string[]>

    public filter(query: string, value: string): Promise<MongoCollection>
    public filter(query: D): Promise<MongoCollection>
    public filter(
      query: (value: any, key: string, collection: MongoCollection) => boolean
    ): Promise<MongoCollection>
    public filter(
      query: QueryResolvable,
      value?: QueryValue
    ): Promise<MongoCollection>

    public findKey(query: string, value: string): Promise<string | undefined>
    public findKey(query: D): Promise<string | undefined>
    public findKey(
      query: (value: any, key: string, collection: MongoCollection) => boolean
    ): Promise<string | undefined>
    public findKey(
      query: QueryResolvable,
      value?: QueryValue
    ): Promise<string | undefined>

    public findOne(query: string, value: string): Promise<T | undefined>
    public findOne(query: D): Promise<T | undefined>
    public findOne(
      query: (value: any, key: string, collection: MongoCollection) => boolean
    ): Promise<T | undefined>
    public findOne(
      query: QueryResolvable,
      value?: QueryValue
    ): Promise<T | undefined>

    public getOne(query: string, value: string): Promise<T>
    public getOne(query: D): Promise<T>
    public getOne(
      query: (value: any, key: string, collection: MongoCollection) => boolean
    ): Promise<T>
    public getOne(query: QueryResolvable, value?: QueryValue): Promise<T>

    public insertOne(data: D): T

    public insertMany(data: D[]): T

    public deleteOne(query: string, value: string): Promise<T | undefined>
    public deleteOne(query: { [key: string]: any }): Promise<T | undefined>
    public deleteOne(
      query: (value: any, key: string, collection: MongoCollection) => boolean
    ): Promise<T | undefined>
    public deleteOne(
      query: QueryResolvable,
      value?: QueryValue
    ): Promise<T | undefined>

    public deleteMany(query: string, value: string): Promise<T[]>
    public deleteMany(query: D): Promise<T[]>
    public deleteMany(
      query: (value: any, key: string, collection: MongoCollection) => boolean
    ): Promise<T[]>
    public deleteMany(query: QueryResolvable, value?: QueryValue): Promise<T[]>

    public updateOne(
      query: string,
      value: string,
      newData: D
    ): Promise<T | undefined>
    public updateOne(query: D, newData: D): Promise<T | undefined>
    public updateOne(
      query: (value: any, key: string, collection: MongoCollection) => boolean,
      newData: D
    ): Promise<T | undefined>
    public updateOne(
      query: QueryResolvable,
      value?: QueryValue
    ): Promise<T | undefined>

    public updateMany(
      query: string,
      value: string,
      newData: D
    ): Promise<T[] | undefined>
    public updateMany(query: D, newData: D): Promise<T[] | undefined>
    public updateMany(
      query: (value: any, key: string, collection: MongoCollection) => boolean,
      newData: D
    ): Promise<T[] | undefined>
    public updateMany(
      query: QueryResolvable,
      value?: QueryValue
    ): Promise<T[] | undefined>

    public upsertOne(query: string, value: string, newData: D): Promise<T>
    public upsertOne(query: D, newData: D): Promise<T>
    public upsertOne(
      query: (value: any, key: string, collection: MongoCollection) => boolean,
      newData: D
    ): Promise<T>
    public upsertOne(query: QueryResolvable, value?: QueryValue): Promise<T>
  }
  export class Mongo {
    constructor(url: string, options?: object)

    public collections: Collection<string, MongoModel>
    public connection: any
    public url: string
    public defaultOptions: object
    public options: object

    public static readonly Types: MongoTypes

    public close(): any
    public open(url?: string, options?: object): any
    public addModel(name: string, options?: IMongoModelOptions): Mongo
    public getCollection(name: string): MongoModel | undefined
  }

  export class JsonModel<
    T extends Document = Document,
    D = { [K in keyof T]: T[K] } & { [key: string]: any }
  > extends EventEmitter {
    public data: Collection<string, T>
    public db: Json
    public name: string
    public path: string
    public defaults: object

    constructor(db: Json, name: string, path: string, defaults: object)

    public fetch(): Collection<string, T>

    public save(): void

    public filterKeys(query: D): string[]
    public filterKeys(query: string, value: any): string[]
    public filterKeys(
      query: (value: T, key: string, model: JsonModel<T>) => boolean
    ): string[]
    public filterKeys(query: TQueryResolvable, value?: TQueryValue): string[]

    public filter(query: D): T[]
    public filter(query: string, value: any): T[]
    public filter(
      query: (value: T, key: string, model: JsonModel<T>) => boolean
    ): T[]
    public filter(query: TQueryResolvable, value?: TQueryValue): T[]

    public findKey(query: D): string | undefined
    public findKey(query: string, value: any): string | undefined
    public findKey(
      query: (value: T, key: string, model: JsonModel<T>) => boolean
    ): string | undefined
    public findKey(
      query: TQueryResolvable,
      value?: TQueryValue
    ): string | undefined

    public findOne(query: D): T | undefined
    public findOne(query: string, value: any): T | undefined
    public findOne(
      query: (value: T, key: string, model: JsonModel<T>) => boolean
    ): T | undefined
    public findOne(query: TQueryResolvable, value?: TQueryValue): T | undefined

    public getOne(query: D): T
    public getOne(query: string, value: any): T
    public getOne(
      query: (value: T, key: string, model: JsonModel<T>) => boolean
    ): T
    public getOne(query: TQueryResolvable, value?: TQueryValue): T

    public insertOne(data: T | D): T

    public insertMany(data: T[] | D[]): T[]

    public deleteOne(query: D): T | undefined
    public deleteOne(query: string, value: any): T | undefined
    public deleteOne(
      query: (value: T, key: string, model: JsonModel<T>) => boolean
    ): T | undefined
    public deleteOne(
      query: TQueryResolvable,
      value?: TQueryValue
    ): T | undefined

    public deleteMany(query: D): T[]
    public deleteMany(query: string, value: any): T[]
    public deleteMany(
      query: (value: T, key: string, model: JsonModel<T>) => boolean
    ): T[]
    public deleteMany(query: TQueryResolvable, value?: TQueryValue): T[]

    public deleteMany(query: D): T | undefined
    public deleteMany(query: string, value: any): T | undefined
    public deleteMany(
      query: (value: T, key: string, model: JsonModel<T>) => boolean
    ): T | undefined
    public deleteMany(
      query: TQueryResolvable,
      value?: TQueryValue
    ): T | undefined

    public updateOne(query: D, newData: D): T | undefined
    public updateOne(query: string, value: any, newData: D): T | undefined
    public updateOne(
      query: (value: T, key: string, model: JsonModel<T>) => boolean,
      newData: D
    ): T | undefined
    public updateOne(
      query: TQueryResolvable,
      value: TQueryValue,
      newData?: TQueryValue
    ): T | undefined

    public updateMany(query: D, newData: D): T | undefined
    public updateMany(query: string, value: any, newData: D): T[] | undefined
    public updateMany(
      query: (value: T, key: string, model: JsonModel<T>) => boolean,
      newData: D
    ): T[] | undefined
    public updateMany(
      query: TQueryResolvable,
      value: TQueryValue,
      newData?: TQueryValue
    ): T[] | undefined

    public upsertOne(query: D, newData: D): T
    public upsertOne(query: string, value: any, newData: D): T
    public upsertOne(
      query: (value: T, key: string, model: JsonModel<T>) => boolean,
      newData: D
    ): T
    public upsertOne(
      query: TQueryResolvable,
      value: TQueryValue,
      newData?: TQueryValue
    ): T
  }
  export class Json {
    public path: string
    public collections: TCollections
    public savingQueue: Collection<string, IQueueIterator>

    constructor(dirPath: string)

    public addModel(key: string, modelBody: IModelBody): Json
    public getCollection(key: string): JsonModel
    public save(collection?: string): boolean

    private processQueue(): void
  }
  export class Store<K> extends Collection<string, K> {
    constructor(client: Core, type: string, defaults?: string)

    public search(query: string): any[]
    public get(key: any): any
    public load(fileath: string): this
    public init(filepath: string, foldername: string, onlyfile?: string): this
  }
  class Config extends Collection<string, object> {
    constructor(client: Core, defaults: ICoreOptions)

    public set(key: string, value: IConfigOptions): any
    public add(key: string, value: IConfigAddOptions): any
    public get(key: string): IConfigOptions
  }
  export class PermissionLevels {
    constructor()

    private _id: Level
    public readonly length: number

    public addLevel(level: Level, brk: boolean, fn: Function): PermissionLevels
    public add(level: Level, brk: boolean, fn: Function): PermissionLevels
    public test(
      level: Level,
      message: PartialCommandMessage,
      client: Core
    ): Promise<boolean>

    private _getId(): Level
    private _test(
      level: Level,
      message: PartialCommandMessage,
      client: Core
    ): Promise<boolean>
  }
  export class UniqueId {
    public static readonly index: number
    public id?: String

    constructor()

    public static randomBytes(size: number): Uint8Array
    public static getInc(): number
    public static generate(time?: number): Buffer
    public toString(): String
  }
  export class Core extends DiscordClient {
    constructor(options?: CoreOptions)

    private _private: {
      folders: IFolderOptions
      sentPages: Collection<string, Pages>
      fullpath: string
      dirpath: string
    }

    public public: { [key: string]: any }
    public config: { guild: Config }
    public prefix: Prefix
    public argsSeparator: ArgsSeparator
    public ignoreCase: boolean
    public permLevels: PermissionLevels
    public ignoreBots: boolean
    public ignoreSelf: boolean
    public ignorePrefixCase: boolean
    public db: DB

    public events: Store<Event>
    public monitors: Store<Monitor>
    public commands: Store<Command>
    public triggers: Store<Trigger>
    public finalizers: Store<Finalizer>
    public inhibitors: Store<Inhibitor>
  }
  class Base {
    constructor(
      client: Core,
      store: Store<any>,
      type: string,
      fullpath: string,
      options?: IBaseOptions
    )

    get options(): IBaseOptions
    get cOptions(): { [key: string]: any }

    public _id: Id

    public readonly client: Core
    public readonly store: Store<any>
    public custom: { [key: string]: any }
    public id: any
    public dir: string
    public file: string
    public type: string
    public enabled: boolean
    public once: boolean
    public key: any
    public name: any
    public categories: string[]

    public toggle(): Base
    public unload(emit: boolean): Base
    public reload(): Base
    public disable(): Base
    public enable(): Base
    public toString(): string
  }
  export class Command extends Base {
    constructor(
      client: Core,
      store: Store<Command>,
      fullpath: string,
      options?: ICommandOptions
    )

    get options(): ICommandOptions
    get cOptions(): { [key: string]: any }

    public noRequiredPermsRun(message: CommandMessage, args: string[]): any
    public noRequiredRolesRun(message: CommandMessage, args: string[]): any
    public noPermsRun(message: CommandMessage, args: string[]): any
    public cdRun(message: CommandMessage, args: string[]): any
    public run(message: CommandMessage, args: string[]): any

    _run(message: CommandMessage, args: string[]): Promise<boolean>

    private _options: ICommandOptions

    public cooldown: number
    public aliases: Aliases
    public permLevel: number
    public description: any
    public usage: any
    public cooldowns: Cooldowns

    public resetCooldowns(...ids: string[]): Cooldowns
  }
  export class Event extends Base {
    constructor(
      client: Core,
      store: Store<Event>,
      fullpath: string,
      options?: IEventOptions
    )

    get options(): IEventOptions
    get cOptions(): { [key: string]: any }

    private _listener: Function
    private _options: IEventOptions

    private _unload(): void
  }
  export class Inhibitor extends Base {
    constructor(
      client: Core,
      store: Store<Inhibitor>,
      fullpath: string,
      options?: IInhibitorOptions
    )

    private _options: IInhibitorOptions

    _run(message: CommandMessage, cmd: Command): Promise<boolean>
  }
  export class Monitor extends Base {
    constructor(
      client: Core,
      store: Store<Monitor>,
      fullpath: string,
      options?: IMonitorOptions
    )

    get options(): IMonitorOptions
    get cOptions(): { [key: string]: any }

    private _options: IMonitorOptions
  }
  export class Trigger extends Base {
    constructor(
      client: Core,
      store: Store<Trigger>,
      fullpath: string,
      options?: ITriggerOptions
    )

    get options(): ITriggerOptions
    get cOptions(): { [key: string]: any }

    _run(message: PartialCommandMessage): Promise<boolean>

    private _options: ITriggerOptions
  }
  export class Finalizer extends Base {
    constructor(
      client: Core,
      store: Store<Finalizer>,
      fullpath: string,
      options?: IFinalizerOptions
    )

    get options(): IFinalizerOptions
    get cOptions(): { [key: string]: any }

    _run(message: CommandMessage, res: any, enabled: boolean): Promise<boolean>

    private _options: IFinalizerOptions
  }
  export class Pages {
    constructor(client: Core, options: IPagesOptions)

    public readonly client: Core
    public options: IPagesOptions
    public emojis: { prevPage: string; nextPage: string }
    public pages: PageResolvable[]
    public filter: (reaction: MessageReaction, user: User) => boolean

    public addPage(msg: PageResolvable): Pages
    public add(...msgs: PageResolvable[]): Pages
    public send(channel: Channel): Promise<Message>
  }
  export { Discord, Embed }
}
