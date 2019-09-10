import moment from "moment";

/**
 * 设置Ant Design中组件的属性：
 * * DatePicker组件设置`disabledDate`属性；
 * @method propFromNow
 * @param current 当前组件的输入值
 * @example
 *
 *      // 设置disabledDate专用属性
 *      arriveTime: (reference, jsx = {}) => {
 *          jsx.disabledDate = Ux.propFromNow;
 *          jsx.onChange = Op.dependByArriveTime(reference);
 *          return (
 *              <DatePicker {...jsx} />
 *          )
 *      },
 */
const propFromNow = (current) => {
    return (current && current.format("YYYY-MM-DD") < moment().format("YYYY-MM-DD"));
};
/**
 * @class Attribute
 * @description Jsx中的组件属性专用绑定
 */
export default {
    propFromNow
};
