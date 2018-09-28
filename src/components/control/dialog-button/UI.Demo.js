import React from 'react'
import Ux from 'ux'
import {DialogButton, PageCard} from 'web'

const {zero} = Ux;

const renderPanel = (config) => {
    const $config = Ux.clone(config);
    return (
        <DialogButton $button={$config.button}
                      $dialog={$config.dialog}
                      $mode={$config.mode}>
            BUTTON, {$config.mode}
        </DialogButton>
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
                {Ux.aiGrid([8, 8, 8],
                    renderPanel(configuration[0]),
                    renderPanel(configuration[1]),
                    renderPanel(configuration[2])
                )}
            </PageCard>
        )
    }
}

export default Component