import Immutable from "immutable";

export default name => {
    try {
        // 计算目录和文件
        const language = process.env.$LANG ? process.env.$LANG : "cn";
        const shared = require("./" + language + "/shared.json");
        // 组件资源文件
        const component = require("./" + language + "/" + name + ".json");
        // 打印当前组件的目录
        let $data = Immutable.fromJS({});
        if (shared) $data = $data.mergeDeep(shared);
        if (component) $data = $data.mergeDeep(component);
        return $data.toJS();
    } catch (error) {
        console.error(error);
    }
};
