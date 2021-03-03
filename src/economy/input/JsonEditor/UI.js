import React from 'react';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/zh-cn';
import {Input} from 'antd';
import Ux from "ux";

/**
 * ## 「组件」`JsonEditor`
 *
 * 数组录入组件
 *
 * ```js
 * import { JsonEditor } from 'web';
 * ```
 *
 * ### 0. 示例
 *
 * ```json
 * {
 *      "metadata": "options,配置数据,24,,aiJsonEditor",
 *      "optionJsx.height": 220
 * }
 * ```
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |x|x|x|
 *
 * ### 2. 属性说明
 *
 * 该属性说明位于`optionJsx.config`节点中，即`jsx`中的`config`对象信息。
 *
 * |属性名|二级属性|源|类型|说明|
 * |:---|---|:---|:---|:---|
 * |value||props|Object|Ant Form给当前组件传入的值。|
 * |height||props|Number|当前Json编辑器的高度。|
 *
 * ### 3. 组件核心点
 *
 * （略）
 *
 * @memberOf module:web-input
 * @method JsonEditor
 */
// =====================================================
// componentInit/componentUp
// =====================================================
// =====================================================
// 事件处理
// =====================================================
const rxChange = (reference) => (content) => {
    const {onChange} = reference.props;
    if (Ux.isFunction(onChange)) {
        const body = content.jsObject;
        if (body) {
            onChange(body);
        }
    }
};

class Component extends React.PureComponent {

    render() {
        const {value = {}, height = 240} = this.props;
        return (
            <Input.Group {...this.props}>
                <JSONInput id={"content"} locale={locale}
                           height={height}
                           onChange={rxChange(this)}
                           placeholder={value}
                           waitAfterKeyPress={1000}
                           theme={"light_mitsuketa_tribute"}
                           width={"100%"}/>
            </Input.Group>
        );
    }
}

export default Component;