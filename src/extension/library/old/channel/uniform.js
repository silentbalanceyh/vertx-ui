/*
 * 统一继承处理函数
 */
const yoUniform = (reference) => {
    /*
     * $op 继承，$options 继承
     */
    const {$op = {}, $options = {}} = reference.props;
    return {$op, $options}
};
export default {
    yoUniform
}