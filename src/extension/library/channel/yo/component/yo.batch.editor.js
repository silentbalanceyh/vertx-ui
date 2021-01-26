/*
 * List 组件中的 ExBatchEditor 处理
 */
export default (batch, reference) => {
    const {config = []} = batch;
    const buttonRef = config.filter(item => "op.batch.edit" === item.category)[0];
    if (buttonRef) {
        /*
         * 抽取列信息
         */
        const {$columns = [], $columnsMy = []} = reference.state;

        /*
         * 抽取配置信息，直接从引用入手，需要修改引用
         */
        const {component = {}} = buttonRef;
        const editorRef = component.config;

        /*
         * 计算最新的配置
         * ExBatchEditor 中的配置必须存在于 columns 中
         * 1）检查是否全部存在于 columns
         * 2）如果不存在于 columns 中，则想办法移除
         * 直接加入 rxFilter 方法，让内置可以直接过滤
         */
        editorRef.$columns = $columns;
        editorRef.$columnsMy = $columnsMy;
    }
    return batch;
}