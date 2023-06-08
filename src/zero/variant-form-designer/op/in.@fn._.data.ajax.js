import __Zn from '../zero.uca.dependency';

export default (normalized = {}, data = {}) => {
    const ajax = __Zn.valuePath(data, "optionJsx.config.ajax");
    if (!__Zn.isEmpty(ajax)) {
        const {method = "GET"} = ajax;
        normalized.ajaxMethod = method;
        normalized.ajaxUri = __Zn.valuePath(ajax, "uri");

        if (ajax.hasOwnProperty("magic")) {
            /*
             * 非查询引擎模式
             */
            const {criteria = {}} = ajax.magic ? ajax.magic : {};
            normalized.ajaxMagic = criteria;
        } else {
            /*
             * 查询引擎模式
             */
            const {criteria = {}, pager = {}, sorter = []} = ajax.params ? ajax.params : {};
            // 分页
            normalized.ajaxPageSize = __Zn.valueInt(pager.size, 10);
            // 条件
            normalized.ajaxMagic = criteria;
            // 排序处理
            const sortArray = [];
            sorter.forEach(each => {
                if ("string" === typeof each) {
                    const sorted = each.split(',');
                    const [field, isAsc] = sorted;
                    const sortItem = {};
                    sortItem.field = field;
                    sortItem.isAsc = "ASC" === isAsc;
                    sortArray.push(sortItem);
                }
            });
            normalized.ajaxSort = sortArray;
        }
    }
}