import { DataLabor } from "../entity/index";

export default {
    // 酒店环境数据
    datum : {
        hotel : DataLabor.getObject()
    },
    // 应用程序数据
    app : DataLabor.getObject()
};
