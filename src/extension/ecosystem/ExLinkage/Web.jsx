import {Button, Modal} from "antd";
import React from "react";
import Ux from 'ux';
import Ex from 'ex';
import Editor from '../ExEditorLink/UI';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    renderLink: (reference) => {
        const {$action = {}} = reference.state;
        const {add = {}} = $action;
        const {text, ...rest} = add;
        return (
            <Button {...rest} onClick={event => {
                Ux.prevent(event);
                reference.setState({$visible: true})
            }}>{text}</Button>
        )
    },
    renderUnlink: (reference) => {
        const {$action = {}} = reference.state;
        const {remove = {}} = $action;
        const {text, ...rest} = remove;
        return (
            <Button {...rest}>{text}</Button>
        )
    },
    renderWindow: (reference) => {
        const {
            $window = {},
            $visible = false,
            $editor = {},
        } = reference.state;
        const configWindow = Ux.clone($window);
        configWindow.visible = $visible;

        const inherit = Ex.yoAmbient(reference);
        inherit.config = $editor;
        // List / Form 才会使用
        const {$renders = {}} = reference.props;
        inherit.$renders = $renders;
        return (
            <Modal {...configWindow}>
                <Editor {...inherit}/>
            </Modal>
        )
    }
}