import Abs from '../../abyss';
import Dev from '../../develop';
import qrComplex from './O.fn.complex';
/*
 * 继承 Query 专用
 */
export default (reference) => {
    /*
     * 默认使用 reference.props 中的 $query 信息
     */
    const {$query} = reference.props;
    let defaultQuery = {};
    if ($query) {
        /*
         * props 属性中的 $query 优先
         */
        defaultQuery = Abs.clone($query);
    } else {
        /*
         * 直接从 state 属性中读取 query
         * 1）暂时用于 ComplexList
         */
        const seekQuery = reference.state ? reference.state.query : {};
        if (seekQuery) {
            defaultQuery = Abs.clone(seekQuery);
        }
    }
    Dev.dgQuery(reference, " qrInherit 继承参数");
    return qrComplex(defaultQuery, reference);
}