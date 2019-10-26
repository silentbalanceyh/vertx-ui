import Fn from '../../functions';
import Ux from 'ux';
import {Dsl} from 'entity';
import U from 'underscore';

export default (reference, state = {}) => {
    /*
     * Assist 专用数据
     */
    const assist = Ux.fromHoc(reference, "assist");
    const ajaxParser = Fn.parserOfAjax(reference);
    /*
     * keys / promise
     */
    if (assist) {
        const keys = Object.keys(assist);
        const promises = keys
            .map(key => assist[key])
            .filter(config => undefined !== config)
            .map(config => ajaxParser.parseRequest(config));
        return Ux.parallel(promises).then(response => {
            /*
             * 构造 Assist / Tabular
             */
            state = Ux.clone(state);
            keys.forEach((key, index) => {
                /*
                 * Assist 专用
                 */
                const stateKey = `$a_${key.replace(/\./g, '_')}`;
                const data = response[index];
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
                if (assist[key]['clientSort']) {
                    const sortField = assist[key]['clientSort'];
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
                        dataResult = dataResult.sort(Ux.sorterAscFn(field));
                    } else {
                        dataResult = dataResult.sort(Ux.sorterDescFn(field));
                    }
                }
                state[stateKey] = Dsl.getArray(dataResult);
            });
            return Ux.promise(state);
        });
    } else return Ux.promise(state);
}