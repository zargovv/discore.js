class Model<T> {}

export = class DB {
  public collections: Map<string, Model<any>> = new Map()

  constructor() {}
}
