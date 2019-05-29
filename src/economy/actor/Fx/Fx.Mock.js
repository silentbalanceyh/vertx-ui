import Ux from 'ux';
import U from 'underscore';

const mockEnv = (reference, options) => (executor) => {
    if (!options) {
        options = reference.props.$options;
    }
    if (options) {
        if (options['mock.enabled']) {
            const {$MOCK_LIST = {}} = reference.props;
            if ($MOCK_LIST) {
                if (U.isFunction(executor)) {
                    /*
                     * 两个参数
                     * 第一参数为 Mocker
                     * 第二参数为 mockData中的 data 部分
                     */
                    return executor(Ux.mockCrud(reference), $MOCK_LIST.data);
                }
            }
        }
    } else {
        throw new Error("[Ex] 无法读取组件的 options，请检查配置！");
    }
};
const mockResult = (reference, response, supplier) => {
    const {$MOCK_LIST, $options = {}} = reference.props;
    /* 1. 打开Mock的第一条件必须是 $options */
    if ($options['mock.enabled']) {
        /* 2. 第二条件是数据 $MOCK 中的 mock */
        if ($MOCK_LIST && $MOCK_LIST.mock) {
            if (U.isFunction(supplier)) {
                const {$mocker} = reference.state;
                return supplier($mocker);
            } else {
                /* 内部调用错误 */
                console.error("[Ex] MMP 乱来");
                return response;
            }
        } else {
            /* 未传入 $MOCK 中的数据 */
            console.error(("[Ex] $MOCK 数据中的模拟环境未打开。"));
            return response;
        }
    } else {
        /* 未配置 options 中的Mock环境 */
        console.error(("[Ex] options 中的模拟环境未打开。"));
        return response;
    }
};
const mockSingle = (reference, consumer) => {
    const {$mocker} = reference.state;
    return mockSingleWithMocker(reference, consumer, $mocker);
};
const mockSingleWithMocker = (reference, consumer, $mocker) => {
    const {$MOCK_LIST} = reference.props;
    let mockFinal = {};
    if ($mocker) {
        let data = {};
        if (U.isFunction(consumer)) {
            data = consumer($mocker);
        }
        mockFinal = {data, mock: $MOCK_LIST.mock};
    } else {
        mockFinal = {data: {}, mock: false};
    }
    Ux.dgDebug(mockFinal, "[Mk] 模拟数据最终。", "gray");
    return mockFinal;
};
const mockInit = (reference, options = {}) =>
    /* 1. Mocker 绑定数据源 */
    mockEnv(reference, options)((mocker, data) => mocker.bind(data));

const mockSearchResult = (reference, params = {}) => async response =>
    mockResult(reference, response, (mocker) => {
        /* 不重新绑定 */
        return mocker ? mocker.filter(params).to() : {};
    });
const mockInherit = (reference, inherit = {}) => {
    const {$MOCK_LIST, $MOCK_COLUMN} = reference.props;
    if ($MOCK_LIST) {
        inherit.$MOCK_LIST = $MOCK_LIST;
    }
    if ($MOCK_COLUMN) {
        inherit.$MOCK_COLUMN = $MOCK_COLUMN;
    }
};
const mockDelete = (reference, id) =>
    mockSingle(reference, (mocker) => mocker.remove(id));
const mockGet = (reference, id) =>
    mockSingle(reference, (mocker) => mocker.get(id));
const mockUpdate = (reference, record) =>
    mockSingle(reference, (mocker) => mocker.update(record));

const mockDeleteWithMocker = (reference, id, $mocker) =>
    mockSingleWithMocker(reference, (mocker) => mocker.remove(id), $mocker);
const mockUpdateWithMocker = (reference, records, $mocker) =>
    mockSingleWithMocker(reference, (mocker) => mocker.update(records), $mocker);
const mockRecord = (reference, update = false) => {

};
export default {
    mockInit,
    mockInherit,    // 继承专用ComplexList -> IxTable
    mockSearchResult,
    // 单记录处理
    mockDelete,           // 模拟删除
    mockDeleteWithMocker, // 批量删除
    // 批量更新
    mockUpdate,
    mockUpdateWithMocker, // 批量更新
    mockGet,
    // 记录模拟
    mockRecord,
};