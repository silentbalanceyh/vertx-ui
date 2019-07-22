import React from 'react'
import {LoadingContent} from "web";
import {Form} from 'antd';
import Op from './Op';
import Ux from "ux";
import Ex from "ex";
import jsxAction from "./Op.Jsx";

class Component extends React.PureComponent {
    state = {
        $ready: false
    };

    componentDidMount() {
        Op.yiForm(this);
    }

    render() {
        const {$ready = false} = this.state;
        const {$height} = this.props;
        return $ready ? (Ux.uiFieldForm(this, {
            $button: (config, reference) => {
                const {extension = []} = config.optionJsx;
                return jsxAction(Ex.F.parseButtons(extension, reference));
            }
        }, 1)) : (<LoadingContent $height={$height}/>)
    }
}

export default Form.create({})(Component)