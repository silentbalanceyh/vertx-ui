import {Modal} from 'antd';
import React from 'react';
import Ev from './event';
import Ex from 'ex';
import RelForm from './form/UI.Add';
import Ux from "ux";

export default (reference) => {
    const {$dialog = {}, $visible = false, $inited = {}} = reference.state;
    const inherit = Ex.yoForm(reference);
    inherit.rxEdgeAdd = Ev.onEdgeFormAdd(reference);
    inherit.$mode = Ux.Env.FORM_MODE.ADD;
    return (
        <Modal {...$dialog} visible={$visible}
               onCancel={Ev.onEdgeClose(reference)}>
            <RelForm {...inherit}
                     $inited={$inited}/>
        </Modal>
    )
}