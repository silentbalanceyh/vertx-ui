import React from 'react';
import Ux from 'ux';
import Ex from 'ex';
import {ExForm} from 'ei';
import Op from './Op';
import {RestfulApi} from 'web';
import Rdr from './Web.Render';

@Ux.zero(Ux.rxEtat(require('../Cab'))
    .cab("UI.Res.Add")
    .to()
)
class Component extends React.PureComponent {
    render() {
        /*
         * 配置处理
         */
        const form = Ex.yoForm(this, null);
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

export default Component;