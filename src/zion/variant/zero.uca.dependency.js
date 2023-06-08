import __Zn from '../zero.module.dependency';
import __LIMIT from '../v.uca.limitation';
import __Xt from '../uca.fn.xt.lazy.ready';

export default {
    // Fix: xtReady is not function
    ...__Xt,
    ...__Zn,
    ...__LIMIT,
}

export {default as uca} from '../annotation.a.uca.internal';