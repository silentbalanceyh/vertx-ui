import Ux from 'ux';

const rxConnector = (reference) => (event) => {
    const {value = {}} = reference.props;
    value[""] = "AND" === Ux.ambEvent(event);
    Ux.fn(reference).onChange(value);
}
const rxName = (reference) => (name) => {
    let {$waiting = {}} = reference.state;
    $waiting = Ux.clone($waiting);
    $waiting.field = name;
    if (!name) {
        $waiting.value = undefined;
    }
    reference.setState({$waiting});
}
const rxOp = (reference) => (op) => {
    let {$waiting = {}} = reference.state;
    $waiting = Ux.clone($waiting);
    $waiting.op = op;
    reference.setState({$waiting});
}
const yoOp = (op = [], configuration, reference) => {
    const {item = {}, config = {}} = configuration;
    const {ignores = {}} = config;
    const ignore = ignores[item.control] ?
        ignores[item.control] : ignores['TEXT'];
    op = op.filter(item => !ignore.includes(item.key));
    return op;
}
export default {
    yoOp,
    rxQr: (reference, configuration = {}) => (event) => {
        Ux.prevent(event);
        const {$waiting = {}} = reference.state;
        const {config = {}} = configuration;
        const {info = {}} = config;
        const {failure = {}} = info;
        if (!$waiting.field) {
            Ux.messageFailure(failure.field);
            return;
        }
        // 二元操作符
        if (!["n", "!n"].includes($waiting.op)) {
            if (!$waiting.value) {
                Ux.messageFailure(failure.value);
                return;
            }
        }
        // 成功执行
        const {value = {}} = reference.props;
        const fieldCond = $waiting.field + "," + $waiting.op;
        value[fieldCond] = $waiting.value ? $waiting.value : true;
        Ux.fn(reference).onChange(value);
        reference.setState({$waiting: {op: "="}})
    },
    rxDelete: (reference, item) => (event) => {
        Ux.prevent(event);
        // 成功执行
        const {value = {}} = reference.props;
        if (value[item.fieldCond]) {
            delete value[item.fieldCond];
        }
        Ux.fn(reference).onChange(value);
    },
    Field: {
        rxConnector,
        rxName,
        rxOp,
    }
}