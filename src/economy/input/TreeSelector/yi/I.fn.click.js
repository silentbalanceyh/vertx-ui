import Ux from "ux";

export default (reference, config = {}) => event => {
    // 常用的事件处理
    Ux.prevent(event);
    // 初始化数据
    reference.setState({
        $loading: true,             // 是否在加载
        $visible: true,             // 窗口是否显示
        $data: [],                  // 当前窗口的数据信息
        $select: undefined          // 在窗口中的选中项
    });
    /**
     * 解析Ajax参数信息
     */
    const params = Ux.xtLazyAjax(reference, config);
    const {engine = true} = config.ajax;
    Ux.asyncData(config.ajax, params,
        ($data) => {
            $data = Ux.clone($data);
            /*
             * 未使用查询引擎的情况，判断 config.exclude
             * 执行客户端过滤，一般选择父节点时候不允许选择当前节点
             */
            if (!engine && config.exclude) {
                const ref = Ux.onReference(reference, 1);
                const except = Ux.parseAjax(ref, {key: config.exclude});
                $data = $data.filter(item => except.key !== item.key);
            }
            reference.setState({
                $loading: false,
                $data
            });
        });
};