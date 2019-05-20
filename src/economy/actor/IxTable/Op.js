import Table from "../Fx/Fx.Table";

const init = (ref) => {
    const {reference, $options = {}, $table = {}} = ref.props;
    /*
     * 准备 Table 的初始化状态
     */
    const table = Table.init(reference, $options, $table);
    ref.setState({table});
};
export default {
    init
};