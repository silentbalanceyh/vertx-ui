import AiStream from '../stream/Ai.Stream';
import Value from '../Ux.Value';
import Ux from "ux";

export default (mockData, query = {}) => {
    // 必须要拷贝
    mockData = Ux.clone(mockData);
    query = Ux.clone(query);
    if (mockData.mock) {
        const mockIr = new AiStream().mock();
        const data = Value.clone(mockData.data.list);
        /* 直接执行过滤 */
        let source = mockIr.bind(data).filter(query).to();
        Ux.dgDebug({
            source,
            criteria: query.criteria,
        }, "[Ex] 模拟数据过滤后");
        /* 重新构造数据 */
        const $data = {};
        $data.count = mockData.data.count;  // 数量
        $data.list = source;                // 列表
        mockData.data = $data;
    }
    return mockData;
};