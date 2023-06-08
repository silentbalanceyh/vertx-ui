import __CONN from './form.equip.__.fn.raft.robin';
import __CPI from './form.equip.fn._.cab.cap.init';
import __CONTAINER from './variant-uca-container';
import __UCA from './variant-uca';
import containerFn from './form.equip.__.@fn.raft.container';

const I = {
    ...__CONN,
    ...__CPI,
}

const cabForm = (reference = {}, key = "form") =>
    I.cabForm(reference, key);

const configForm = (form, addOn = {}) =>
    I.configForm(form, addOn, containerFn(__CONTAINER), __UCA);

const capForm = async (reference = {}, config = {}, program = {}) =>
    I.capForm(reference, config, program);

function raftForm() {
    const container = containerFn(__CONTAINER);
    if (1 === arguments.length) {
        /*
         * 返回 Promise
         * 1. 普通功能，capForm
         * 2. 配置功能，configForm
         * 3. 辅助信息，assist 数据处理
         */
        const reference = arguments[0];
        return I.raftFormSelf(reference, container, __UCA)
    } else if (2 === arguments.length) {
        const reference = arguments[0];
        const config = arguments[1] ? arguments[1] : {};
        return I.raftFormConfig(reference, config, container, __UCA);
    }
}

export default {
    cabForm,
    capForm,
    configForm,
    raftForm,
}