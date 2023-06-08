import __CM from './idyl.__.fn._.common';
import Ux from 'ux';

const Cn = Ux.Env.K_NAME;
const rsOpened = (reference, opened = true) =>
    __CM.boolean(reference, Cn.OPENED, opened);
export default {
    rsOpened,
}