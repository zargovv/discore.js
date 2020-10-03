import mongoose from 'mongoose'
import { EventEmitter } from 'events'

import JSON from './Json'
import Mongo from './Mongo'
import MySql from './MySql'

type DB = Mongo | MySql | JSON

export = class DBProvider<T extends DB> extends EventEmitter {
  public connection: mongoose.Connection = mongoose.connection
  private _db?: T

  constructor() {
    super()
  }

  public get db(): T {
    return this._db
  }

  public set db(value: T) {
    this._db = value
    this.db
    this.emit('provide', this.db)
  }
}
