import Ux from 'ux';

export default (reference) => ({
    monitorContainer: {
        /*
         * - ticket：关联工单
         * - bpmn：流程信息（必须）
         * - linkageAttachment      - 关联附件
         * - linkageAsset           - 关联资产
         * - linkageEmployee        - 关联员工
         */
        koTab: ($items = []) => {
            const {$workflow = {}} = reference.props;
            const {config = {}} = $workflow;
            const linkageMap = config.linkage ? config.linkage : {};
            // 默认 key 值
            const enabled = [
                "ticket",                   // 主单据
                "bpmn",                     // 流程图
                "linkageAttachment",        // 附件
            ]
            const {linkage = []} = config.ui ? config.ui : {};
            linkage.forEach(name => {
                if (linkageMap.hasOwnProperty(name)) {
                    enabled.push(name);
                }
            })
            const normalized = [];
            enabled.forEach(item => {
                const found = Ux.elementUnique($items, 'key', item);
                if (found) {
                    normalized.push(found);
                }
            })
            return normalized;
        }
    }
})