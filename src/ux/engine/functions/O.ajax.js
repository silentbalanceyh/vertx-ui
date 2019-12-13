import Abs from '../../abyss';
import Ajax from '../../ajax';
import Pr from '../parser';
import Ele from '../../element';
import Ut from '../../unity';
import U from "underscore";
import {Dsl} from "entity";

const asyncMagic = (config = {}, reference) => {
    let parsed = {};
    if (config.magic) {
        const magic = Abs.clone(config.magic);
        parsed = Pr.parseInput(magic, reference);
    }
    const {method = "GET", uri} = config;
    if (uri) {
        if ("GET" === method) {
            return Ajax.ajaxGet(uri, parsed);
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

            return Ajax.ajaxPost(uri, params);
        }
    } else {
        return Promise.reject({error: "[ Ox ] ajax 配置中丢失了`uri`参数！"});
    }
};
const seekData = (state, key, data = [], clientSort) => {
    /*
     * Assist 专用
     */
    const stateKey = `$a_${key.replace(/\./g, '_')}`;
    let dataResult = [];
    if (U.isArray(data)) {
        dataResult = data;
    } else {
        /*
         * 另外一种返回 {list/count}
         */
        if (U.isArray(data.list) && 0 < data.count) {
            dataResult = data.list;
        }
    }
    /*
     * 前端排序
     */
    if (clientSort) {
        const sortField = clientSort; // assist[key]['clientSort'];
        let isAsc = true;
        let field = "";
        if (0 < sortField.indexOf(",")) {
            const splitted = sortField.split(',');
            field = splitted[0];
            isAsc = "ASC" === splitted[1];
        } else {
            field = sortField;
            isAsc = true;
        }
        if (isAsc) {
            dataResult = dataResult.sort(Ut.sorterAscFn(field));
        } else {
            dataResult = dataResult.sort(Ut.sorterDescFn(field));
        }
    }
    state[stateKey] = Dsl.getArray(dataResult);
};
const asyncAssist = (assist = {}, reference, state = {}) => {
    const keys = Object.keys(assist);
    /*
         * response处理，需要根据 index 处理
         */
    const grouped = [];
    keys.forEach(key => grouped.push(assist[key]));
    const promises = keys
        .map(key => assist[key])
        .filter(config => undefined !== config)
        .map(config => asyncMagic(config, reference));
    return Abs.parallel(promises).then(response => {
        /*
         * 构造 Assist / Tabular，返回了新状态
         */
        const stateMap = Abs.clone(state);
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
                if (current && current.hasOwnProperty('group') && U.isArray(data)) {
                    const groupField = current.group;
                    const groupData = Ele.elementGroup(data, groupField);
                    Object.keys(groupData).forEach(key => {
                        const groupItem = groupData[key];
                        if (U.isArray(groupItem)) {
                            seekData(stateMap, key, groupItem, current['clientSort']);
                        }
                    });
                } else {
                    seekData(stateMap, key, data, current['clientSort']);
                }
            }
        });
        return Abs.promise(stateMap);
    })
};
export default {
    asyncMagic,
    asyncAssist,
}