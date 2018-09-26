import React from 'react'
import {Button} from 'antd'
import {DynamicDialog} from "web";
import Ux from 'ux';
import U from 'underscore';

class Component extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.setState({visible: false})
    }

    render() {
        const {$config = {}, $form: Component, $datum, $inited, fnConfirm} = this.props;
        const button = Ux.clone($config.button);
        const {text, ...rest} = button;
        const {visible = false} = this.state;

        let window = {};
        if ($config.window) {
            window = Ux.clone($config.window);
            window.onCancel = () => this.setState({visible: false});
            if (U.isFunction(fnConfirm)) {
                window.onOk = fnConfirm;
            }
        }
        return (
            <span>
                <Button {...rest} onClick={event => {
                    event.preventDefault();
                    this.setState({visible: true})
                }}>{text ? text : false}</Button>
                {$config.window ? (
                    <DynamicDialog $visible={visible} $dialog={window}>
                        {Component && visible ? (
                            <Component $inited={$inited} $datum={$datum}
                                       fnClose={() => this.setState({visible: false})}/>
                        ) : false}
                    </DynamicDialog>
                ) : false}
            </span>
        )
    }
}

export default Component