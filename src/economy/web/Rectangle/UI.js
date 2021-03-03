import React from 'react';
import './Cab.less';

/**
 *
 * ## 「组件」`Rectangle`
 *
 * ```js
 * import { Rectangle } from 'web';
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
 * |属性名|二级属性|源|类型|说明|
 * |:---|---|:---|:---|:---|
 * |children||props|Jsx|React中专用的`children`子元素信息。|
 * |config||props|Object||
 * |config|title|props|String|`<fieldset/>`元素中的`legend`专用。|
 *
 * @memberOf module:web-component
 * @method * Rectangle
 */
class Component extends React.PureComponent {
    render() {
        const {config = {}, children} = this.props;
        return (
            <div className={"web-rectangle"}>
                <fieldset>
                    <legend>{config.title}</legend>
                    {children}
                </fieldset>
            </div>
        );
    }
}

export default Component;