import DATA_OP from './DATA.OP';
import Ux from 'ux';
import Tab from './Fx.Tab';

const _initOpt = (options = {}) => {
    const ops = {};
    Object.keys(options).filter(key => key.startsWith('op'))
        .forEach(key => {
            const field = key.substring(key.indexOf('.') + 1);
            ops[field] = options[key];
        });
    return ops;
};
const initAdd = (ref, options = {}) => {
    const opts = _initOpt(options);
    if (opts.add) {
        const button = Ux.clone(DATA_OP['add']);
        button.text = opts.add;
        button.onClick = Tab.rxAdd(ref);
        return button;
    }
};
export default {
    initAdd
}