import Ux from 'ux';
import {Mock} from 'app';

export default {
    rxSearch: params => Ux.ajaxPost("/api/dept/search", params, Mock.fnDeptList)
}