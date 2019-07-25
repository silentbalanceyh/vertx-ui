import {Badge, Icon, Popover} from "antd";
import React from "react";

export default (ref, {}) => (
    <Popover placement="bottomRight" trigger="click" popupClassName="notify-popover"
             allowPointAtCenter>
        {/** 提醒菜单专用 **/}
        <span className="action notify-notice-button">
            <Badge count={10}>
                <Icon type="bell" className="notify-icon"/>
            </Badge>
        </span>
    </Popover>
)