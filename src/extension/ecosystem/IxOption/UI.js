import React from 'react';
import Ux from 'ux';
import {JsonEditor} from 'web';

class Component extends React.PureComponent {
    render() {
        const {config = {}, value = {}} = this.props;
        return Ux.xtForm([
            {
                ...config.options, value: value.options,
                component: JsonEditor
            }
        ], this);
    }
}

export default Component