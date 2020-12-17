import { Db } from 'mongodb';

/**
 * Get the ID for the new user
 * @param database Current db we're working on
 * @param collection Collection to find the lastElement
 * @param sort Sorting option { property: -1 } Descending
 */

export const assignDocumentId = async(database: Db, collection: string, sort: object = { registerDate: -1 }) => {
  
  const lastElement = await database.collection(collection).find().limit(1).sort(sort).toArray();
  if (lastElement.length === 0) {
    return 1;
  } else {
    return lastElement[0].id + 1;
  }

};

export const findOneElement = async(database: Db, collection: string, filter: object) => {
  
  return database.collection(collection).findOne(filter);

};

export const insertOneElement = async(database: Db, collection: string, document: object) => {
  return await database.collection(collection).insertOne(document);
};

export const insertManyElements = async(database: Db, collection: string, documents: Array<object>) => {
  return await database.collection(collection).insertMany(documents);
};

export const findElement = async(database: Db, collection: string, filter: object = {}) => {
  return await database.collection(collection).find(filter).toArray();
};