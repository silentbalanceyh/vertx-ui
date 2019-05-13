import AiSearcher from './AI.Searcher';
import AiCriteria from './AI.Criteria';

export default {

    // 直接过滤数据源
    ...AiSearcher,
    // 合并条件专用
    ...AiCriteria,
};