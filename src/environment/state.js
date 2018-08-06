import {DataLabor} from "../entity/index";

export default {
    // 数据节点State状态信息
    datum: {},
    // 应用程序配置数据信息
    app: DataLabor.getObject(undefined),
    // 用户数据
    user: DataLabor.getObject(undefined)
};
