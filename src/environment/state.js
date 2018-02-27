import { DataLabor } from "../entity/index";

export default {
    // 数据节点State状态信息
    datum : {
        hotel : DataLabor.getObject(undefined)
    },
    // 应用程序配置数据信息
    app : DataLabor.getObject(undefined)
};
