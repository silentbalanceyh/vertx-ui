import React from 'react';
import {component} from "../../_internal";
import Op from './Op';
import Ux from "ux";
import {Input} from 'antd';
import renderJsx from './Web';

/**
 * ## 「组件」`SearchRangeDate`
 *
 *
 * 搜索专用输入
 *
 * ```js
 * import { SearchRangeDate } from 'web';
 * ```
 *
 * ### 0. 示例
 *
 * ```json
 * {
 *      "metadata":"infoAt,日志记录时间,24,,aiSearchRangeDate",
 *      "optionJsx.config":{
 *          "mode":"FULL",
 *          "format":"YYYY-MM-DD HH:mm",
 *          "placeholder":["开始时间","结束时间"]
 *      }
 * }
 * ```
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |Ok|Ok|Ok|
 *
 * ### 2. 属性说明
 *
 * 该属性说明位于`optionJsx.config`节点中，即`jsx`中的`config`对象信息。
 *
 * |属性名|二级属性|源|类型|说明|
 * |:---|---|:---|:---|:---|
 * |value||props|Object|Ant Form给当前组件传入的值。|
 * |config|format|props|String|时间格式专用数据信息。|
 * |config|mode|props|String|查询条件的模式。|
 * |config|placeholder|props|Array|水印效果，左水印和右水印，长度为2的数组。|
 * |config|grid|props|Array|左中右的`span`值，默认`11,2,11`。|
 * |config|style|props|Object|左风格left，右风格right。|
 * |$data|start|state|Moment|开始时间。|
 * |$data|end|state|Moment|结束时间。|
 *
 * ### 3. 组件核心点。
 *
 * #### 3.1. 关于模式
 *
 * mode的值如下：
 *
 * * FULL：全模式，设置showTime = true。
 * * DATE：日期模式，关闭showTime = false。
 * * MONTH：月份模式，设置只选择月份。
 * * TIME：时间模式（开发中）。
 *
 * #### 3.2. 日期时间
 *
 * 日期和时间格式全部使用Moment类型。
 *
 * @memberOf module:web-input
 * @method SearchRangeDate
 */
// =====================================================
// componentInit/componentUp
// =====================================================
@component({
    "i18n.cab": require('./Cab.json'),
    "i18n.name": "UI",
    state: {
        $data: {
            start: null,
            end: null
        }
    }
})
class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiDefault(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        Ux.xtReset(this, {props: prevProps, state: prevState},
            (value) => Op.yiValue(this, value));
    }

    render() {
        const {reference, config = {}, ...rest} = this.props;
        /*
         * mode 选择
         */
        const {mode = "FULL"} = config;
        const {value = {}} = this.props;
        return (
            <Input.Group {...rest} className={"web-range-date"}>
                {renderJsx(this, mode, value)}
            </Input.Group>
        );
    }
}

export default Component;