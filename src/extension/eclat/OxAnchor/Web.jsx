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
        <Modal {...$dialog} visible={$visible} footer={
            <Button className={"ux-red"} icon={"stop"} onClick={event => {
                Ux.prevent(event);
                reference.setState({$visible: false});
            }}>
                {config.button}
            </Button>
        }>
            <OxCi {...inherit}/>
        </Modal>
    )
}