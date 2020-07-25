import Ux from 'ux';

export default (reference, selected = []) => {
    /*
     * 提取得到影响的资源 ID
     */
    const {config = {}, $owner = {}} = reference.props;
    const {event = {}, datum = []} = config;
    const $selected = Ux.immutable(selected);
    const selectedData = datum.filter(item => $selected.contains(item.key));
    const request = {
        $body: []
    };
    Object.assign(request, $owner);
    if (!Ux.isEmpty(event)) {
        /*
         * 解析结果处理
         */
        Object.keys(event).forEach(resourceId => {
            /*
             * 单独项
             */
            const item = event[resourceId];
            const record = {};
            record.resourceId = resourceId;
            record.owner = $owner.ownerId;
            record.ownerType = $owner.ownerType;
            if (!Ux.isEmpty(item.rows)) {
                const {type, ...rest} = item.rows;
                if ("SINGLE" === type) {
                    const rows = {};
                    rows[rest.field] = Ux.elementVertical(selectedData, rest.field);
                    record.rows = JSON.stringify(rows);
                }
            }
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