import React from 'react';
import {Checkbox, Col, Input, Row} from 'antd';
import Op from './Op';
import {component} from "../../_internal";
import Ux from 'ux';

/**
 * ## 「组件」`SearchInput`
 *
 * 搜索专用输入
 *
 * ```js
 * import { SearchInput } from 'web';
 * ```
 *
 * ### 0. 示例
 *
 * ```json
 * {
 *      "metadata":"contactName,联系人,12,,aiSearchInput",
 *      "optionJsx.layout":{
 *          "left": 14,
 *          "right": 10
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
 * |config|layout|props|Object|左右布局信息，左边输入框，右边Checkbox。|
 * |$data||state|Object|构造的查询条件信息。|
 *
 * ### 3. 组件核心点
 *
 * 查询条件支持两种：
 *
 * * 模糊匹配：`op值c`。
 * * 精确匹配：`op值=`。
 *
 * @memberOf module:web-input
 * @method SearchInput
 */
// =====================================================
// componentInit/componentUp
// =====================================================
@component({
    "i18n.cab": require('./Cab.json'),
    "i18n.name": "UI",
    state: {
        $data: {}
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
        const {reference, layout = {}, ...rest} = this.props;

        const {$data = {}} = this.state;
        const cab = Ux.sexCab(this, "config");
        if (Ux.isEmpty(layout)) {
            layout.left = 16;
            layout.right = 8;
        }
        return (
            <Input.Group {...rest}>
                <Row>
                    <Col span={layout.left}>
                        <Input value={$data.text} type={"compact"}
                               onChange={Op.onChange(this)}/>
                    </Col>
                    <Col span={layout.right} style={{
                        paddingTop: 5,
                        textAlign: "left"
                    }}>
                        &nbsp;&nbsp;
                        <Checkbox checked={"=" === $data.op}
                                  onChange={Op.onChecked(this)}/>
                        &nbsp;&nbsp;
                        {cab.checkbox ? cab.checkbox : ""}
                    </Col>
                </Row>
            </Input.Group>
        );
    }
}

export default Component;