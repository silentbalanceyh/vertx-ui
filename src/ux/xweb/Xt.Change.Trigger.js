import Prop from '../prop';

const _mockData = (reference, trigger = {}) => {
    let mockData = {};
    if (trigger.mock) {
        const ref = Prop.onReference(reference, 1);
        if (ref) {
            const {mock = {}} = ref.state ? ref.state : {};
            mockData = mock[trigger.mock];
        }
    }
    return mockData;
};

const xtCallback = (reference, trigger = {}, record = {}, fnCallback) => {
    // 读取Mock数据
    const mockData = _mockData(reference, trigger);
    // 处理专用
    Prop.asyncData(trigger.ajax, record, fnCallback, mockData);
};
export default {
    xtCallback
};