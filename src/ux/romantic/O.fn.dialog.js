import Abs from '../abyss';
import {Modal} from 'antd';
import Cmn from './I.common';

export default (reference, key = "", callback) => {
    const seek = Cmn.cabModal(reference, key);
    if (Abs.isObject(seek)) {
        const {type, ...config} = seek;
        if ("error" === type) {
            Modal.error(config);
        } else if ("success" === type) {
            Modal.success(config);
        } else if ("confirm" === type) {
            Modal.confirm({
                ...config,
                onOk: callback
            })
        }
    } else {
        console.error("[ Ox ] 缺少窗口配置：_modal 或者配置解析出错！")
    }
}