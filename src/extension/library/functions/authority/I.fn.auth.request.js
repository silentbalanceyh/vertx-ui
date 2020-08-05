import Ux from 'ux';
import Event from '../../event';

const outRows = (selectedData, rows) => {
    if (!Ux.isEmpty(rows)) {
        const {type, mapping = {}, ...rest} = rows;
        if ("SINGLE" === type) {
            const rows = {};
            /*
             * mapping 处理
             */
            let $source = Ux.clone(selectedData);
            if (!Ux.isEmpty(mapping)) {
                $source.forEach(item => Ux.itObject(mapping, (from, to) => {
                    if (item[from]) {
                        item[to] = item[from];
                    }
                }))
            }
            rows[rest.field] = Ux.elementVertical($source, rest.field);
            return JSON.stringify(rows);
        }
    }
}

const outCriteria = (selectedData, criteria, source) => {
    if (!Ux.isEmpty(criteria)) {
        /*
         * 算法所需的数据结构
         * data: {
         *      datum: 总数据,
         *      selected: 选择数据
         * },
         * config: {
         *      ...原始的 config 部分
         *      tpl: 最终输出模板
         * }
         */
        const {config = {}, tpl = {}} = criteria;
        const {algorithm, ...restConfig} = config;
        const executor = Event.acCriteria(algorithm);
        if (Ux.isFunction(executor)) {
            return executor({
                datum: source,
                selected: selectedData,
            }, {
                ...restConfig,
                tpl,
            })
        }
    }
}

export default (reference, selected = [], fnEvent = event => event) => {
    /*
     * 提取得到影响的资源 ID
     */
    const {config = {}, $owner = {}} = reference.props;
    const {$datum = []} = reference.state;
    const {event = {}} = config;
    const $selected = Ux.immutable(selected);
    const selectedData = $datum.filter(item => $selected.contains(item.key));
    const request = {
        $body: []
    };
    Object.assign(request, $owner);
    const $event = fnEvent(event);
    if (!Ux.isEmpty($event)) {
        /*
         * 解析结果处理
         */
        Object.keys($event).forEach(resourceId => {
            /*
             * 单独项
             */
            const item = $event[resourceId];
            const record = {};
            record.resourceId = resourceId;
            record.owner = $owner.ownerId;
            record.ownerType = $owner.ownerType;
            if (item.visitantData) {
                record.visitant = true;
                record.visitantData = item.visitantData;
            }
            /*
             * rows 计算
             */
            const rows = outRows(selectedData, item.rows);
            if (rows) record.rows = rows;
            /*
             * criteria 计算
             */
            const criteria = outCriteria(selectedData, item.criteria, $datum);
            if (criteria) record.criteria = criteria;
            /*
             * $app
             */
            const {$app} = reference.props;
            if ($app) {
                record.language = $app._("language");
                record.sigma = $app._("sigma");
            }
            request.$body.push(record);
        });
    }
    return request;
}