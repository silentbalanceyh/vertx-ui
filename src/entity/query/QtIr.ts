import * as Immutable from 'immutable';
/*
 * 注意 Ux 防止引起循环引用
 */
const toInteger = (literal = "", dft = 0) => {
    let ret = parseInt(literal, 10);
    if (isNaN(ret)) {
        ret = dft;
    }
    return ret;
};
const toCopy = (input) => input ? Immutable.fromJS(input).toJS() : undefined;
/*
 * 分页格式化：pager
 */
const irPager = (query: any = {}) => {
    let pager: any = {};
    /*
     * query.pager 不能是：null, undefined 和非法值
     */
    if (query.pager) {
        if ("string" === typeof query.pager) {
            /*
             * 字符串格式
             */
            const pageData = query.pager.split(',');
            pager.page = toInteger(pageData[0], 1);     // 默认 1
            pager.size = toInteger(pageData[1], 10);    // 默认 10
        } else {
            /*
             * 拷贝
             */
            pager = toCopy(query.pager);
        }
    }
    return pager;
};
/*
 * 过滤格式化：projection
 */
const irProjection = (query: any = {}) => {
    let projection = [];
    if (Array.isArray(query.projection)) {
        projection = toCopy(query.projection);
    }
    return projection;
};
/*
 * 排序格式化：sorter
 */
const irSorter = (query: any = {}) => {
    let sorterData = [];
    if (query.sorter) {
        if (Array.isArray(query.sorter)) {
            sorterData = toCopy(query.sorter);
        } else {
            const sorters = query.sorter.split(',');
            sorters.forEach(sorter => {
                const kv = sorter.replace(/ /g, '').split('=');
                const sorterItem = `${kv[0]},${kv[1]}`;
                sorterData.push(sorterItem);
            });
        }
    }
    return sorterData;
};
/*
 * 查询条件格式化：不执行查询条件的基本解析
 */
const irCriteria = (query: any) => {
    let criteria: any = {};
    if (query.criteria) {
        if ("string" === typeof query.criteria) {
            // 1. 直接字符串格式
            const condition = query.criteria.split(',');
            condition.forEach(cond => {
                const kv = cond.replace(/ /g, '').split('=');
                criteria[kv[0]] = kv[1];
            });
        } else if (Array.isArray(query.criteria)) {
            // 2. 数组格式
            query.criteria.filter(cond => "string" === typeof cond)
                .forEach(cond => {
                    // 2.1.数组中的元素是字符串
                    const kv = cond.replace(/ /g, '').split('=');
                    criteria[kv[0]] = kv[1];
                });
        } else {
            // 3. 本身就是一个对象，直接传入
            criteria = toCopy(query.criteria);
        }
    }
    return criteria;
};
export default {
    irPager,
    irProjection,
    irSorter,
    irCriteria
}