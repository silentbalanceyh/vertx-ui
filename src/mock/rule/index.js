import Qr from './db.qr';
import Ux from 'ux';
import moment from 'moment';

const db = openDatabase('DB_ZERO_UI', '1.0', 'UI_MOCK', 2 * 1024 * 1024)
const DDL_VIEW = `CREATE TABLE IF NOT EXISTS VIEW_DATA (
    key, userId,tableName,criteria,projection,
    sigma, language, active, metadata, 
    createdAt, createdBy, updatedAt, updatedBy)`;
const executeError = (tx, err) => {
    console.error(err)
}

const executeData = (input = {}) => {
    input = Ux.clone(input);
    const user = Ux.isLogged();
    const time = moment().toISOString();
    if (!input.createdAt) {
        input.createdBy = user.key;
        input.createdAt = time;
    }
    input.updatedBy = user.key;
    input.updatedAt = time;
    input.language = "cn";
    input.active = true;
    if (!input.key) {
        input.key = Ux.randomUUID();
    }
    return input;
}

const executeValue = (row = {}) => {
    row.active = Boolean(row.active);
    return row;
}

const sqlSort = (sorter = []) => {
    const sql = [];
    sorter.forEach(item => {
        const kv = item.split(',')
        sql.push(kv[0] + " " + kv[1])
    });
    if (0 < sql.length) {
        return "ORDER BY " + sql.join(',');
    } else {
        return "";
    }
}

const sqlPage = (pager = {}) => {
    const {page = 1, size = 10} = pager;
    const start = size * (page - 1)
    return `LIMIT ${start},${size}`;
}

const countAsync = (table, params) => new Promise((resolve, reject) => {
    const qr = new Qr(params);
    const sql = `SELECT COUNT(*) AS counter FROM ${table} WHERE ${qr.sql()}`;
    Ux.dgDebug(sql, "「Mock」Sql", "#52c419")
    db.transaction((tx) => tx.executeSql(sql, [],
        (tx, rs) => {
            const row = rs.rows[0];
            const counter = row.counter;
            resolve(counter);
        },
        executeError)
    )
})

const queryAsync = (table, criteria) => new Promise((resolve, reject) => {
    const qr = new Qr(criteria.criteria);
    const sort = sqlSort(criteria.sorter);
    const page = sqlPage(criteria.pager);
    const sql = `SELECT * FROM ${table} WHERE ${qr.sql()} ${sort} ${page}`;
    Ux.dgDebug(sql, "「Mock」Sql", "#52c419")
    db.transaction((tx) => tx.executeSql(sql, [],
        (tx, rs) => {
            const rows = [];
            for (let idx = 0; idx < rs.rows.length; idx++) {
                const row = rs.rows[idx];
                rows.push(executeValue(row));
            }
            resolve(rows);
        },
        executeError)
    )
})
const createAsync = (table, params) => new Promise((resolve, reject) => {
    const data = executeData(params);
    const stmtField = [];
    const stmtValue = [];
    const args = [];
    Object.keys(data).forEach(key => {
        stmtField.push(key);
        stmtValue.push("?");
        args.push(data[key])
    });
    const sql = `INSERT INTO ${table} (${stmtField.join(",")}) VALUES (${stmtValue.join(",")})`;
    Ux.dgDebug(sql, "「Mock」Sql", "#52c419")
    db.transaction((tx) => tx.executeSql(sql, args,
        (tx, rs) => resolve(data),
        executeError)
    )
})
const queryList = (table, params) => new Promise((resolve, reject) => {
    const qr = new Qr(params);
    const sql = `SELECT * FROM ${table} WHERE ${qr.sql()}`;
    Ux.dgDebug(sql, "「Mock」Sql", "#52c419")
    db.transaction((tx) => tx.executeSql(sql, [],
        (tx, rs) => {
            const rows = [];
            for (let idx = 0; idx < rs.rows.length; idx++) {
                const row = rs.rows[idx];
                rows.push(executeValue(row));
            }
            resolve(rows);
        },
        executeError)
    )
})

export default {
    init: (ddl) => new Promise((resolve, reject) => {
        db.transaction((tx) => tx.executeSql(ddl))
        resolve(true);
    }),
    get: (table, key) => new Promise((resolve, reject) => {
        const sql = `SELECT * FROM ${table} WHERE key='${key}'`;
        Ux.dgDebug(sql, "「Mock」Sql", "#52c419");
        db.transaction((tx) => tx.executeSql(sql, [],
            (tx, rs) => {
                resolve(executeValue(rs.rows[0]));
            },
            executeError)
        )
    }),
    remove: (table, key) => new Promise((resolve, reject) => {
        const sql = `DELETE FROM ${table} WHERE key='${key}'`;
        Ux.dgDebug(sql, "「Mock」Sql", "#52c419");
        db.transaction((tx) => tx.executeSql(sql, [],
            (tx, rs) => {
                resolve(true);
            },
            executeError)
        )
    }),
    search: (table, params) => new Promise((resolve, reject) => {
        const q = queryAsync(table, params);
        const c = countAsync(table, params.criteria);
        Ux.parallel([q, c]).then((response = {}) => {
            const [list, count] = response;
            resolve({list, count});
        })
    }),
    existing: (table, params) => countAsync(table, params)
        .then(counter => Ux.promise(0 < counter)),
    all: (table) => {
        const user = Ux.isLogged();
        return queryList(table, {sigma: user.sigma});
    },
    viewSave: (table, params) => new Promise((resolve, reject) => {
        const user = Ux.isLogged();
        const where = `SELECT * FROM VIEW_DATA WHERE tableName='${table}' AND userId='${user.key}'`;
        db.transaction((tx) => tx.executeSql(DDL_VIEW, [], (itx, view) => {
            itx.executeSql(where, [], (iitx, res) => {
                const item = res.rows[0];
                if (item) {
                    console.log(item);
                } else {
                    const record = {};
                    record.userId = user.key;
                    record.tableName = table;
                    const {viewData = {}} = params;
                    if (viewData.projection) {
                        record.projection = JSON.stringify(viewData.projection);
                    }
                    createAsync("VIEW_DATA", record).then(res => resolve(res));
                }
            }, executeError)
        }, executeError))
    }),
    create: (table, params) => createAsync(table, params),
    update: (table, key, params) => new Promise((resolve, reject) => {
        const data = executeData(params);
        const stmtField = [];
        const args = [];
        Object.keys(data).filter(key => 'key' !== key).forEach(key => {
            stmtField.push(key + ' = ?');
            args.push(data[key])
        });
        args.push(key);
        const sql = `UPDATE ${table} SET ${stmtField.join(',')} WHERE key = ?`;
        Ux.dgDebug(sql, "「Mock」Sql", "#52c419")
        db.transaction((tx) => tx.executeSql(sql, args,
            (tx, rs) => resolve(data),
            executeError)
        )
    }),
}