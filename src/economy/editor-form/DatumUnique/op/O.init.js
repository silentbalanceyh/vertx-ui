import Ux from 'ux';

const yoValue = (value) => {
    if ("string" === value && value) {
        try {
            const parsed = Ux.valueParse(value);
            const segment = parsed.expression.split(',');
            const [source, output, condition] = segment;
            const segmentCond = condition.split('=');
            const [condField, condValue] = segmentCond;
            const $data = {};
            $data.source = source;
            $data.output = output;
            $data.condField = condField;
            const valueParsed = Ux.valueParse(condValue);
            $data.condValue = valueParsed.expression;
            return $data;
        } catch (e) {
            console.error("无法解析值", value);
            return {};
        }
    } else return {};
}
const yiPage = (reference) => {
    const state = {};
    state.$ready = true;
    /* input 处理 */
    const input = Ux.fromHoc(reference, "input");
    state.$input = Ux.clone(input);
    /* 值格式 */
    const {value} = reference.props;
    if (value) {
        /*
         * 表达式解析
         * UNIQUE:ci.status,key,code=FIX:RUNNING
         **/
        state.data = yoValue(value);
    } else {
        state.data = {
            output: "key"    // 默认输出字段是主键
        }
    }
    state.$ready = true;
    reference.setState(state);
}
export default {
    yoValue,
    yiPage,
    onChange: (reference, field) => (event) => {
        const {data = {}} = reference.state;
        data[field] = Ux.ambEvent(event);
        reference.setState({data});
        {
            let expr = "UNIQUE:";
            if (data) {
                expr += (data.source ? data.source : "");
                expr += ",";
                expr += (data.output ? data.output : "");
                expr += ",";
                expr += (data.condField ? data.condField : "");
                expr += "=";
                expr += "FIX:";
                expr += (data.condValue ? data.condValue : "");
            }
            Ux.fn(reference).onChange(expr);
        }
    },
    ITEM_OPTION: {
        labelCol: {
            span: 8
        },
        wrapperCol: {
            span: 16
        },
        style: {
            width: "100%"
        }
    }
}