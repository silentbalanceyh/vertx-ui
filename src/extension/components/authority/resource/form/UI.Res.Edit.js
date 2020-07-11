import React from 'react';
import Ux from 'ux';
import Ex from "ex";
import {ExForm} from "ei";
import Op from "./Op";
import {RestfulApi} from "web";
import Rdr from "./Web.Render";

@Ux.zero(Ux.rxEtat(require("../Cab"))
    .cab("UI.Res.Edit")
    .to()
)
class Component extends React.PureComponent {

    render() {
        const {$inited = {}} = this.props;
        const normalized = Op.inResource($inited, this);
        const form = Ex.yoForm(this, null, normalized);
        return (
            <ExForm {...form} $height={"300px"}
                    $op={Op.ResAdd.actions}
                    $renders={{
                        restful: (reference, jsx) => {
                            const designer = Ex.designer(reference);
                            return (<RestfulApi {...jsx} rxSource={designer.rxUri}
                                                reference={reference}/>);
                        },
                        modelKey: Rdr.modelKey,
                    }}/>
        );
    }
}

export default Component