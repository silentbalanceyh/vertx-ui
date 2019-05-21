import DATA_OP from './DATA.OP';
import Ux from 'ux';
import Action from './Fx.Action';

const _initOpt = (options = {}, prefix = 'op') => {
    const ops = {};
    Object.keys(options).filter(key => key.startsWith(prefix))
        .forEach(key => {
            const field = key.substring(key.indexOf('.') + 1);
            ops[field] = options[key];
        });
    return ops;
};
const initAdd = (ref, options = {}) => {
    const opts = _initOpt(options, 'op');
    if (opts.add) {
        const button = Ux.clone(DATA_OP['add']);
        button.text = opts.add;
        button.onClick = Action.rxAddTab(ref);
        return button;
    }
};
const initBatch = (ref, options = {}) => {
    const opts = _initOpt(options, 'op.batch');
    const buttons = [];
    if (opts['batch.edit']) {
        const button = Ux.clone(DATA_OP.batchEdit);
        button.text = opts['batch.edit'];
        buttons.push(button);
    }
    if (opts['batch.delete']) {
        const button = Ux.clone(DATA_OP.batchDelete);
        button.text = opts['batch.delete'];
        buttons.push(button);
    }
    return buttons;
};
const isBatch = (options = {}) => {
    const opts = _initOpt(options, 'op.batch');
    return !Ux.isEmpty(opts);
};
export default {
    initAdd,
    initBatch,
    isBatch
};