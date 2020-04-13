import Ux from 'ux';

export default (reference, key) => {
    const query = {};
    /*
     * 读取 editConfig
     */
    const {config = {}} = reference.props;
    const {editConfig = {}, relation = {}} = config;
    if (editConfig) {
        /*
         * 提取 condition 中的条件
         */
        const {condition = {}} = editConfig;
        /*
         * 提取 status 的信息
         */
        const {status = {}, ...rest} = condition;
        const criteria = {};
        criteria[""] = true;
        Object.assign(criteria, rest);
        /*
         * 状态处理
         */
        if (status.source && Ux.isArray(status.code)) {
            const $codes = Ux.immutable(status.code);
            const condStatus = Ux.onDatum(reference, status.source);
            if (0 < condStatus.length) {
                const keys = condStatus.filter(item => $codes.contains(item.code))
                    .map(item => item.key);
                if (0 < keys.length) {
                    criteria['status,i'] = keys;
                }
            }
        }
        /*
         * 提取 Tab 影响的状态信息，此时不考虑 data 部分的查询条件
         * 因为只有编辑状态下才会使用这个地方的添加选择，那么编辑状态都是走的定义而不是数据本身
         */
        let source = [];
        if (relation.source) {
            source = Ux.onDatum(reference, relation.source);
            if (0 < source.length) {
                const {$defineMap = {}} = reference.state;
                let ids = [];
                if ("up" === key) {
                    ids = $defineMap.up;
                } else {
                    ids = $defineMap.down;
                }
                const $ids = Ux.immutable(ids);
                /*
                 * 过滤
                 */
                const {$selectedCategory = []} = reference.state;
                let keys = [];
                if (0 < $selectedCategory.length) {
                    const $category = Ux.immutable($selectedCategory);
                    keys = source.filter(cat => $ids.contains(cat.identifier))
                        .filter(cat => $category.contains(cat.identifier))
                        .map(cat => cat.key);
                } else {
                    keys = source.filter(cat => $ids.contains(cat.identifier))
                        .map(cat => cat.key);
                }
                const {categoryField = []} = editConfig;
                const subset = {};
                categoryField.forEach(field => subset[`${field},i`] = keys);
                subset[""] = false;
                /*
                 * 条件描述追加
                 */
                criteria["$0"] = subset;
            }
        }
        {
            /*
             * key 的条件设置
             */
            const {$data = {}} = reference.state;
            let existing = [];
            if ("up" === key) {
                existing = $data.up.map(item => item.sourceGlobalId);
            } else {
                existing = $data.down.map(item => item.targetGlobalId);
            }
            if (0 < existing.length) {
                criteria[`globalId,!i`] = existing;
            }
        }
        /* 已确认条件 */
        criteria.confirmStatus = "confirmed";
        // console.info(criteria);
        query.criteria = criteria;
    }
    return query;
};