import Ux from 'ux';
import U from 'underscore';

const mockEnv = (reference, options) => (executor) => {
    if (!options) {
        options = reference.props.$options;
    }
    if (options) {
        if (options['mock.enabled']) {
            const {$MOCK} = reference.props;
            if ($MOCK) {
                if (U.isFunction(executor)) {
                    /*
                     * 两个参数
                     * 第一参数为 Mocker
                     * 第二参数为 mockData中的 data 部分
                     */
                    return executor(Ux.mockCrud(reference), $MOCK.data);
                }
            }
        }
    } else {
        throw new Error("[Ex] 无法读取组件的 options，请检查配置！");
    }
};
const mockResult = (reference, response, supplier) => {
    const {$MOCK, $options = {}} = reference.props;
    /* 1. 打开Mock的第一条件必须是 $options */
    if ($options['mock.enabled']) {
        /* 2. 第二条件是数据 $MOCK 中的 mock */
        if ($MOCK && $MOCK.mock) {
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
const mockInit = (reference, options = {}) =>
    /* 1. Mocker 绑定数据源 */
    mockEnv(reference, options)((mocker, data) => mocker.bind(data));

const mockSearchResult = (reference, params = {}) => async response =>
    mockResult(reference, response, (mocker) => {
        /* 不重新绑定 */
        return mocker.filter(params).to();
    });
const mockInherit = (reference, inherit = {}) => {
    const {$MOCK} = reference.props;
    if ($MOCK) {
        inherit.$MOCK = $MOCK;
    }
};
const mockDelete = (reference, id) => {
    const {$MOCK} = reference.props;
    const {$mocker} = reference.state;
    if ($mocker) {
        const data = $mocker.remove(id);
        return {data, mock: $MOCK.mock};
    } else {
        return {data: {}, mock: false};
    }
};
export default {
    mockInit,
    mockInherit,    // 继承专用ComplexList -> IxTable
    mockSearchResult,
    // 单记录处理
    mockDelete,     // 模拟删除
};