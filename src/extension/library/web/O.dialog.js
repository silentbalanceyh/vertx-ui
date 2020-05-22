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
        const config = this.$dialog;
        const {$visible = false, $submitting = false} = this.reference.state;
        return (
            <Dialog className={"web-dialog"}
                    size={"small"}
                    $visible={$visible}
                    $loading={$submitting}
                    $dialog={config}>
                {Ux.isFunction(this.$ui) ? this.$ui() : false}
            </Dialog>
        )
    }
}

export default Component

