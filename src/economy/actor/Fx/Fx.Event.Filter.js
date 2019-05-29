import {Modal} from 'antd';
import U from 'underscore';
import Unity from './Fx.Unity';
/* 这里的 reference 是 ExComplexList */
const rxClean = (reference) => (event) => {
    event.preventDefault();
    const {options = {}} = reference.state;
    const content = options['confirm.clean.filter'];
    // 执行函数
    const executor = () => {
        // 加载效果
        Unity.doLoading(reference, true);
        // 清除 $condition
        Unity.doCondition(reference);
    };
    if (content) {
        Modal.confirm({
            content,
            onOk: executor
        });
    } else {
        executor();
    }
};
/* 这里的 reference 是 IxOpSearch，修改的是 query */
const rxFilter = (reference) => (event) => {
    const {$options = {}} = reference.props;
    const searchCond = $options['search.cond'];
    if (U.isArray(searchCond)) {
        // 清除 $condition
        // Unity.doCondition(reference);
        // 构造查询条件
        const cond = {};
        searchCond.forEach(field => {
            if (event) {
                cond[field] = event;
            } else {
                cond[field] = "__DELETE__";
            }
        });
        cond[""] = false;   // 需要使用 OR 连接
        // 清空 $query 外层条件
        Unity.doQueryMerge(reference, cond);
    }
};
export default {
    rxClean, // 重置清空所有查询条件
    rxFilter, // 基本搜索专用
};