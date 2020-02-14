import React from 'react';
import Ux from 'ux';
import Ex from 'ex';
import {ExWizard} from 'ei';
import FormSearch from './form/UI.Search';
import FormDynamic from './form/UI.Password';

@Ux.zero(Ux.rxEtat(require('./Cab'))
    .cab("UI.Search")
    .to()
)
class Component extends React.PureComponent {
    render() {
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
    }
}

export default Component;