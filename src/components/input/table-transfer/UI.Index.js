import React from 'react'
import {FormPanel} from 'app';
import Left from './UI.Left';
import Right from './UI.Right';
import $inited from './inited';

class Component extends React.PureComponent {
    render() {
        return (
            <FormPanel reference={this} $inited={$inited}>
                <Left {...this.props}
                      reference={this}/>
                <Right {...this.props}
                       reference={this}
                       $inited={$inited}/>
            </FormPanel>
        )
    }
}

export default Component