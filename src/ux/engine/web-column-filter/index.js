import renderSearch from './I.fn.filter.search';
import renderDirect from './I.fn.filter.direct';

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
}