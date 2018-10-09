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
    fnCredits: Ux.rxEdict(Types.fnCredits,
        params => Ux.ajaxGet("/api/credits", params, Mock.fnCredits),
        data => {
            if (data) {
                data.filter(item => item.hasOwnProperty('extension'))
                    .map(item => item.extension)
                    .filter(item => item.hasOwnProperty('credits'))
                    .map(item => item['credits'])
                    .forEach((creditArr, index) => data[index].children = creditArr);
            }
            return Ux.rxAssist(data, "model.credit")
        }
    )
};