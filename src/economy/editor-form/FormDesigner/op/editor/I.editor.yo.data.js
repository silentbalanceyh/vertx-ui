import Ux from 'ux';

export default {
    /*
     * 配置数据专用
     */
    yoDataIn: (data = {}, reference) => {
        const message = Ux.fromHoc(reference, "message");
        const {optionItem = {}} = data;
        /* 初始化 */
        const $inited = {};
        {
            // 外层输入的标签信息
            if (optionItem.label &&
                message.label !== optionItem.label) {
                $inited.label = optionItem.label;
            }
        }
        return $inited;
    },
    yoDataOut: (params = {}, reference) => {

    }
}