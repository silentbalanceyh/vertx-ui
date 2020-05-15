import Ux from 'ux';

const _mockData = (reference, trigger = {}) => {
    let mockData = {};
    if (trigger.mock) {
        const ref = Ux.onReference(reference, 1);
        if (ref) {
            const {mock = {}} = ref.state ? ref.state : {};
            mockData = mock[trigger.mock];
        }
    }
    return mockData;
};

const _initPromise = (reference = {}, trigger, data) => {
    // 读取Mock数据
    const mockData = _mockData(reference, trigger);
    // 处理专用
    return Ux.asyncPromise(trigger.ajax,
        Ux.clone(data), // 防止参数被Ux.asyncPromise中的参数所替换，路径替换
        mockData);
};

const _initColumnPromises = (reference = {}, column = {}) => {
    const {data = []} = reference.state;
    // 数据处理
    const promises = [];
    data.forEach((record) => {
        // 从triggerFns中添加
        const {$config = {}} = column;
        const promise = _initPromise(reference, $config.trigger, record);
        promises.push(promise);
    });
    return Ux.parallel(promises);
};

const _initPromises = (reference) => {
    // 检查columns中是否包含了trigger节点？
    const {columns = []} = reference.state;
    // triggers
    const promises = [];
    const keys = [];
    columns.forEach((column = {}) => {
        const {$config = {}} = column;
        // 配置了promises
        if ($config.trigger && $config.trigger.to) {
            // 设置高阶函数
            promises.push(_initColumnPromises(reference, column));
            keys.push($config.trigger.to);
        }
    });
    return {
        keys, promises: Ux.parallel(promises)
    };
};

const _initOrigin = (reference, response, data = [], keys = []) => {
    let origin = {};
    // Data Matirx构造：Origin
    data.forEach((dataItem, dataIndex) =>
        keys.forEach((rootKey, colIndex) => {
            // 第一层Promise：按列处理
            const columnData = response[colIndex];
            const root = rootKey;
            const key = dataItem.key;
            // 第二层Promise：按行处理
            const recordData = columnData[dataIndex];
            // origin = Ux.xtOrigin(origin, recordData, root, key);
        }));
    return origin;
};
/*
 * 解决带有Trigger的初始化配置的触发后的问题
 */
const initTrigger = (reference = {}) => {
    if (reference.state) {
        // 先判断Data是否ready
        const {data = []} = reference.state;
        // 有数据才会执行Trigger，没有数据不执行Trigger
        if (0 < data.length) {
            const extracted = _initPromises(reference);
            const {keys = [], promises} = extracted ? extracted : {};
            if (promises) {
                promises.then(response => {
                    const origin = _initOrigin(reference, response, data, keys);
                    // 回调完成后修改表格的loading
                    const state = reference.state;
                    state.origin = origin;
                    state.$triggerReady = true;
                    // 拷贝才会触发更新
                    reference.setState(Ux.clone(state));
                });
            }
        }
    }

};
const _isTrigger = (columns = []) => {
    const filtered = columns.filter(column => !!column.$config)
        .filter(column => !!column.$config.trigger);
    return 0 < filtered.length;
};
const prepareTrigger = (state = {}, columns = []) => {
    if (_isTrigger(columns)) {
        state.$triggerReady = false;
    }
};
const renderTrigger = (reference = {}) => {
    let loading = false;
    const {columns = []} = reference.state;
    if (_isTrigger(columns)) {
        const {$triggerReady} = reference.state;
        loading = !$triggerReady;
    }
    return loading;
};
export default {
    initTrigger,
    prepareTrigger,
    renderTrigger,
};