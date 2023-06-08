import React from 'react';
import Ux from 'ux';

@Ux.zero(Ux.rxEtat(require('./Cab'))
    .cab("UI")
)
class Component extends React.PureComponent {
    render() {
        return (
            <div>
                Tpl
            </div>
        )
    }
}

export default Component