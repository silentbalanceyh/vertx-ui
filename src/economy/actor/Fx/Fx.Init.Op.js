import DATA_OP from './DATA.OP';
import Ux from 'ux';
import Event from './Fx.Event';

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
const initOpen = (options = {}, ref) => {
    const opts = _initOpt(options, 'op.open');
    const buttons = [];
    if (opts['open.add']) {
        const button = _initButton(opts, 'open.add', 'openAdd');
        button.onClick = Event.rxAddTab(ref);
        buttons.push(button);
    }
    if (opts['open.filter']) {
        const button = _initButton(opts, 'open.filter', 'openFilter');
        button.onClick = Event.rxClean(ref);
        buttons.push(button);
    }
    return buttons;
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
    initOpen,
    initBatch,
    initSearch,
    initExtra,
    isBatch
};