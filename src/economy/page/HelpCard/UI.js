import React from 'react'
import {Card, Steps} from 'antd';
import Ux from 'ux';

/**
 * 基本要求：
 * reference为父引用，和该组件绑定的资源文件必须包含：
 * {
 *      "_topbar":{
 *          "title":"标题文字",
 *          "step":{
 *              "active":1,
 *              "items":[
 *              ]
 *          }
 *      }
 * }
 */
class Component extends React.PureComponent {
    render() {
        const {children, reference} = this.props;
        const topbar = Ux.fromHoc(reference, "topbar");
        const attrs = {};
        attrs.title = topbar ? topbar.title : "";
        attrs.bordered = false;
        if (topbar.step && topbar.step.items) {
            const current = topbar.step.current;
            const size = topbar.step.size ? topbar.step.size : "small";
            attrs.extra = (
                <Steps current={current} size={size}>
                    {topbar.step.items.map(item => <Steps.Step {...item}/>)}
                </Steps>
            )
        }
        return (
            <Card className={"page-card"} {...attrs}>
                {children}
            </Card>
        )
    }
}

export default Component;