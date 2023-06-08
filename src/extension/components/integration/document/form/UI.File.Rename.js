import React from 'react';
import Ux from "ux";
import Ex from "ex";
import {ExForm} from "ei";
import Op from "./Op";

@Ux.zero(Ux.rxEtat(require('../Cab'))
    .cab("UI.File.Rename")
    .to()
)
class Component extends React.PureComponent {
    render() {
        /*
         * 配置处理
         */
        const {$inited = {}} = this.props;
        const form = Ex.yoForm(this, null, $inited);
        return (
            <ExForm {...form} $height={"300px"}
                    $op={Op.rxAction(this)}
                    $renders={{
                        fileName: (reference, jsx) => {
                            const onChange = (event) => {
                                const text = Ux.ambEvent(event);
                                const storeParent = Ux.formGet(reference, "storeParent");
                                const storePath = storeParent + "/" + text + "." + $inited.extension;
                                Ux.formHits(reference, {storePath});
                            };
                            return Ux.aiInput(reference, jsx, onChange);
                        }
                    }}
            />
        );
    }
}

export default Component