import React from 'react';
import __Zn from '../zero.uca.dependency';
import {Input} from 'antd';

const UCA_NAME = "InputProtocol";
class Component extends React.PureComponent {
    displayName = UCA_NAME;
    render() {
        const {config = {}, reference, ...rest} = this.props;
        const className = rest.className ? `${rest.className} web-input-protocol` : `web-input-protocol`;
        return (
            <Input {...rest}
                   className={className}
                   addonAfter={__Zn.v4Icon("code", {
                       style: {fontSize: 16},
                       onClick: event => {
                           __Zn.prevent(event);
                           const {value} = this.props;
                           if (value) {
                               const protocol = __Zn.toProtocol(value, 21);
                               const values = {};
                               __Zn.writeLinker(values, config, () => protocol);
                               if (__Zn.isNotEmpty(values)) {
                                   __Zn.formHits(reference, values);
                               }
                           }
                       }
                   })}
            />
        );
    }
}

export default Component