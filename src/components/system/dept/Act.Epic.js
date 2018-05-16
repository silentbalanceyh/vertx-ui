import Ux from "ux";
import Types from "./Act.Types";
import Mock from './mock';

export default {
    fnDepartmentList: $action => Ux.rxEpic(
        $action.ofType(Types.fnDepartmentList.getType()),
        request => Ux.ajaxPost("/api/department/search", request),
        data => ({"datum.data": data}),
        Mock.fnSearch
    ),
    fnDepartment: $action => Ux.rxEpic(
        $action.ofType(Types.fnDepartment.getType()),
        request => Ux.ajaxGet("/api/department/:id", request),
        data => ({
            "datum.record": data,
            "datum.clear": Object.keys(data)
        }),
        Mock.fnRead
    )
};
