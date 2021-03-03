import React from 'react';
import Ux from 'ux';
import Op from './Op';
import {Input, Transfer} from 'antd';
import './Cab.less';

/**
 * ## 「组件」`CheckTransfer`
 *
 * Transfer穿梭框
 *
 * ```js
 * import { CheckTransfer } from 'web';
 * ```
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |x|Ok|Ok|
 *
 * ### 2. 属性说明
 *
 * 该属性说明位于`optionJsx.config`节点中，即`jsx`中的`config`对象信息。
 *
 * |属性名|二级属性|源|类型|说明|
 * |:---|---|:---|:---|:---|
 * |value||props|Array|Ant Form给当前组件传入的值，表示选中的值。|
 * |config|valueKey|props|String|取值的字段信息，默认为`key`。|
 * |config|limit|props|Object|选择项限制信息，用于验证，如果选择项目过多会提示错误信息。|
 * |$source||props|Array|穿梭框中可选择的数据源信息。|
 * |$transfer|onChange|state|Function|改变值时的操作。|
 * |$transfer|onSelectChange|state|Function|选中选项时的回调函数，执行选择。|
 * |$transfer|render|state|Function|`<Transfer/>`中的render渲染函数设置。|
 * |$sourceKeys||state|Array|选择过程中的源选择值。|
 * |$targetKeys||state|Array|选择过程中的目标选择值。|
 * |$ready||state|Boolean|标识当前组件已经加载完成。|
 *
 * ### 3. 选项设置
 *
 * #### 3.1. dataSource数据格式如：
 *
 * ```json
 * {
 *     "key": "数据记录键",
 *     "title": "标题",
 *     "description": "描述信息",
 *     "disabled": "禁用/启用"
 * }
 * ```
 *
 * #### 3.2. limit数据结构
 *
 * ```json
 * {
 *     "max": "最大选项数"，
 *     "message": "验证错误信息"
 * }
 * ```
 *
 * 如果选项超过了`max`的限制，则显示错误消息，调用`Ux.messageFailure`函数显示错误信息。
 *
 * @memberOf module:web-input
 * @method CheckTransfer
 */
// =====================================================
// componentInit/componentUp
// =====================================================
const componentInit = (reference) => {
    const state = {};
    const {config = {}} = reference.props;
    // state.$source = $source;
    /*
     * 抽取 jsx 数据（除开 onChange）
     */
    const {...rest} = config;
    const $transfer = Ux.clone(rest);

    $transfer.onChange = Op.onChange(reference, config);
    $transfer.onSelectChange = Op.onChangeSelect(reference, config);
    /*
     * 处理可选择的 key
     */
    // $transfer.targetKeys = $source.map(item => item.key);
    $transfer.render = (item) => item.label;
    // $transfer.dataSource = $source;
    state.$transfer = $transfer;
    state.$ready = true;
    // state.$sourceKeys = $source.map(item => item.key);
    reference.setState(state);
}
const componentUp = (reference, {prevState, prevProps}) => {
    /*
     * 判断重置专用方法
     */
    Ux.xtReset(reference, {props: prevProps, state: prevState}, ($targetKeys) => {
        /*
         * values 是初始值
         */
        reference.setState({$targetKeys});
    })
};

class Component extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = Ux.xtInitArray(props, true);
    }

    componentDidMount() {
        componentInit(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        componentUp(this, {prevProps, prevState});
    }

    render() {
        return Ux.xtReady(this, () => {
            const {$transfer = {}} = this.state;
            const {$source = [], value = [], config, ...rest} = this.props;
            const {valueKey = "key"} = config;
            /*
             * targetKeys
             * selectedKeys
             */
            const {$sourceKeys = []} = this.state;
            return (
                <Input.Group {...rest} className={"web-transfer"}>
                    <Transfer {...$transfer} dataSource={$source}
                              rowKey={$source => $source[valueKey]}
                              selectedKeys={$sourceKeys}
                              targetKeys={value}/>
                </Input.Group>
            )
        });
    }
}

export default Component;
