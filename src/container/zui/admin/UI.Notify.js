import { Popover, Icon, Badge } from 'antd';
import React from 'react'

class Component extends React.PureComponent {

    render() {
        return (
            <Popover placement="bottomRight" trigger="click" popupClassName="notify-popover"
                allowPointAtCenter>
                {/** 提醒菜单专用 **/}
                <span className="action notify-notice-button">
                    <Badge count={10}>
                        <Icon type="bell" className="notify-icon" />
                    </Badge>
                </span>
            </Popover>
        )
    }
}
export default Component
