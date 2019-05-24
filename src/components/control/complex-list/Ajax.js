import Ux from 'ux';
import {Mock} from "app";

export default {
    rxSearch: (params) => Ux.ajaxPost("/api/dept/search", params,
        Mock.fnDeptList),
    rxColumn: (params) => Ux.ajaxPost("/api/my/column/:module", params,
        Mock.fnDeptColumn)
}