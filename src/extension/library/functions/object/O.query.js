import Ux from 'ux';
import U from 'underscore';

class ExQuery {

    constructor(query = {}) {
        this.query = Ux.clone(query);
    }

    /*
     * 绑定 React 中的 reference 引用
     */
    on(reference) {
        this.reference = reference;
        return this;
    }

    /*
     * pager 相关的处理，处理分页专用
     */
    size(size = 10) {
        if (size && this.query.pager) {
            const pagerRef = this.query.pager;
            pagerRef.size = size;
        }
        return this;
    }

    page(page = 1) {
        if (page && this.query.pager) {
            const pagerRef = this.query.pager;
            pagerRef.page = page;
        }
        return this;
    }

    /*
     * sorter 专用处理
     */
    sort(field = "", isAsc = true, appendOnly = false) {
        const queryRef = this.query;
        if (!queryRef.sorter) {
            queryRef.sorter = [];
        }
        /*
         * 单参数
         */
        if (1 === arguments.length) {
            if (U.isArray(field)) {
                queryRef.sorter = [];
            }
        } else {
            if ("string" === typeof field) {
                const sortItem = `${field},${isAsc ? "ASC" : "DESC"}`;
                if (!appendOnly) {
                    queryRef.sorter = [];
                }
                queryRef.sorter.push(sortItem);
            }
        }
        return this;
    }

    /*
     * criteria 查询条件专用
     */
    criteria(filters = {}) {
        /*
         * 计算默认值
         */
        let connector = "OR";
        if (filters.hasOwnProperty("")) {
            const isAnd = filters[""];
            connector = isAnd ? "AND" : "OR";
        }

        if (!Ux.isEmpty(filters)) {
            // 新的 Query
            this.query = Ux.aiCriteria(this.query, filters, connector);
        }
        return this;
    }

    to() {
        return this.query;
    }
}

export default ExQuery;