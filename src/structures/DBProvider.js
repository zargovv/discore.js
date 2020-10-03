"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const mongoose_1 = __importDefault(require("mongoose"));
const events_1 = require("events");
module.exports = class DBProvider extends events_1.EventEmitter {
    constructor() {
        super();
        this.connection = mongoose_1.default.connection;
    }
    get db() {
        return this._db;
    }
    set db(value) {
        this._db = value;
        this.db;
        this.emit('provide', this.db);
    }
};
