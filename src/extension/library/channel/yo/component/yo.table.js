import yoList from '../yo.list';

const isBatchEnabled = (reference) => {
    const {op = {}} = reference.state;
    let counter = 0;
    Object.keys(op).forEach(opKey => {
        if (opKey.startsWith('op.batch')) {
            counter += 1;
        } else if (opKey.startsWith("op.extension")) {
            const button = op[opKey];
            const region = button.region ? button.region : "";
            if (region.startsWith("op.batch")) {
                counter += 1;
            }
        }
    });
    return 0 < counter;
};

export default (reference) => {
    const inherit = yoList(reference);
    /*
     * 配置数据
     */
    const state = reference.state;
    const {table = {}, $terms = {}} = state;
    inherit.config = table;
    /*
     * 是否支持批量
     */
    const {plugins = {}} = reference.state;
    inherit.$batch = isBatchEnabled(reference);
    inherit.$plugins = plugins;
    /*
     * 是否 dirty
     */
    const {$dirty = false, $loading = false, $dirtyAsync = false} = state;
    inherit.$dirty = $dirty;
    inherit.$loading = $loading;
    inherit.$dirtyAsync = $dirtyAsync;
    /*
     * 列过滤信息
     */
    inherit.$terms = $terms;
    return inherit;
}