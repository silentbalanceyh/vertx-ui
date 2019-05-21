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
const _initButton = (opts = {}, key, opKey) => {
    if (!opKey) opKey = key;
    const button = Ux.clone(DATA_OP[opKey]);
    button.text = opts[key];
    return button;
};
const initAdd = (options = {}, ref) => {
    const opts = _initOpt(options, 'op');
    if (opts.add) {
        const button = _initButton(opts, 'add');
        button.onClick = Action.rxAddTab(ref);
        return button;
    }
};
const initBatch = (options = {}) => {
    const opts = _initOpt(options, 'op.batch');
    const buttons = [];
    if (opts['batch.edit']) {
        buttons.push(_initButton(opts, 'batch.edit', 'batchEdit'));
    }
    if (opts['batch.delete']) {
        buttons.push(_initButton(opts, 'batch.delete', 'batchDelete'));
    }
    return buttons;
};
const initExtra = (options = {}) => {
    const opts = _initOpt(options, "op.extra");
    const buttons = [];
    if (opts['extra.column']) {
        buttons.push(_initButton(opts, 'extra.column', 'extraColumn'));
    }
    if (opts['extra.export']) {
        buttons.push(_initButton(opts, 'extra.export', 'extraExport'));
    }
    if (opts['extra.import']) {
        buttons.push(_initButton(opts, 'extra.import', 'extraImport'));
    }
    return buttons;
};
const initSearch = (options = {}) => _initOpt(options, "search");

const isBatch = (options = {}) => {
    const opts = _initOpt(options, 'op.batch');
    return !Ux.isEmpty(opts);
};
export default {
    initAdd,
    initBatch,
    initSearch,
    initExtra,
    isBatch
};