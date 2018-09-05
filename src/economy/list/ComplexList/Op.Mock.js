import Ux from 'ux';

const mockCheck = (reference, options = {}, state = {}) => {
    const {$mockData = {}} = reference.props;
    if (options['mock.enabled'] && $mockData.mock) {
        const {$list} = reference.props;
        if (!$list) {
            state['mock'] = true;
        }
    }
};
const mockInit = (reference) => {
    const {mock, mocker} = reference.state;
    const {$mockData = {}} = reference.props;
    /**
     * mock是组件内部state状态中开启mock专用
     * mocker为组件内部的mocker初始化
     * $mockData.mock为全局模拟数据的环境变量
     */
    if (mock && !mocker && $mockData.mock) {
        let mocker = Ux.mockCrud(reference.props.reference).bind($mockData.data);
        Ux.Logger.mocker(mocker);
        reference.setState({mocker});
    }
};
const mockConnect = (reference, data) => {
    const {mock, mocker} = reference.state;
    const {$query} = reference.props;
    if (mock && mocker) {
        // 当mock打开的时候调用mocker中的过滤数据
        return mocker.filter($query.is() ? $query.to() : {}).to();
    } else {
        return data;
    }
};
/**
 * Detail数据读取
 * @param reference
 * @param id
 */
const mockDetail = (reference, id) => {
    const mockData = {};
    const {mock, mocker} = reference.state;
    if (mock && mocker) {
        mockData.mock = true;
        mockData.data = mocker.get(id);
    }
    return mockData;
};
const mockDelete = (reference, id) => {
    const mockData = {};
    const {mock, mocker} = reference.state;
    if (mock && mocker) {
        mockData.mock = true;
        mockData.data = {
            data: mocker.remove(id)
        };
    }
    return mockData;
};
const mockfnRecord = (reference = {}, isUpdate = false) => (updated = {}) => {
    const {mock, mocker} = reference.state;
    if (mock && mocker) {
        const mockData = {mock: true};
        if (isUpdate) {
            // 编辑
            mockData.data = mocker.update(updated);
        } else {
            // 添加
            mockData.data = mocker.add(updated);
        }
        return mockData;
    }
    return {}
};
const mockVector = (ref) => {
    const state = Ux.clone(ref.state);
    const {rxInject, parent} = ref.props;
    if (rxInject) {
        const {set = {}} = parent.state;
        // 列表页专用
        if (set.hasOwnProperty("tabs.list")) {
            // 这里必须包含state.tabs.items元素，且最小长度为1
            state.tabs.items[0].tab = set['tabs.list'];
        }
    }
    return state;
};
export default {
    mockCheck,
    mockInit,
    mockConnect,
    mockDetail,
    mockDelete,
    mockfnRecord,
    mockVector,
}