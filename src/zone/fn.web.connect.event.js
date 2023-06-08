import __E from './fn.debug.fx.error';

const connectId = (id) => {
    const ele = document.getElementById(id);
    __E.fxWarning(!ele, 10015, id);
    if (ele) {
        ele.click()
    }
}
export default {
    connectId,
    connectIdFn: (id) => () => connectId(id),
}