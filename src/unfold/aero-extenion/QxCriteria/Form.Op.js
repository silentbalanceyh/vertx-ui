import Ux from 'ux';

const rxConnector = (reference) => (event) => {
    const {value = {}} = reference.props;
    value.connector = Ux.ambEvent(event);
    // 解决 OR 和 AND 不能切换的问题
    const $updated = Ux.clone(value);
    Ux.fn(reference).onChange($updated);
}
const rxName = (reference) => (name) => {
    let {$waiting = {}} = reference.state;
    $waiting = Ux.clone($waiting);
    $waiting.field = name;
    if (!name) {
        $waiting.value = undefined;
    }
    Ux.of(reference).in({$waiting}).done();
    // reference.?etState({$waiting});
}
const rxOp = (reference) => (op) => {
    let {$waiting = {}} = reference.state;
    $waiting = Ux.clone($waiting);
    $waiting.op = op;
    Ux.of(reference).in({$waiting}).done();
    // reference.?etState({$waiting});
}
const yoOp = (op = [], configuration, reference) => {
    const {item = {}, config = {}} = configuration;
    const {ignores = {}} = config;
    const ignore = ignores[item.control] ?
        ignores[item.control] : ignores['TEXT'];
    op = op.filter(item => !ignore.includes(item.key));
    return op;
}
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    yoOp,
    /*
     * 该方法位于点击下边的新增按钮时触发
     * 针对每个条件执行追加操作
     */
    rxSubmitFn: (reference, configuration = {}) => (event) => {
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

        Ux.of(reference).in({
            $waiting: {
                op: "="
            },
            $activeKey: "tabOk"
        }).handle(() => {
            Ux.fn(reference).onChange(value);
        });
        // reference.?etState({$waiting});
        // Ux.fn(reference).onChange(value);
        // reference.?etState({$waiting: {op: "="}})
    },
    Field: {
        rxConnector,
        rxName,
        rxOp,
    }
}