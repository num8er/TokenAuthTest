'use strict';

const config = require('../config');
const mongoose = require('mongoose');
const dbVersion = config.get('db:version');

mongoose.Promise = Promise;

class ModelInstances {
  constructor () {
    this._instances = {};
  }

  set (name, instance) {
    this._instances[name] = instance;
  }

  get (name) {
    if (!this._instances[name]) {
      throw new Error('Model instance "' + name + '" not found');
    }
    return this._instances[name];
  }
}

class MongoDBConnectionFactory {
  static get connectionString () {
    const credentials = config.get('db:pass')
      ? config.get('db:user') + ':' + config.get('db:pass') + '@' : '';
    return config.get('db:protocol') +
            '://' + credentials + config.get('db:host') +
            '/' + config.get('db:name');
  }

  static createConnection (onConnect, onError) {
    try {
      const params = {
        useMongoClient: true,
        reconnectTries: (config.get('db:reconnectTries') === 'max') ? Number.MAX_VALUE : config.get('db:reconnectTries'),
        reconnectInterval: 1000,
        haInterval: 3000,
        poolSize: 5
      };
      mongoose
        .connect(this.connectionString, params)
        .then(() => {
          console.log('Connection to database established');
          if (onConnect) onConnect();
        })
        .catch(error => {
          console.error(error);
          if (onError) onError(error);
          process.exit(-1);
        });
      mongoose.set('autoIndex', true);
      mongoose.set('debug', config.get('db:debug'));
      return mongoose.connection;
    } catch (error) {
      throw new Error(error);
    }
  }
}

class TestMongoDBConnectionFactory extends MongoDBConnectionFactory {}

class Database {
  constructor (connectionFactory, env) {
    this._connectionFactory = connectionFactory;
    this._connection = null;
    this._schemas = [];
    this._modelInstances = new ModelInstances();
  }

  connect (onConnect, onError) {
    if (!this._connection) {
      this._connection = this._connectionFactory.createConnection(onConnect, onError);
    }
    return this;
  }

  get connectionString () {
    return this._connectionFactory.connectionString;
  }

  setSchemas (schemas) {
    this._schemas = schemas;
  }

  get defaultSchemaParams () {
    return {};
  }

  initModels () {
    for (const name in this._schemas) {
      const schema = this._schemas[name];
      const modelInstance = mongoose.model(
        name,
        new mongoose.Schema(schema.fields, Object.assign(this.defaultSchemaParams, schema.params))
      );
      this._modelInstances.set(name, modelInstance);
    }
    return this;
  }

  model (name) {
    return this._modelInstances.get(name);
  }
}

const schemas = dbVersion ? `./schemas/${dbVersion}` : './schemas';
const
  ConnectionFactory = (config.get('env') === 'test')
    ? TestMongoDBConnectionFactory : MongoDBConnectionFactory;

const
  db = new Database(ConnectionFactory);
db.setSchemas(require(schemas));
db.initModels();

module.exports = db;
