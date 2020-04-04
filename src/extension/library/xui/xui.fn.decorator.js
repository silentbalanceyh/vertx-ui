import xuiControl from './xui.fn.control';
import Chk from '../channel';

export default (config = {}, UI = {}, inherit = {}, state = {}) => {
    // TODO: Usage in future
    const $control = Chk.yoControl(config);
    /* 激活专用 */
    if (state && state.$switcher) {
        inherit.$switcher = state.$switcher;
    }
    return xuiControl($control, UI, inherit);
}