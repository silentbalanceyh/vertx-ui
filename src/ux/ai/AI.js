import AiLink from './AI.Link';
import AiLayout from './AI.Layout';
import AiInput from './AI.Input';
import AiButton from './AI.Action';
import AiColumn from './AI.Column';
import AiTab from './AI.Tab';
import AiChart from './AI.Chart';
import AiNormalize from './AI.Normalize';
import LayoutTypes from './AI.Layout.Item';

export default {
    ...AiLink,
    ...AiLayout,
    ...AiInput,
    ...AiButton,
    ...AiColumn,
    ...AiTab,
    ...AiChart,
    ...AiNormalize,
    LayoutTypes
}