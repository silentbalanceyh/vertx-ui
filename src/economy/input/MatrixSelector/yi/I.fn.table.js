import Ux from "ux";

export default (reference, config = {}) => {
    const ref = Ux.onReference(reference, 1);
    const {table = {}} = config;
    const columns = Ux.configColumn(ref, table.columns ? table.columns : []);
    /*
     * table 中的 columns 注入
     */
    const rowSelection = {
        onChange: keys => {
            const {$data = []} = reference.state;
            if (0 < keys.length) {
                const $keySet = [];
                console.error($data);
            } else {
                // 反选
                reference.setState({$keySet: undefined});
            }
        }
    };
    return {columns, rowSelection}
}