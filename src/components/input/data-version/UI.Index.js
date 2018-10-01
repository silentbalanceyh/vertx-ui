import React from 'react'
import Ux from 'ux';
import Left from './UI.Left';
import Right from './UI.Right';

class Component extends React.PureComponent {
    render() {
        const $inited = {
            version: {
                year: 2011, month: 11, day: 10, version: 2008
            }
        };
        return Ux.aiGrid([12, 12],
            <Left {...this.props}/>,
            <Right {...this.props} $inited={$inited}/>
        )
    }
}

export default Component