import moment from "moment";

/*
 * 设置Ant Design中组件的属性：
 * * DatePicker组件设置`disabledDate`属性；
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
export default {
    /*
     * 当前时间之前的时间不可用
     */
    propFromNow
};