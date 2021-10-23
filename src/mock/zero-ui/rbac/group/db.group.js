import db from '../../../rule/';

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
        .then(() => db.search(TABLE, params)),
    get: (params) => db.init(DDL)
        .then(() => db.get(TABLE, params.key)),
    remove: (params) => db.init(DDL)
        .then(() => db.remove(TABLE, params.key)),
    update: (params) => db.init(DDL)
        .then(() => db.update(TABLE, params.key, params)),
    all: () => db.init(DDL)
        .then(() => db.all(TABLE)),
    viewSave: (params) => db.viewSave(TABLE, params)
}