import './Cab.less';
import React from 'react';
import Ux from 'ux';
import {Checkbox} from 'antd';

export default (reference, {
    options = [],
    group = {},
    buttons = {},
}) => {
    const {config = {}} = reference.props;
    const style = Ux.toGrid(config);
    return (
        <div className={"ex-column"}>
            <Checkbox.Group {...group}>
                {options.map(item => (
                    <div style={style} key={item.key} className={"item"}>
                        <Checkbox key={item.key} value={item.key}>
                            {item.label}
                        </Checkbox>
                    </div>
                ))}
            </Checkbox.Group>
            <div className={"button"}>
                {/* 特殊按钮操作 */}
                {Ux.aiButtonGroup(reference, buttons)}
            </div>
        </div>
    )
}