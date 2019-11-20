import React from 'react';
import Ux from 'ux';
import Ex from 'ex';
import Op from './Op';
import {ExForm, ExRecord, ExRelation, ExTab} from 'ei';

import History from './UI.History';

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiPage(this);
    }

    render() {
        return Ex.ylCard(this, () => {
            const {$inited = {}} = this.state;
            const formData = Ex.yoForm(this, null, $inited);
            /*
             * 继承
             */
            const inherit = Ex.yoAmbient(this);

            /*
             * 单据核心信息
             */
            const tabs = Ux.fromHoc(this, "tabs");
            const rAttrs = Op.yoRecord(this);
            const relAttrs = Op.yoRelation(this);
            console.info({
                ...inherit,
                ...relAttrs
            });
            return (
                <div>
                    <ExForm {...formData} $height={"300px"}
                            rxClose={(event) => {
                                Ux.prevent(event);
                                Ux.toOriginal(this);
                            }}
                            $op={Op.actions}/>
                    <ExTab {...inherit} config={tabs}>
                        <ExRecord {...inherit} {...rAttrs}/>
                        <History {...inherit} $inited={$inited}/>
                        <ExRelation {...inherit} {...relAttrs}/>
                    </ExTab>
                </div>
            )
        }, Ex.parserOfColor("ExTodoView").page({
            extra: Ux.aiLinkBack(this),
            leftVisible: Op.yoLeft(this)
        }))
    }
}

export default Component;