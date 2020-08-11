import Ux from 'ux';
import authKeySet from './I.fn.auth.extract';

const authRule = () => Ux.ajaxGet("/api/rules").then(rules => {
    /*
     * 构造界面数据
     */
    const normalized = [];
    if (Ux.isArray(rules)) {
        rules.forEach(rule => {
            const {
                uiConfig,
                uiCondition,
                groupConfig,
                groupCondition,
            } = rule;
            const ruleItem = {};
            ruleItem.name = rule.name;
            ruleItem.code = rule.code;
            ruleItem.key = rule.key;
            {
                const $uiConfig = {}
                if (rule.ui) ruleItem.ui = rule.ui;
                if (uiConfig) $uiConfig.config = Ux.clone(uiConfig);
                if (uiCondition) $uiConfig.condition = Ux.clone(uiCondition);
                ruleItem.uiConfig = $uiConfig;
            }
            {
                const $groupConfig = {};
                if (rule.group) ruleItem.group = rule.group;    // 分组配置
                if (groupConfig) $groupConfig.config = Ux.clone(groupConfig);
                if (groupCondition) $groupConfig.condition = Ux.clone(groupCondition);
                ruleItem.groupConfig = $groupConfig;
            }
            normalized.push(ruleItem);
        })
    }
    return Ux.promise(normalized);
})
const authTpl = (params = {}) => {
    return Ux.ajaxGet("/api/rule-items/rule/:key", {key: params.key}).then(result => {
        /*
         * 二次读取，用于抓取数据部分
         */
        const resourceIds = result.map(item => item['resourceId']);
        const {ownerId, ownerType} = params;
        const request = {};
        request.ownerId = ownerId;
        request.ownerType = ownerType;
        request.$body = resourceIds;
        return Ux.ajaxPost("/api/view/:ownerType/:ownerId", request).then((views = []) => {
            /*
             * 默认赋值 resourceId，换一种数据结构
             * {
             *      "definition": [
             *          "规则1",
             *          "规则2"
             *      ],
             *      "original": {
             *          "resourceId": {}
             *      }
             * }
             * original 为当前 ownerType + ownerId 读取到的原始数据信息
             */
            const state = {};
            state.items = result;
            state.views = views;
            return Ux.promise(state);
        });
    })
}
const authData = (configuration = {}, items = [], views = []) => {
    /*
     * 从 config 中提取定义的数据源信息
     * 1. items 为 Rule Item 的计算
     * 2. views 为当前角色拥有的视图处理
     * 两个变量按照资源进行链接
     */
    const {datum = []} = configuration;
    /*
     * 生成配置信息
     */
    const viewMap = Ux.elementMap(views, 'resourceId');
    const config = {};
    items.forEach(item => {
        const resourceId = item['resourceId'];
        /*
         * 读取配置定义，三个核心节点
         *
         * 1）rows 行定义
         * 2) criteria 条件
         * 3) projection 列定义
         */
        let rows = {};
        {
            const {rowType, rowField, rowTpl, rowTplMapping} = item;
            if (rowType) rows.type = rowType;
            if (rowField) rows.field = rowField;
            if (rowTpl) rows.tpl = rowTpl;
            if (rowTplMapping) rows.mapping = rowTplMapping;
        }
        const criteria = {};
        {
            const {condTpl, condConfig, condTplMapping} = item;
            if (condTpl) criteria.tpl = condTpl;
            if (condConfig) criteria.config = condConfig;
            if (condTplMapping) criteria.mapping = condTplMapping;
        }
        let projection = {};
        {
            const {colType, colConfig} = item;
            if (colType) projection.type = colType;
            if (colConfig) projection.config = colConfig;
        }
        if (viewMap[resourceId]) {
            const original = viewMap[resourceId];
            if (original.rows) rows.datum = original.rows;
            if (original.projection) projection.datum = original.projection;
            if (original.criteria) criteria.datum = original.criteria;
        }
        const configItem = {
            rows,
            criteria,
            projection
        }
        // 增加新维度（visitant）
        if (viewMap[resourceId]) {
            configItem.visitant = viewMap[resourceId].visitant;
        }
        config[resourceId] = configItem;
    });
    const segment = {};
    const selected = new Set();
    Object.keys(config).forEach(resourceId => {
        const calculated = authKeySet(datum, config[resourceId]);
        if (calculated.keys) {
            calculated.keys.forEach(key => selected.add(key));
        }
        segment[resourceId] = calculated;
    });
    /* 计算 keys */
    return {config, data: {segment}, selected};
}
export default {
    authRule,
    authTpl,
    authData,
    authKeySet,
}