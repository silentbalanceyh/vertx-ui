import Ux from "ux";
import Event from "../event";
// 跳级处理
import I from '../ajax';

const authRow = (datum = [], original = {}, config = {}) => {
    if ("SINGLE" === config.type) {
        // 单行过滤处理
        const field = config.field;
        const {mapping = {}} = config;
        let $source = Ux.clone(datum);
        if (!Ux.isEmpty(mapping)) {
            $source.forEach(record => Ux.itObject(mapping, (from, to) => {
                if (record[from]) {
                    record[to] = record[from];
                }
            }))
        }
        const originalRows = original[field];
        if (originalRows) {
            // 计算原始选择行和 selectedKeys
            const $keys = Ux.immutable(originalRows);
            const rows = $source.filter(item => $keys.contains(item[field]));
            return {
                keys: rows.map(row => row.key),
                rows,
            }
        }
    } else {
        // 非 SINGLE 部分的配置信息
    }
}
const authCriteria = (datum = [], config = {}, grouped) => {

}
const authProjection = (datum = [], config = {}, grouped) => {

}
const authBind = (input, grouped, executor) => {
    return (state = {}, source) => {
        if (input && input.datum) {
            const {datum, ...rest} = input;
            const calculated = executor(source, datum, {
                ...rest,
                grouped
            })
            if (calculated) {
                Object.assign(state, calculated);
            }
        }
    }
}
/**
 *
 * @memberOf module:_kernel
 * @param source
 * @param config
 * @param grouped
 * @returns {{}}
 */
const authKeySet = (source = [], config = {}, grouped = {}) => {
    const {rows, projection, criteria} = config;
    /*
     * 提取不同的数据信息
     */
    const data = {};
    authBind(rows, grouped, authRow)(data, source);
    authBind(criteria, grouped, authCriteria)(data, source);
    authBind(projection, grouped, authProjection)(data, source);
    return data;
}
/**
 *
 * @memberOf module:_kernel
 */
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
/**
 *
 * @memberOf module:_kernel
 * @param params
 * @returns {*}
 */
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
/**
 *
 * @memberOf module:_kernel
 * @param configuration
 * @param items
 * @param views
 * @returns {{data: {segment: {}}, config: {}, selected: Set<any>}}
 */
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
/**
 *
 * @memberOf module:_kernel
 * @param reference
 * @param selected
 * @param fnEvent
 * @returns {Object}
 */
const authRequest = (reference, selected = [], fnEvent = event => event) => {
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

const treeSlash = (permissions = [], type = {}) => {
    /*
     * name = x/y/z
     * 转换成树 x - y - z
     */
    let normalized = [];

    const unslashed = permissions.filter(each => 0 > each.name.indexOf('/'));
    if (0 < unslashed.length) {
        const grouped = Ux.elementGroup(unslashed, "name");
        Object.keys(grouped).forEach(name => {
            const dataItem = {};
            dataItem.key = Ux.encryptMD5(name);

            const dataPart = grouped[name];
            const counter = dataPart.length;
            dataItem.text = `${name} （${counter}）`;
            dataItem.dataType = type.key;
            dataItem.dataCode = dataPart.map(item => item.code);
            dataItem.dataName = name;
            dataItem.name = name;
            normalized.push(dataItem);
        })
    }

    const slashed = permissions.filter(each => 0 <= each.name.indexOf('/'));
    if (0 < slashed.length) {
        /*
         * 先执行 compress 压缩
         */
        const grouped = Ux.elementGroup(slashed, "name");
        /*
         * 补充、扩展、排序
         */
        const treeArray = Ux.toTreeTextArray(Object.keys(grouped));
        /*
         * 填充数据信息
         */
        treeArray.forEach(item => {
            const data = grouped[item.dataKey];
            const counter = data ? data.length : 0;
            const append = {};
            if (data && 0 < data.length) {
                /*
                 * 追加数据节点
                 */
                append.dataType = type.key;
                append.dataCode = data.map(item => item.code);
                append.dataName = item.dataKey;
                append.text = `${item.name} （${counter}）`;
            } else {
                /*
                 * append.selectable = false
                 */
                append.text = item.name;
                append.selectable = false;
                append.checkable = false;
            }
            Object.assign(item, append);
        });
        normalized = normalized.concat(treeArray);
    }
    return Ux.toTree(normalized, {title: 'text'});
}
/*
 * ## 扩展函数
 *
 * 1. 根据传入的 treeData 提取 resource.tree 构造分类
 * 2. 读取远程的权限组，权限组挂在分类下边
 */

/**
 *
 * @memberOf module:_kernel
 * @param state
 * @param types
 * @returns {*}
 */
const authGroups = (state = {}, types = []) => {
    /* 权限组读取 */
    return Ux.ajaxGet("/api/permission/groups/by/sigma", {}).then(groups => {
        /*
         * 新版直接走 S_PERM_SET 的树形结构
         * 一级：module
         * 二级：name，带权限数量处理
         */
        const groupType = Ux.elementGroup(groups, "type");
        /*
         * 一级树处理
         */
        const treeData = [];
        types.forEach(type => {
            /*
             * 一级构造
             */
            const treeItem = {};
            treeItem.key = type.key;
            treeItem.title = type.name;
            const permissions = groupType[type.key];
            if (Ux.isArray(permissions)) {
                /*
                 * 构造二级以下的树结构
                 */
                treeItem.children = treeSlash(permissions, type);
            }
            treeData.push(treeItem);
        })
        state.$tree = treeData.sort(Ux.sorterAscFn("title"));     // 左树处理
        state.$treeData = groups;

        return Ux.promise(state);
    })
}
/*
 *
 * ## 扩展函数
 *
 * 1. 直接读取 resource.tree 中的内容
 * 2. 遇到 ID:XXX 需要执行判断，进行深度树的二次读取
 * 3. 最终构造完成的树形数组（parentId一致）
 */
/**
 * @memberOf module:_kernel
 * @param state
 * @returns {Promise<*>}
 */
const authTreeRes = (state = {}) => {
    /* resource.tree */
    return I.forest("resource.tree").then(response => {
        state.$treeData = response;
        state.$tree = Ux.toTree(response, {
            title: "name"
        });
        return Ux.promise(state);
    })
}
export default {
    authGroups,
    authTreeRes,
    authRule,
    authTpl,
    authData,
    authKeySet,
    authRequest,
}