const { MongoClient, ObjectId } = require("mongodb");
const config = require("../config");

const USER = encodeURIComponent(config.dbUser);
const PASWORD = encodeURIComponent(config.dbPassword);
const DB_NAME = encodeURIComponent(config.dbName);
const DB_HOST = encodeURIComponent(config.dbHost);

const MONGO_URI = `mongodb+srv://${USER}:${PASWORD}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`;


class MongoLib {
  constructor() {
    this.client = new MongoClient(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    this.dbName = DB_NAME;
  }

  async connect() {
    try {
      await this.client.connect()
      console.log('Connected successfully to mongo')
      return this.client.db(this.dbName)
    } catch (error) {
      console.log(error)
    }
  }

  async getAll(collection, query) {
    try {      
      const db = await this.connect()
      return await db.collection(collection).find(query).toArray()
    } catch (error) {
      console.log(error)
    }
  }

  async get(collection, id) {
    try {      
      const db = await this.connect()
      return await db.collection(collection).findOne({ _id: ObjectId(id)})
    } catch (error) {
      console.log(error)
    }
  }

  async create(collection, data) {
    try {      
      const db = await this.connect()
      const result = await db.collection(collection).insertOne(data)
      return result.insertedId
    } catch (error) {
      console.log(error)
    }
  }

  async update(collection, id, data) {
    try {      
      const db = await this.connect()
      const result = await db.collection(collection).updateOne({ _id: ObjectId(id)}, { $set: data}, { upsert: true})
      return result.upsertedId || id
    } catch (error) {
      console.log(error)
    }
  }

  async delete(collection, id) {
    try {      
      const db = await this.connect()
      const result = await db.collection(collection).deleteOne({ _id: ObjectId(id) })
      return result.id || id
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = MongoLib
