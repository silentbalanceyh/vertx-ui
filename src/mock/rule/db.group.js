import db from './db';

const TABLE = "S_GROUP"
const DDL = `CREATE TABLE IF NOT EXISTS ${TABLE} ` +
    `(  key unique, name, code unique, 
        parentId, modelId, modelKey, category, 
        sigma, language, active, metadata, 
        createdAt, createdBy, updatedAt, updatedBy )`
export default {
    existing: (params) => db.init(DDL)
        .then(() => db.existing(TABLE, params)),
    create: (params) => db.init(DDL)
        .then(() => db.create(TABLE, params)),
    search: (params) => db.init(DDL)
        .then(() => db.search(TABLE, params))
}