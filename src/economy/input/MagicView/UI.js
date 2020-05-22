import React from 'react';
import './Cab.less';
import {Input} from 'antd';
import Ux from 'ux';
import Rdr from './I.render';
import moment from 'moment';

const rxContent = (reference, value, config) => {
    /* 默认全走标签 */
    if (moment.isMoment(value)) {
        return Rdr.jsxMoment(reference, value, config);
    } else if (config.items) {
        return Rdr.jsxItems(reference, value, config);
    } else if (config.record) {
        return Rdr.jsxRecord(reference, value, config);
    } else if (config.table) {
        return Rdr.jsxTable(reference, value, config);
    } else if (config.user) {
        return Rdr.jsxUser(reference, value, config);
    }
    return Rdr.jsxLabel(reference, value, config);
};
const rxValue = (reference, value, config) => {
    if (config.boolean) {
        if (!value) {
            return rxContent(reference, false, config);
        }
    } else {
        let literal = value;
        if (config.expr) {
            literal = Ux.formatExpr(config.expr, {value}, true);
        }
        if (value) {
            return rxContent(reference, literal, config);
        } else {
            /* 如果值为undefined或其他，则直接不呈现 */
            return false;
        }
    }
};

/*
 * 纯渲染，不带任何 state
 * 也不会出现改变相关操作，纯逻辑
 */
class Component extends React.PureComponent {

    render() {
        const {value, config, format, ...jsx} = this.props;
        // 是否一个Radio
        const $config = Ux.clone(config);
        if (format) {
            // Overwrite Here
            $config.format = format;
        }
        // 时间格式
        let $value = value;
        const {moment = false} = this.props;
        if (moment && value) {
            $value = Ux.valueTime(value, $config.format);
        }
        return (
            <Input.Group {...jsx} className={"magic-view-item"}>
                {rxValue(this, $value, $config)}
            </Input.Group>
        );
    }
}

export default Component;