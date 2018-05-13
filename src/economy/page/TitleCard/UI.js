import React from 'react'
import {Card} from 'antd';
import Ux from 'ux';
import TopBar from '../../header/TopBar/UI';

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
        const {children, reference} = this.props;
        const topbar = Ux.fromHoc(reference, "topbar");
        return (
            <Card className={"page-card"} bordered={false}
                  title={(
                      <TopBar $title={topbar ? topbar.title : ""}/>
                  )}>
                {children}
            </Card>
        )
    }
}

export default Component;