import React from 'react';
import Ux from 'ux';
import Ex from 'ex';
import {ExWizard} from 'ei';
import FormSearch from './UI.Search';
import FormDynamic from './UI.Password';

@Ux.zero(Ux.rxEtat(require('./Cab'))
    .cab("UI")
    .ready(true)
    .to()
)
class Component extends React.PureComponent {
    render() {
        return Ex.ylCard(this, () => {
            const inherit = Ex.yoAmbient(this);
            /*
             * ExWizard 专用
             */
            const $form = {
                FormSearch,
                FormDynamic
            };
            /*
             * Tab页专用
             */
            const config = Ux.fromHoc(this, "wizard");
            return (
                <ExWizard {...inherit} config={config}
                          $form={$form}/>
            );
        }, Ex.parserOfColor("PxPasswordAdmin").page())
    }
}

export default Component;