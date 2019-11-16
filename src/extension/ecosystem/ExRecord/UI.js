import React from 'react';
import Ex from 'ex';
import Op from './Op';
import {ExForm} from "ei";

class Component extends React.PureComponent {
    state = {
        $ready: false
    };

    componentDidMount() {
        Op.yiPage(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            const {$config = {}, $inited = {}} = this.state;
            const form = Ex.yoForm(this, {form: $config}, $inited);
            return (
                <ExForm {...form} $height={"300px"}/>
            )
        }, Ex.parserOfColor("ExRecord").component())
    }
}

export default Component;