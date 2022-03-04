import React from 'react';
import Ux from "ux";
import {Icon, Input} from 'antd';
import './Cab.less';

class Component extends React.PureComponent {
    render() {
        const {config = {}, reference, ...rest} = this.props;
        const className = rest.className ? `${rest.className} web-input-protocol` : `web-input-protocol`;
        return (
            <Input {...rest}
                   className={className}
                   addonAfter={<Icon type={"code"} style={{
                       fontSize: 16
                   }} onClick={event => {
                       Ux.prevent(event);
                       const {value} = this.props;
                       if (value) {
                           const protocol = Ux.toProtocol(value, 21);
                           const values = {};
                           Ux.writeLinker(values, config, () => protocol);
                           if (Ux.isNotEmpty(values)) {
                               Ux.formHits(reference, values);
                           }
                       }
                   }}/>}
            />
        )
    }
}

export default Component