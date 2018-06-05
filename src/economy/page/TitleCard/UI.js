import React from 'react'
import {Card} from 'antd';
import Ux from 'ux';

/**
 * 基本要求：
 * reference为父引用，和该组件绑定的资源文件必须包含：
 * {
 *      "_topbar":{
 *          "title":"标题文字"
 *      }
 * }
 */
class Component extends React.PureComponent {
    render() {
        const {children, reference, card = 'page-card'} = this.props;
        const topbar = Ux.fromHoc(reference, "topbar");
        return (
            <Card className={card} bordered={false}
                  title={topbar ? topbar.title : ""}>
                {children}
            </Card>
        )
    }
}

export default Component;