import Ux from 'ux';

export default (reference) => {
    /*
     * 基础流程规范，属性中必须包含 $workflow
     * {
     *      "parameter":
     * }
     */
    const {config = {}} = reference.props;
    return ({
        // 读取流程详细信息
        processDefinition: (state) => {
            // 是否 multiple，如果 multiple 则直接返回
            if (config.multiple) {
                return Ux.promise(state);
            }
            const {parameter = {}} = config;
            if (!parameter.code) {
                console.error("对不起，您的参数中缺乏 `code` 参数！", parameter);
                return Ux.promise(state);
            }
            // 读取流程并加载
            return Ux.ajaxGet("/api/up/workflow/:code", parameter)
                .then(response => {
                    // 单参数 state
                    if (state) {
                        return Ux.promise(state, "$workflow", response);
                    } else {
                        // 无参数
                        return Ux.promise(response);
                    }
                })
        },
        // 提交之前的流程开启
        startPre: (state) => {

        }
    })
}