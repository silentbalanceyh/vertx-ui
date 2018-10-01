import React from 'react';
import './Cab.less';
import {Input} from 'antd';
import Ux from 'ux';

const renderInput = (reference, field, config = {}, meta = {}) => {
    const attrs = {};
    const value = reference.state;
    if (config[field]) attrs.addonAfter = config[field];
    attrs.style = {width: config.width ? config.width : 100};
    attrs.onChange = Ux.jonInput(reference, field);
    attrs.value = value[field];
    attrs.placeholder = meta.placeholder;
    return (<Input {...attrs}/>)
};

class Component extends React.PureComponent {
    constructor(props) {
        super();
        this.state = props.value || {};
    }

    render() {
        const {config = {}, ...rest} = this.props;
        const {value, ...meta} = rest;
        return (
            <Input.Group compact className={"web-date-version"}
                         {...rest} value={value}>
                {renderInput(this, "year", config, meta)}
                {renderInput(this, "month", config, meta)}
                {renderInput(this, "day", config, meta)}
                {config.version ? renderInput(this, "version", config, meta) : false}
            </Input.Group>
        )
    }
}

export default Component