import xuiControl from './xui.fn.control';
import Chk from '../channel';

export default (config = {}, UI = {}, inherit = {}) => {
    // TODO: Usage in future
    const $control = Chk.yoControl(config);
    return xuiControl($control, UI, inherit);
}