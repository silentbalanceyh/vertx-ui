import Ux from "ux";
import Types from "./Types";
import Mock from './mock';

export default {
    fnDeptList: Ux.rxEdict(Types.fnDeptList,
        params => Ux.ajaxPost("/api/list/search", params, Mock.fnDeptList),
        Ux.rxGrid
    ),
    fnCategory: Ux.rxEdict(Types.fnCategory,
        params => Ux.ajaxPost("/api/tree/category", params, Mock.fnCategory),
        Ux.rxTree
    ),
    fnCategoryList: Ux.rxEdict(Types.fnCategoryList,
        params => Ux.ajaxPost("/api/tree/category-list", params, Mock.fnCategoryList),
        Ux.rxGrid,
    ),
    fnRankList: Ux.rxEdict(Types.fnTreeData,
        params => Ux.ajaxPost("/api/tree/data", params, Mock.fnTreeData),
        Ux.rxCircle,
    )
};