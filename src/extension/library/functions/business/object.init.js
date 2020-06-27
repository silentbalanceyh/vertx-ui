import Ajax from '../../ajax';


const company = (reference) => () => {
    reference.setState({$ready: false});
    Ajax.company().then($inited => reference.setState({
        $ready: true, $inited
    })).catch($error => reference.setState({$ready: true, $error}))
};
/**
 * ## 扩展函数
 *
 * 根据 `reference` 执行初始化
 *
 * ```json
 * {
 *     "company": () => Promise
 * }
 * ```
 *
 * ### 函数说明
 *
 * | 函数名 | 说明 |
 * |:---|:---|
 * | company | 企业信息初始化 |
 *
 * @memberOf module:_business
 * @method init
 * @param {ReactComponent} reference React对应组件引用
 * @returns {Object} 返回最终数据
 */
export default (reference) => ({
    /*
     * 企业信息读取，两个地方需要用到
     * 1）企业信息管理：/organization/company
     * 2）企业信息查看：/personal/company
     */
    company: company(reference)
})