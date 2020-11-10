import React from 'react';
import './Cab.less';
import {Button, Modal} from 'antd';
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
        const content = Ux.E.fxError(10090, "$dialog");
        reference.setState({error: content.error});
    } else {
        const {$ready = false} = reference.state;
        if (!$ready) {
            state.$ready = true;
            reference.setState(state);
        }
    }
};

class Component extends React.PureComponent {
    state = {};

    componentDidMount() {
        // 解决单次显示窗口问题
        initialize(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // 解决单次显示窗口问题
        initialize(this);
    }

    render() {
        return Ux.xtReady(this, () => {
            const config = this.state;
            const {
                $visible = false,
                className = "web-dynamic-dialog", children,
                rxCancel, rxOk,
                $loading = false, // 防重复提交
                $footer = null,   // 是否定制
            } = this.props;
            // 配置中不包含onCancel
            if (U.isFunction(rxOk)) {
                config.onOk = rxOk;
            }
            if (U.isFunction(rxCancel)) {
                config.onCancel = rxCancel;
            }
            /*
            if (config) {
                if (!config.hasOwnProperty("onCancel")
                    && U.isFunction(rxCancel)) {
                    config.onCancel = rxCancel;
                }
                if (!U.isFunction(config.onOk)
                    && U.isFunction(rxOk)) {
                    config.onOk = rxOk;
                }
            }*/
            // 关闭窗口时销毁子组件
            config.destroyOnClose = true;
            config.confirmLoading = $loading;
            config.cancelButtonProps = {
                loading: $loading
            };
            if ($footer) {
                // 可定制页脚
                config.footer = $footer;
            } else {
                /*
                 * 不定制按钮界面，如果配置为 null，则只显示 type = primary 的关闭按钮
                 * 第二个配置
                 * "订单详细信息,,关闭,false,960,true,$opClose"
                 * 整个数组中的第二个按钮为 null 时就只保留单个按钮
                 */
                if (!config.okText) {
                    config.footer = (
                        <Button type={"primary"} onClick={config.onCancel}
                                loading={$loading}>
                            {config.cancelText}
                        </Button>
                    )
                }
            }
            return (
                <Modal {...config} visible={$visible} className={className}>
                    {children}
                </Modal>
            );
        });
    }
}

export default Component;
