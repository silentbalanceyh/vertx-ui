import Ux from 'ux';

export default (reference, state = {}) => {
    const {$current = {}} = reference.props;
    if ($current) {
        return Ux.ajaxGet('/api/relation/definition/:category', {category: $current.key}).then(response => {
            const {$gEvent} = state;
            /*
             * 预处理 data计算 items
             * 数据结构：
             * {
             *      $data: {
             *          nodes: [],
             *          edges: []
             *      },
             *      $dropped: [],
             *      $items:
             * }
             * 三个变量含义：
             * -- $data，当前图的数据信息
             * -- $dropped，可拖拽的节点限制信息
             * -- $items：可选的 items（左边元素信息）
             */
            const data = {};
            if (response.graphic) {
                Object.assign(data, response.graphic);
            } else {
                if ($gEvent) {
                    data.nodes = [$gEvent.dataNode($current, true)];
                    data.edges = [];
                } else {
                    data.nodes = [];
                    data.edges = [];
                }
            }
            state.$data = data;
            /*
             * 提交必须要使用
             */
            return Ux.promise(state);
        })
    } else {
        throw new Error("当前组件要求必须传入 $current 属性！！")
    }
}