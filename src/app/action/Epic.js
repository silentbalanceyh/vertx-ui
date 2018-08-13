import Ux from "ux";
import Types from "./Types";
import Mock from './mock';

export default {
    fnDeptList: Ux.rxEdict(Types.fnDeptList,
        params => Ux.ajaxPost("/api/list/search", params, Mock.fnDeptList),
        Ux.rxGrid
    )
};