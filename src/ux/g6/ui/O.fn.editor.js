export default (reference) => {
    const {$gEvent} = reference.props;
    if ($gEvent) {
        // 执行初始化流程
        $gEvent.initialize();
        // 执行事件绑定（独立方法）

        // 初始化执行完成过后就可以返回了
        return $gEvent.g6Graph();
    } else {
        throw new Error("对不起，属性中不包含 $gEvent 变量！！");
    }
}