import Ux from "ux";
import Types from "./Act.Types";
import Mock from './a-mock';

export default {
    fnDeptList: Ux.rxEdict(Types.fnDeptList,
        params => Ux.ajaxPost("/api/depts/search", params, Mock),
        Ux.rxGrid
    )
};
