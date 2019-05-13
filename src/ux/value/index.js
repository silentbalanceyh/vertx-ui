import ValueDate from './Ux.Value.Date';
import ValueCt from './Ux.Value.Ct';
import ValueEvent from './Ux.Value.Event';
import ValueTree from './Ux.Value.Tree';
import ValueMath from './Ux.Value.Math';
import ValueSafe from './Ux.Value.Safe';
import ValueDust from './Ux.Value.Dust';
import ValueObtain from './Ux.Value.Obtain';
import ValueExpr from './Ux.Value.Expr';

export default {
    ...ValueCt,
    ...ValueDate,
    ...ValueEvent,
    ...ValueTree,
    ...ValueMath,
    ...ValueSafe,
    // 原子操作
    ...ValueDust,
    ...ValueObtain,
    ...ValueExpr,
};