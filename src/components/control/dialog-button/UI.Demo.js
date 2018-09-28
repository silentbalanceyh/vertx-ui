import React from 'react'
import Ux from 'ux'
import {DialogButton, PageCard} from 'web'

const {zero} = Ux;

const renderPanel = (config) => {
    const $config = Ux.clone(config);
    return (
        Ux.aiGrid([12, 12],
            <DialogButton $button={$config.button}
                          $dialog={$config.dialog}
                          $mode={$config.mode}>
                BUTTON, DIALOG
            </DialogButton>,
            <DialogButton $button={config.button}
                          $dialog={config.dialog}
                          $mode={config.mode}
                          $items={config.items}>
                DROPDOWN, DIALOG
            </DialogButton>
        )
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
                {Ux.auiTab(this)
                    .type("card")
                    .to(
                        renderPanel(configuration[0])
                    )
                }
            </PageCard>
        )
    }
}

export default Component