import AiLink from './AI.Link';
import AiLayout from './AI.Layout';
import AiInput from './AI.Input';
import AiButton from './AI.Action';
import AiColumn from './AI.Column';
import AiChart from './AI.Chart';
import AiNormalize from './AI.Normalize';
import Calculator from './AI.Layout.Calculator';
import AiString from './AI.Expr.String';
import AiCriteria from './AI.Criteria';
import AiPure from './AI.Pure';

export default {
    ...AiLink,
    ...AiLayout,
    ...AiInput,
    ...AiButton,
    ...AiColumn,
    ...AiChart,
    ...AiNormalize,
    ...AiString,
    ...AiCriteria,
    ...AiPure,
    aiLayoutItem: Calculator.calculateItem
}