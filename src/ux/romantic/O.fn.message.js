import Cmn from "./I.common";
import Abs from "../abyss";
import {message} from "antd";

export default (reference, key = "") => {
    const seek = Cmn.cabModal(reference, key);
    if (Abs.isObject(seek)) {
        const {type, ...config} = seek;
        message.destroy();
        message.config({maxCount: 1});
        if ("error" === type) {
            message.error(config.content, 1.2);
        } else if ("success" === type) {
            message.success(config.content, 1.2);
        }
    } else {
        console.error("[ Ox ] 缺少窗口配置：_modal 或者配置解析出错！")
    }
}