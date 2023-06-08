import React from 'react';
import {Button, Modal} from 'antd';
import Ex from 'ex';
import Ux from 'ux';
import OxCi from '../OxCi/UI';

export default (reference) => {
    const {$visible, $dialog = {}} = reference.state;
    const inherit = Ex.yoAmbient(reference);
    const {data = {}} = reference.props;
    inherit.data = data;
    const config = Ux.fromHoc(reference, "config");
    return (
        // v4
        <Modal {...$dialog} open={$visible} footer={
            <Button className={"uc_red"} icon={Ux.v4Icon("stop")} onClick={event => {
                Ux.prevent(event);
                Ux.of(reference).hide().done();
                // reference.?etState({$visible: false});
            }}>
                {config.button}
            </Button>
        }>
            <OxCi {...inherit}/>
        </Modal>
    );
}