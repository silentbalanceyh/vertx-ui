import Cmn from './I.common';

export default (expression, {props}) => Cmn.fnPredicate("PROP", expression, () => {
    const path = expression.split('.'); // 路径解析
    return Cmn.findValue(props, path);
});