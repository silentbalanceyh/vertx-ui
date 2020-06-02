const configDesiger = (reference, config = {}) => {

}
/**
 * ## 引擎函数
 *
 * 「标准配置」表单中的字段标准处理方法
 *
 * @memberOf module:_config
 * @param {Object} config 传入的表单本身配置
 * @param {Object} cell 表单字段核心配置，默认 {}
 * @return {Object} 配置规范化完成后的Form数据。
 */
const configField = (config, cell = {}) => {
    // 第一次解析
    console.info(config, cell);
}
export default {
    configDesiger,
    configField,
}