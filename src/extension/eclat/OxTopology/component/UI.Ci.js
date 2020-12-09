import React from 'react';
import Ex from 'ex';
import OxCi from '../../OxCi/UI';

class Component extends React.PureComponent {
    render() {
        const {$inited = {}} = this.props;
        const inherit = Ex.yoDynamic(this);
        inherit.data = $inited;
        return (<OxCi {...inherit}/>);
    }
}

export default Component