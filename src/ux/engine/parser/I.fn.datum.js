import Datum from '../datum';
import Ut from '../../unity';
import Cmn from './I.common';
/*
 * 具有二义性的解析
 * 1）DATUM:source=xxx 直接构造下拉表
 * 2）DATUM:source=xxx,cond=YYY，其中YYY支持条件（后期使用）
 */
export default (expression, {props}) => Cmn.fnPredicate("DATUM", expression, () => {
    const datum = Ut.formatObject(expression);
    if (datum.source) {
        const keys = Object.keys(datum).length;
        if (1 === keys) {
            /*
             * 只有 source
             */
            return Datum.elementFindDatum({props}, datum.source, {});
        } else {
            /*
             * 包含第二条件
             */
            // TODO: 暂时不需要，等待后期开发
        }
    } else return null;
});