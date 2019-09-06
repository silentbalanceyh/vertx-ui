import React from 'react';
import './Cab.less';
import {Modal} from 'antd';
import Ux from 'ux';
import U from 'underscore';

const initState = (reference) => {
    const {$dialog = {}} = reference.props;
    let config = {};
    if ($dialog && 0 < Object.keys($dialog).length) {
        if ("string" === typeof $dialog) {
            config = Ux.aiExprWindow($dialog);
        } else if (U.isObject($dialog)) {
            config = Object.assign(config, $dialog);
        }
    }
    return config;
};
const initialize = (reference) => {
    const state = initState(reference);
    if (!reference.state && 0 === Object.keys(state).length) {
        const error = Ux.E.fxInfo(true, 10090, "$dialog");
        reference.setState({error});
    } else {
        reference.setState(state);
    }
};

class Component extends React.PureComponent {
    componentDidMount() {
        // 解决单次显示窗口问题
        initialize(this);
    }

    componentDidUpdate() {
        // 解决单次显示窗口问题
        initialize(this);
    }

    render() {
        return Ux.xtRender(this, () => {
            const config = this.state;
            const {
                $visible = false,
                className = "web-dynamic-dialog", children,
                rxCancel, rxOk,
                $loading = false, // 防重复提交
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
            // 关闭窗口时销毁子组件
            config.destroyOnClose = true;
            config.confirmLoading = $loading;
            return (
                <Modal {...config} visible={$visible} className={className}>
                    {children}
                </Modal>
            );
        });
    }
}

export default Component;
