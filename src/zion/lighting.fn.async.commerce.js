import __VERIFY from './verify.fn.valve.validator';
import __Zn from './zero.module.dependency';
import {DataArray} from 'zme';
import Schema from 'async-validator';

const asyncValidate = (config = {}, params = {}, reference) => {
    const descriptor = {};
    Object.keys(config).forEach(field => {
        const rules = config[field];
        if (__Zn.isArray(rules)) {
            descriptor[field] = __VERIFY.valveValidator(reference, rules, {});
        }
    })
    if (__Zn.isNotEmpty(descriptor)) {
        // async-validator验证
        const validator = new Schema(descriptor);
        return new Promise((resolve, reject) => {
            validator.validate(params)
                .then(resolve).catch(({errors}) => {
                if (errors && 0 < errors.length) {
                    const validated = {};
                    validated.errors = __Zn.clone(errors);
                    validated.failure = true;
                    const error = errors[0];
                    validated.data = error ? error.message : "";
                    __Zn.dgDebug(validated, "验证失败！", "#CD2626");
                    reject(validated);
                } else {
                    resolve({});
                }
            })
        });
    } else {
        return __Zn.promise(params);
    }
}

const asyncMagic = (config = {}, reference) => {
    let parsed = {};
    if (config.magic) {
        const magic = __Zn.clone(config.magic);
        parsed = __Zn.parseInput(magic, reference);
    }
    const {method = "GET", uri} = config;
    if (uri) {
        const {
            response, // 提取数据专用的字段对应的值
        } = config;
        let promise;
        if ("GET" === method) {
            promise = __Zn.ajaxGet(uri, parsed);
        } else {
            /*
             * POST 的时候需要处理
             */
            const params = {};
            if (config['qr']) {
                params.criteria = parsed;
            } else {
                Object.assign(params, parsed);
            }
            promise = __Zn.ajaxPost(uri, params);
        }
        if (response) {
            const {key, data} = response;
            /*
             * 提取数据
             */
            return promise.then(ajaxResult => {
                let dataArray = [];
                dataArray = data ? ajaxResult[data] : ajaxResult;
                if (key && __Zn.isArray(dataArray)) {
                    dataArray.forEach(item => {
                        if (!item.key) {
                            item.key = item[key];
                        }
                    });
                }
                return __Zn.promise(dataArray);
            }).catch(error => console.error(error))
        } else {
            return promise.catch(error => console.error(error));
        }
    } else {
        return Promise.reject({error: "[ Ox ] ajax 配置中丢失了`uri`参数！"});
    }
};
const __seekData = (state, key, data = [], clientSort) => {
    /*
     * Assist 专用
     */
    const stateKey = `$a_${key.replace(/\./g, '_')}`;
    let dataResult = [];
    if (__Zn.isArray(data)) {
        dataResult = data;
    } else {
        /*
         * 另外一种返回 {rows/total} --ops的格式，list/count格式前处理
         */
        if (__Zn.isArray(data.rows)) {
            dataResult = data.rows;
        }
        /*
         * 另外一种返回 {list/count}
         * 旧代码：
        if (U.isArray(data.list) && 0 < data.count) {
            dataResult = data.list;
        }
         */
        dataResult = __Zn.valueArray(data);
    }
    /*
     * 前端排序
     */
    if (clientSort) {
        const sortField = clientSort; // assist[key]['clientSort'];
        let isAsc;
        let field;
        if (0 < sortField.indexOf(",")) {
            const splitted = sortField.split(',');
            field = splitted[0];
            isAsc = "ASC" === splitted[1];
        } else {
            field = sortField;
            isAsc = true;
        }
        if (isAsc) {
            dataResult = dataResult.sort(__Zn.sorterAscTFn(field));
        } else {
            dataResult = dataResult.sort(__Zn.sorterDescTFn(field));
        }
    }
    state[stateKey] = new DataArray(dataResult);
};

const asyncAssist = (assist = {}, reference, state = {}) => {
    const keys = Object.keys(assist);
    /*
         * response处理，需要根据 index 处理
         */
    const grouped = [];
    keys.forEach(key => grouped.push(assist[key]));
    const promises = keys.filter(key => undefined !== assist[key])
        .map(key => {
            const config = assist[key];
            // 继承截断方式处理 assist （前提是必须定义了继承）
            const {inherit} = config;
            if (inherit) {
                const inheritKey = true === inherit ? key : inherit;
                const data = __Zn.onDatum(reference, inheritKey);
                if (0 < data.length) {
                    return __Zn.promise(data);
                }
            }
            return asyncMagic(config, reference);
        })
    return __Zn.parallel(promises).then(response => {
        /*
         * 构造 Assist / Tabular，返回了新状态
         */
        const stateMap = __Zn.clone(state);
        /*
         * 是否包含了 grouped 的配置
         */
        keys.forEach((key, index) => {
            /*
             * grouped专用配置
             */
            const current = grouped[index];
            if (current) {
                const data = response[index];
                if (current && current.hasOwnProperty('group') && __Zn.isArray(data)) {
                    const groupField = current.group;
                    const groupData = __Zn.elementGroup(data, groupField);
                    Object.keys(groupData).forEach(key => {
                        const groupItem = groupData[key];
                        if (__Zn.isArray(groupItem)) {
                            __seekData(stateMap, key, groupItem, current['clientSort']);
                        }
                    });
                } else {
                    __seekData(stateMap, key, data, current['clientSort']);
                }
            }
        });
        return __Zn.promise(stateMap);
    }).catch(error => console.error(error));
};
export default {
    asyncValidate,
    asyncMagic,
    asyncAssist
}