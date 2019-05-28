import {Modal} from 'antd';
import Unity from './Fx.Unity';
/* 这里的 reference 是 ExComplexList */
const rxClean = (reference) => (event) => {
    event.preventDefault();
    const {options = {}} = reference.state;
    const content = options['confirm.clean.filter'];
    // 执行函数
    const executor = () => {
        // 清除 $condition
        Unity.doCondition(reference, {});
    };
    if (content) {
        Modal.confirm({
            content,
            onOk: executor
        })
    } else {
        executor();
    }
};
/* 这里的 reference 是 IxOpSearch */
const rxFilter = (reference) => (event) => {

};
const rxFilterUniform = (reference) => (query = {}) => {

};
export default {
    rxClean, // 重置清空所有查询条件
    rxFilter, // 基本搜索专用
    rxFilterUniform
}