import React from 'react'
import {Card} from 'antd';
import Ux from 'ux';

/**
 * 基本要求：
 * reference为父引用，和该组件绑定的资源文件必须包含：
 * {
 *      "_topbar":{
 *          "title":"标题文字",
 *          "current":1
 *      }
 * }
 * current需要配合外置的$extra一起使用
 * $key用于解析配置文件
 * $extra用于设置额外的附加工具栏
 */
class Component extends React.PureComponent {
    render() {
        const {
            children, reference, card = 'page-card',
            $key = "topbar", $extra: Extra
        } = this.props;
        const topbar = Ux.fromHoc(reference, $key);
        return (
            <Card className={card} bordered={false}
                  title={topbar ? topbar.title : ""}
                  extra={(Extra) ? <Extra $current={topbar.current}/> : false}>
                {children}
            </Card>
        )
    }
}

export default Component;