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
                if (U.isArray(data)) {
                    state[stateKey] = Dsl.getArray(data);
                }
            });
            return Ux.promise(state);
        });
    } else return Ux.promise(state);
}