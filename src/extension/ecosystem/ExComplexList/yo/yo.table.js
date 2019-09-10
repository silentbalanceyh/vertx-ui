import Ex from 'ex';

export default (reference) => {
    const inherit = Ex.yoList(reference);
    /*
     * 配置数据
     */
    const state = reference.state;
    const {table = {}, $terms = {}} = state;
    inherit.config = table;
    /*
     * 是否支持批量
     */
    const {op = {}} = reference.state;
    const counter = Object.keys(op)
        .filter(opKey => opKey.startsWith('op.batch')).length;
    inherit.$batch = 0 < counter;
    /*
     * 是否 dirty
     */
    const {$dirty = false, $loading = false} = state;
    inherit.$dirty = $dirty;
    inherit.$loading = $loading;
    /*
     * 列过滤信息
     */
    inherit.$terms = $terms;
    return inherit;
}