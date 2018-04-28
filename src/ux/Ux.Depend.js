import Prop from './Ux.Prop'

/**
 * 处理关联字段的只读数据信息，该reference必须是Ant Design中的Form相关值
 * @method dependReadOnlyDatum
 * @param {ReactComponent} reference React对应组件引用
 * @param sourceKey 该sourceKey对应：Tabular/Assist专用的key值信息
 * @param filterFun 针对数据源处理的filter过滤函数信息，该过滤函数可将sourceKey结果Array处理掉
 * @param formField 依赖的Form中的字段值
 * @return {boolean}
 * @example
 *
 *      ...
 *      surety: (reference, jsx = {}) => {
 *          jsx.readOnly = Ux.dependReadOnlyDatum(
 *              reference,
 *              "surety.type",
 *              item => {
 *                  return "None" === item.code;
 *              },
 *              "suretyType"
 *          );
 *          // 是否删除placeholder
 *          if (jsx.readOnly) {
 *              delete jsx.placeholder;
 *          }
 *          return (<Input {...jsx} />)
 *      },
 */
const dependReadOnlyDatum = (reference, sourceKey, filterFun, formField) => {
    const items = Prop.onDatum(reference, sourceKey);
    let filtered = items.filter(filterFun);
    const {form} = reference.props;
    const current = form.getFieldValue(formField);
    filtered = filtered.filter(item => item.key === current);
    return 0 < filtered.length;
};
/**
 * @class Depend
 * @description 用于处理关联字段专用的雷，一般处理带依赖的字段数据
 */
export default {
    dependReadOnlyDatum
};
