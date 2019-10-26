// 导入当前目录
import Cmn from './I.common';
import Ut from '../../unity';

export default (expression, {state}) => Cmn.fnPredicate("STATE", expression, () => {
    const attrPath = expression.split('.');
    if (1 === attrPath.length) {
        const attr = attrPath[0];
        return state[`$${attr}`];
    } else {
        return Ut.valueFind(state, attrPath);
    }
});