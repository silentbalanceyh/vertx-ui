import React from 'react'
import Ux from 'ux'
import U from 'underscore'
import {DialogMenu, PageCard} from 'web'
import Op from './Op.Delete'
import $formAdd from './UI.Form.Add'
import $formEdit from './UI.Form.Edit'

const {zero} = Ux;

const renderPanel = (reference, config) => {
    const $config = Ux.clone(config);
    const $op = {};
    Object.keys(Op).filter(item => U.isFunction(Op[item]))
        .forEach(key => $op[key] = Op[key](reference));
    const form = {
        $formAdd,
        $formEdit
    };
    return (
        <DialogMenu $button={$config.button}
                    $items={$config.items}
                    $functions={$op}
                    $components={form}
                    $mode={$config.mode}/>
    )
};

@zero(Ux.rxEtat(require('./Cab'))
    .cab("UI.Demo")
    .to()
)
class Component extends React.PureComponent {
    render() {
        const configuration = Ux.fromHoc(this, "configuration");
        return (
            <PageCard reference={this}>
                {Ux.aiGrid([12, 12],
                    renderPanel(this, configuration[0]),
                    renderPanel(this, configuration[1])
                )}
            </PageCard>
        )
    }
}

export default Component