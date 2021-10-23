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

const executeView = (params = {}, table) => {
    const user = Ux.isLogged();
    const record = {};
    record.userId = user.key;
    record.tableName = table;
    const {viewData = {}} = params;
    if (viewData.projection) {
        record.projection = JSON.stringify(viewData.projection);
    }
    if (viewData.criteria) {
        record.criteria = JSON.stringify(viewData.criteria);
    }
    return record;
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
const queryView = (table, params) => new Promise((resolve, reject) => {
    const user = Ux.isLogged();
    const where = `SELECT * FROM VIEW_DATA WHERE tableName='${table}' AND userId='${user.key}'`;
    db.transaction((tx) => tx.executeSql(DDL_VIEW, [], (itx, view) => {
        itx.executeSql(where, [], (iitx, res) => {
            const item = res.rows[0];
            resolve(item ? item : {})
        }, executeError)
    }, executeError))
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
const updateAsync = (table, key, params) => new Promise((resolve, reject) => {
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
});
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
        // 先读取
        queryView(table).then(qr => {
            let criteria;
            try {
                criteria = JSON.parse(qr.criteria ? qr.criteria : {});
            } catch (error) {
                criteria = null;
            }
            const condition = {};
            if (criteria) {
                condition[""] = true;
                condition["$0"] = params.criteria;
                condition["$1"] = criteria;
            } else {
                Object.assign(condition, params.criteria);
            }
            const q = queryAsync(table, {...params, criteria: condition});
            const c = countAsync(table, condition);
            Ux.parallel([q, c]).then((response = {}) => {
                const [list, count] = response;
                // View Processing
                const data = {list, count};
                if (criteria) {
                    data.__qr = criteria;
                }
                resolve(data);
            })
        });
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
                    const request = executeView(params, table);
                    const updatedData = Object.assign(item, request);
                    updateAsync('VIEW_DATA', updatedData.key, updatedData)
                        .then(res => {
                            if (res.projection) {
                                res.projection = JSON.parse(res.projection);
                            }
                            if (res.criteria) {
                                res.criteria = JSON.parse(res.criteria);
                            }
                            resolve(res);
                        });
                } else {
                    const request = executeView(params, table);
                    createAsync("VIEW_DATA", request)
                        .then(res => resolve(res));
                }
            }, executeError)
        }, executeError))
    }),
    viewMy: (table, params) => queryView(table).then(view => {
        let result;
        try {
            result = (JSON.parse(view.projection ? view.projection : "[]"));
        } catch (err) {
            result = []
        }
        return Ux.promise(result);
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