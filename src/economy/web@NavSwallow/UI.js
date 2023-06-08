import React from 'react';


/**
 * ## 「组件」`NavSwallow`
 *
 *
 * ```js
 * import { NavSwallow } from 'web';
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
 * |$common||props|Boolean|是否普通模式。|
 * |$steps|title|props|Array|当前步骤的标题信息。|
 * |$current||props|Number|激活的当前步骤，从0开始，配合索引计算。|
 *
 * ### 3. 组件核心点
 *
 * #### 3.1. 特定className的值
 *
 * |$common属性|节点类型|className值|
 * |---|---|:---|
 * |true|开始节点|step start-common|
 * |true|中间节点|step-middle|
 * |true|结束节点|step-middle|
 * |false|开始节点|step|
 * |false|中间节点|step-middle|
 * |false|结束节点|step-end|
 * |无关|激活节点|step-active|
 *
 * @memberOf module:uca/economy
 * @method NavSwallow
 */
class Component extends React.PureComponent {
    render() {
        const {
            $steps = [],
            $current = 0,
            $common = true
        } = this.props;

        let startCls = `step ${$common ? `start-common` : ""}`;
        let endCls = $common ? `step-middle` : "start-end";
        return (
            <div className={"web-nav-swallow"}>
                {$steps.map((step, index) => {
                    let className = $current === index ? 'step-active' : '';
                    if (0 === index) {
                        // 起点
                        className = startCls + ' ' + className;
                    } else if (($steps.length - 1) === index) {
                        // 结束点
                        className = endCls + ' ' + className;
                    } else {
                        // 中间点
                        className = `step-middle ` + className;
                    }
                    return (
                        <div className={className} key={`step${index}`}>
                            {step.title}
                        </div>
                    )
                })}
            </div>
        )
    }
}

export default Component