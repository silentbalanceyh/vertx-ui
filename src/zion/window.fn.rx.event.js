import __PT from './page.fn.to.rect';
import __Zn from './zero.module.dependency';

function rxResize(reference) {
    if (2 === arguments.length) {
        // 第二种用法
        return () => {
            const state = __PT.toHeightState(arguments[1]);
            try {
                __Zn.of(reference).in(state).done();
                // reference.?etState(state);
            } catch (error) {

            }
        }
    } else {
        // 目前存在的用法
        return (adjust = 0) => {
            const state = __PT.toHeightState(adjust);
            try {
                __Zn.of(reference).in(state).done();
                // reference.?etState(state);
            } catch (error) {

            }
        };
    }
}

export default {
    rxResize,
}