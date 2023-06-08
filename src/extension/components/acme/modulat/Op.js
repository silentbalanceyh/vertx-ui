import Ux from 'ux';

export default {
    actions: (ref) => ({
        $opSaveArg: (reference) => (params = {}) => {
            const {$inited = {}} = reference.props;
            const request = Ux.valueSTDN({
                ...params,
                // 数据定义
                __metadata: $inited.__metadata,
            }, true);
            Ux.ajaxPut("/api/bag/config/:pKey", request).then(data => Ux.ajaxDialog(reference, {
                data,
                redux: true, // 启用 redux 提交
                key: "saved"
            })).then(stored => {
                const {$configKey} = ref.state;
                if ($configKey) {
                    Ux.storeModule(stored, $configKey);
                }
                return Ux.promise(stored);
            })
        }
    })
}