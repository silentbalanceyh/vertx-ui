import Ux from 'ux';
import React from "react";
import {Dialog} from 'web';

class Component {
    constructor(reference, key = "window") {
        this.reference = reference;
        /* 窗口配置 */
        const window = Ux.fromHoc(reference, key);
        this.$dialog = Ux.configDialog(reference, window);
    }

    child(uiSupplier) {
        if (Ux.isFunction(uiSupplier)) {
            this.$ui = uiSupplier;
        }
        return this;
    }

    footer(fnRender) {
        // 改变成函数
        if (Ux.isFunction(fnRender)) {
            this.$footer = fnRender;
        }
        return this;
    }

    onMount(state) {
        state.__dialog = this;
        state.$visible = false;
        state.$submitting = false;
        return state;
    }

    onOpen(data = {}) {
        this.reference.setState({
            $inited: data,
            $visible: true,
            $submitting: false
        });
    }

    onClose(state = {}) {
        this.reference.setState({
            $inited: undefined,
            $visible: false,
            $submitting: false,
            ...state,
        })
    }

    onSubmit(state = {}, $submitting = true) {
        this.reference.setState({
            $submitting,
            ...state,
        })
    }

    render() {
        const config = Ux.clone(this.$dialog);
        const {$visible = false, $submitting = false} = this.reference.state;
        const dialogAttrs = {};
        if (this.footer) {
            const props = this.reference.props;
            dialogAttrs.$footer = this.$footer({
                ...props,
                $visible,
                $submitting,
            });
        }
        dialogAttrs.$visible = $visible;
        dialogAttrs.$submitting = $submitting;
        dialogAttrs.$dialog = config;
        return (
            <Dialog className={"web-dialog"}
                    size={"small"}
                    {...dialogAttrs}>
                {Ux.isFunction(this.$ui) ? this.$ui() : false}
            </Dialog>
        )
    }
}

export default Component

