import Ux from 'ux';

export default {
    /*
     * 基础数据部分
     */
    dataField: (normalized = {}, data = {}) => {
        normalized.width = Ux.valuePath(data, "optionItem.style.width");
        normalized.label = Ux.valuePath(data, "optionItem.label");
        normalized.placeholder = Ux.valuePath(data, "optionJsx.placeholder");
        if ("aiTitle" === normalized) {
            normalized.field = Ux.valuePath(data, "title");
        } else {
            normalized.field = Ux.valuePath(data, "field");
        }
    }
}