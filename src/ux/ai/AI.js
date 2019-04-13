import AiLink from './AI.Link';
import AiLayout from './layout/AI.Layout';
import AiInput from './input/AI.Input';
import AiButton from './action/AI.Action';
import AiColumn from './column/AI.Column';
import AiChart from './AI.Chart';
import AiNormalize from './AI.Normalize';
import Calculator from './layout/AI.Layout.Calculator';
import AiString from './expr/AI.Expr.String';
import AiPure from './AI.Pure';
import RxAnt from './ant/AI.RxAnt';
// 查询专用的两个方法
import AiQuery from './query';
// 特殊的apply系列方法
import AiValue from './expr/AI.Expr.Value';

export default {
    ...AiLink,
    ...AiLayout,
    ...AiInput,
    ...AiButton,
    ...AiColumn,
    ...AiChart,
    ...AiNormalize,
    ...AiString,
    ...AiPure,
    ...AiQuery,
    ...AiValue,
    RxAnt,      // 新添加Rx Ant部分
    aiLayoutItem: Calculator.calculateItem
};