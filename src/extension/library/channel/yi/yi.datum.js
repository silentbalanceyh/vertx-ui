import Fn from '../../functions';
import Ux from 'ux';
import {DataLabor} from 'entity';
import Q from 'q';
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
        return Q.all(promises).then(response => {
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
                    state[stateKey] = DataLabor.getArray(data);
                }
            });
            return Fn.promise(state);
        });
    } else return Fn.promise(state);
}