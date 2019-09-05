import Eng from '../engine';
import Ajax from '../ajax';

const _mockData = (reference, trigger = {}) => {
    let mockData = {};
    if (trigger.mock) {
        const ref = Eng.onReference(reference, 1);
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
    Ajax.asyncData(trigger.ajax, record, fnCallback, mockData);
};
export default {
    xtCallback
};