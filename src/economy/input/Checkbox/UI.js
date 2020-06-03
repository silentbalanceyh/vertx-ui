import React from 'react';
import {Checkbox} from 'antd';

class Component extends React.PureComponent {
    render() {
        const {onChange, __onChange} = this.props;
        const meta = this.props['data-__meta'];
        /*
         * checked 计算
         */
        let $checked = false;
        if ("checked" === meta.valuePropName) {
            $checked = this.props.checked;
        } else {
            $checked = this.props.value;
        }
        return (
            <Checkbox.Group value={[$checked]} onChange={event => {
                if ("checked" === meta.valuePropName) {
                    onChange(event[0]);
                } else {
                    // 等待后期实现
                }
                if (__onChange) {
                    __onChange(event);
                }
            }}>
                <Checkbox value={true}/>
            </Checkbox.Group>
        )
    }
}

export default Component