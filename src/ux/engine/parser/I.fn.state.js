// 导入当前目录
import Cmn from './I.common';

export default (value, {state}) => {
    const attrPath = value;
    if (1 === attrPath.length) {
        const attr = attrPath[0];
        return state[`$${attr}`];
    } else {
        return Cmn.findValue(state, attrPath);
    }
}