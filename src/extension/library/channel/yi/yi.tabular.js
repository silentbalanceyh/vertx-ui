import yiModule from './yi.module';
import yiQuery from './yi.query';
import Ux from 'ux';

export default (reference) => {
    /*
     * 读取参数信息
     */
    const state = {};
    return yiModule(reference, state)
        .then(data => {
            reference.setState(data);
            return Ux.promise(data);
        })
        .then(data => yiQuery(reference, data))
        .then(data => {
            data.$ready = true;
            reference.setState(data);
        })
};