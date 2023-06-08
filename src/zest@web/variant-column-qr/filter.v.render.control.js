import __Zn from './zero.uca.dependency';
import {_Ant} from "zo";
import dropSearch from './filter.dropdown.__.@fn.search';
import dropCommon from './filter.dropdown.__.@fn.common'
import __Sift from './filter.__.fn.sift.addon';

const renderSearch = (reference, column, config) => {
    /*
     * 1. 图标受控，处理颜色
     * 2. 重置按钮禁用（如果没有值则禁用）
     * 3. 确认 / 回车等处理
     */
    const configuration = {};
    configuration.icon = "search";
    configuration.field = column.dataIndex;
    column.filterIcon = __Sift.siftIcon(reference, configuration);
    column.filterDropdown = dropSearch(column, config, reference);
};
const __configDirect = (reference, column, config) => {
    // 下拉处理
    const options = [];
    // 也会得到 key, label, value
    const datum = _Ant.toOptions(reference, config);
    datum.forEach(each => options.push({
        label: each.label,
        value: each.value
    }));
    const configuration = {};
    configuration.icon = "filter";
    configuration.field = column.dataIndex;
    configuration.options = options;
    return configuration;
}
const renderDirect = (reference, column, config) => {
    if (__Zn.isEmpty(config)) {
        console.error(`[Err] type = DIRECT 的模式要求必须配置 config，没配置 config 节点`);
        return false;
    }
    const configuration = __configDirect(reference, column, config);
    column.filterIcon = __Sift.siftIcon(reference, configuration);
    column.filterDropdown = dropCommon(column, {
        ...config,
        options: configuration.options
    }, reference)
};
const __configDatum = (reference, column, config) => {
    // 下拉处理
    const {$datum} = column;
    let datumConfig = {};
    if ("string" === typeof $datum) {
        datumConfig = __Zn.parseSource($datum);
    } else {
        Object.assign(datumConfig, $datum);
    }
    // 选项处理
    const options = [];
    const datumData = _Ant.toOptions(reference, {datum: datumConfig});
    datumData.forEach(each => options.push({
        label: each.label,
        value: each.value,
    }));
    const configuration = {};
    configuration.icon = "tags";
    configuration.field = column.dataIndex;
    configuration.options = options;
    return configuration;
}
const renderDatum = (reference, column, config) => {
    if (__Zn.isEmpty(config)) {
        console.error(`[Err] type = DATUM 的模式要求必须配置 config，没配置 config 节点`);
        return false;
    }
    const configuration = __configDatum(reference, column, config);
    column.filterIcon = __Sift.siftIcon(reference, configuration);
    column.filterDropdown = dropCommon(column, {
        ...config,
        options: configuration.options
    }, reference)
}
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    /*
     * {
            "$filter.config.dataType": "BOOLEAN",
            "$filter.config.items": [
                "true,启用",
                "false,禁用"
            ],
            "$filter.config.button": {
                "yes": "确认",
                "reset": "重置"
            },
            "$filter.config.width": {
                "radio": 110,
                "button": 55
            }
     * }
     */
    DIRECT: renderDirect,
    /*
     * {
            "$filter.type": "SEARCH",
            "$filter.config": {
                "placeholder": "输入用户组名称",
                "button": {
                    "search": "搜索",
                    "reset": "重置"
                }
            }
     * }
     */
    SEARCH: renderSearch,
    /*
     * {
     *      "$filter.type": "DATUM",
            "$filter.config.button": {
                "yes": "确认",
                "reset": "重置"
            },
            "$datum": "必须"
     *
     * }
     */
    DATUM: renderDatum
}