import {Modal} from 'antd';
import React from 'react';
import Ex from 'ex';
import Ux from "ux";
import ExFormLink from '../ExFormLink/UI';

export default (reference, event) => {
    const {$visible = false, $ready = false, $inited = {}} = reference.state;
    const inherit = Ex.yoForm(reference);
    inherit.rxEdgeAdd = event.generate('onWindowClose', false);
    inherit.$mode = Ux.Env.FORM_MODE.ADD;
    const $window = event.configWindow();
    return $ready ? (
        <Modal {...$window}
               visible={$visible}
               onCancel={event.generate('onWindowCancel', false)}>
            <ExFormLink {...inherit}
                        $inited={$inited}/>
        </Modal>
    ) : false
}