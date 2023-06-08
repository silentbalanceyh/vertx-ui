import Immutable from "immutable";

export default name => {

    try {
        // 打印当前组件的目录
        let $data = Immutable.fromJS({});
        const language = process.env.$LANG ? process.env.$LANG : "cn";
        // 计算目录和文件
        const shared = require("./" + language + "/shared.json");
        if (shared) $data = $data.mergeDeep(shared);
        // 组件资源文件（文件名是否传入影响第二级加载）
        if (name) {
            const component = require("./" + language + "/" + name + ".json");
            if (component) $data = $data.mergeDeep(component);
        }
        return $data.toJS();
    } catch (error) {
        console.error(error);
    }
};
