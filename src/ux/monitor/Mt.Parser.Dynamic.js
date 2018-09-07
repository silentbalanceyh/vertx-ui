import Cv from "../Ux.Constant";
import Store from "../system";

const datumPointer = (uri = "") => {
    const vector = {};
    vector.name = uri;
    vector.color = "#666";
    // 读取数据
    const key = Cv.KEY_POINTER;
    const data = Store.Session.get(key);
    vector.children = [];
    Object.keys(data).filter(key => "undefined" !== key)
        .forEach(key => {
            const dataItem = data[key];
            // 读取当前节点
            const item = {};
            item.name = dataItem.key;
            if (item.name.startsWith("_dynamic_")) {
                item.color = "#939";
            } else {
                item.color = "#36c";
            }
            // 文字节点
            const itemText = {};
            itemText.color = "#9c9";
            if ("" === dataItem.text) {
                if (dataItem.hasOwnProperty("icon")) {
                    itemText.name = "icon : " + dataItem.icon;
                } else {
                    itemText.name = "（EMPTY）";
                }
            } else {
                if (dataItem.hasOwnProperty("icon")) {
                    itemText.name = "icon : " + dataItem.icon;
                } else {
                    itemText.name = dataItem.text;
                }
            }
            // 连接点节点
            const target = {};
            target.name = dataItem.to;
            target.color = "#f66";
            // 连接配置
            itemText.children = [target];
            item.children = [itemText];
            vector.children.push(item);
        });
    return {
        items: vector,
        layout: {
            height: 40 + vector.children.length * 40,
            hgap: 100,
            vgap: 10
        }
    }
};
export default {
    datumPointer
}