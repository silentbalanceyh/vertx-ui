import './Cab.less';
import React from 'react';
import Ex from 'ex';
import Ux from 'ux';
import {Checkbox} from 'antd';

export default (reference, {
    options = [],
    group = {},
    buttons = {},
}) => {
    const {config = {}} = reference.props;
    const style = Ex.toGrid(config);
    return (
        <div className={"ex-column"}>
            <Checkbox.Group {...group}>
                {options.map(item => {
                    return (
                        <div style={style} key={item.key} className={"item"}>
                            <Checkbox key={item.key} value={item.key}>
                                {item.label}
                            </Checkbox>
                        </div>
                    );
                })}
            </Checkbox.Group>
            <div className={"button"}>
                {/* 特殊按钮操作 */}
                {Ux.rtGroup(reference, buttons)}
            </div>
        </div>
    )
}