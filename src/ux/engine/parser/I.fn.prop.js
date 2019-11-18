import Cmn from './I.common';
import Ut from '../../unity';

export default (expression, {props}) => Cmn.fnPredicate("PROP", expression, () => {
    const path = expression.split('.'); // 路径解析
    return Ut.valueFind(props, path);
});