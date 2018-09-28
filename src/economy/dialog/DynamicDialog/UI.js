import React from 'react'
import './Cab.less'
import {Modal} from 'antd';
import Ux from 'ux';
import U from 'underscore';

const initState = (reference) => {
    const {$dialog = {}} = reference.props;
    let config = {};
    if ($dialog) {
        if ("string" === typeof $dialog) {
            config = Ux.aiExprWindow($dialog);
        } else if (U.isObject($dialog)) {
            config = Object.assign(config, $dialog);
        }
    }
    return config;
};

class Component extends React.PureComponent {
    componentDidMount() {
        const state = initState(this);
        if (!this.state && 0 === Object.keys(state).length) {
            const error = Ux.E.fxInfo(true, 10090, "$dialog");
            this.setState({error});
        } else {
            this.setState(state);
        }
    }

    render() {
        return Ux.fxRender(this, () => {
            const config = this.state;
            const {
                $visible = false,
                className = "web-dynamic-dialog", children,
                rxCancel, rxOk,
            } = this.props;
            // 配置中不包含onCancel
            if (config) {
                if (!config.hasOwnProperty("onCancel")
                    && U.isFunction(rxCancel)) {
                    config.onCancel = rxCancel;
                }
                if (!U.isFunction(config.onOk)
                    && U.isFunction(rxOk)) {
                    config.onOk = rxOk;
                }
            }
            return (
                <Modal {...config} visible={$visible} className={className}>
                    {children}
                </Modal>
            )
        })
    }
}

export default Component;
