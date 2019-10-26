import React from 'react';
import './Cab.less';
import {Input} from 'antd';
import Ux from 'ux';
import Rdr from './I.render';
import moment from 'moment';

const rxValue = (reference, value, config) => {
    if (value) {
        /* 默认全走标签 */
        if (moment.isMoment(value)) {
            return Rdr.jsxMoment(reference, value, config);
        } else if (config.items) {
            return Rdr.jsxItems(reference, value, config);
        } else if (config.record) {
            return Rdr.jsxRecord(reference, value, config);
        }
        return Rdr.jsxLabel(reference, value, config);
    } else {
        /* 如果值为undefined或其他，则直接不呈现 */
        return false;
    }
};

class Component extends React.PureComponent {

    render() {
        console.info(this.props);
        const {value, config, format, ...jsx} = this.props;
        // 是否一个Radio
        const $config = Ux.clone(config);
        if (format) {
            $config.format = format;
        }
        return (
            <Input.Group {...jsx} className={"magic-view-item"}>
                {rxValue(this, value, $config)}
            </Input.Group>
        );
    }
}

export default Component;