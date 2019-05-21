import Ux from 'ux';
import U from 'underscore';

class Query {
    constructor(reference) {
        this.reference = reference;
    }

    init() {
        const {$query = {}} = this.reference.props;
        this.query = Ux.clone($query);
        return this;
    }

    size(size = 10) {
        if (size && this.query.pager) {
            const pager = this.query.pager;
            pager.size = size;
        }
        return this;
    }

    page(page = 1) {
        if (page && this.query.pager) {
            const pager = this.query.pager;
            pager.page = page;
        }
        return this;
    }

    criteria(filters = {}, connector = "AND") {
        if (!Ux.isEmpty(filters)) {
            // 新的 Query
            this.query = Ux.aiCriteria(this.query, filters, connector);
        }
        return this;
    }

    sort(field = "", isAsc = true) {
        const queryRef = this.query;
        if (!queryRef.sorter) {
            queryRef.sorter = [];
        }
        if (field) {
            if (U.isArray(field)) {
                queryRef.sorter = [];
            } else {
                const sortItem = `${field},${isAsc ? "ASC" : "DESC"}`;
                // 替换原始的
                queryRef.sorter = [];
                queryRef.sorter.push(sortItem);
            }
        }
        console.error(queryRef.sorter, field, isAsc);

        return this;
    }

    getSize() {
        const pager = this.query && this.query.pager ? this.query.pager : {};
        return pager.size ? pager.size : 10;
    }

    to() {
        return this.query;
    }
}

export default Query;