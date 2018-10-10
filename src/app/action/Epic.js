import Ux from "ux";
import Types from "./Types";
import Mock from './mock';
import Credit from './Epic.Credits';

export default {
    ...Credit,
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
    ),
    fnRank1List: Ux.rxEdict(Types.fnTreeData1,
        params => Ux.ajaxPost("/api/tree/data", params, Mock.fnTreeData1),
        Ux.rxCircle
    ),
    fnTableList: Ux.rxEdict(Types.fnTableList,
        params => Ux.ajaxGet("/api/table/list", params, Mock.fnTableList),
        data => Ux.rxAssist(data, "table.list")
    ),
    fnTableTree: Ux.rxEdict(Types.fnTableTree,
        params => Ux.ajaxGet("/api/table/tree", params, Mock.fnTableTree),
        data => Ux.rxAssist(data, "table.tree")
    ),
    fnMaterials: Ux.rxEdict(Types.fnMaterials,
        params => Ux.ajaxGet("/api/material/tree", params, Mock.fnMaterials),
        data => Ux.rxAssist(data, "item.material")
    )
};