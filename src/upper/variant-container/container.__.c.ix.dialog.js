import Ux from 'ux';
import React from "react";
import {Dialog} from 'web';

class IxDialog {
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
        Ux.of(this.reference).in({
            $inited: data,
        }).open().submitted().done();
        // this.reference.?etState({
        //     $inited: data,
        //     $visible: true,
        //     $submitting: false
        // });
    }

    onClose(state = {}) {
        Ux.of(this.reference).in({
            $inited: undefined,
            ...state,
        }).hide().load().done();
        // this.reference.?etState({
        //     $inited: undefined,
        //     $visible: false,
        //     $submitting: false,
        //     $loading: false,
        // })
    }

    onSubmit(arg1, $submitting = true) {
        if (0 === arguments.length) {
            // 调用模式 onSubmit()
            Ux.of(this.reference).loading().done();
            // this.reference.?etState({
            //     $submitting: true,
            //     $loading: true
            // })
        } else if (1 === arguments.length) {
            if ("boolean" === typeof arg1) {
                Ux.of(this.reference).in({
                    $submitting: arg1,
                    $loading: arg1
                }).done();
                // this.reference.?etState({
                //     $submitting: arg1,
                //     $loading: arg1
                // });
            } else {
                Ux.of(this.reference).in({
                    $submitting,
                    $loading: $submitting,
                    ...arg1,
                }).done();
                // this.reference.?etState({
                //     $submitting,
                //     $loading: $submitting,
                //     ...arg1,
                // });
            }
        } else if (2 === arguments.length) {
            Ux.of(this.reference).in({
                $submitting,
                $loading: $submitting,
                ...arg1,
            }).done();
            // this.reference.?etState({
            //     $submitting,
            //     $loading: $submitting,
            //     ...arg1,
            // });
        }
    }

    render() {
        const config = Ux.clone(this.$dialog);
        const {$visible = false, $submitting = false} = this.reference.state;
        const dialogAttrs = {};
        if (Ux.isFunction(this.$footer)) {
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
            <Dialog className={"ux_dialog"}
                    size={"small"}
                    {...dialogAttrs}>
                {Ux.isFunction(this.$ui) ? this.$ui() : false}
            </Dialog>
        )
    }
}

export default IxDialog;