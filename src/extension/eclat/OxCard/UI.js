import React from 'react';
import Op from './Op';
import Ex from 'ex';
import {PageCard} from 'web';

class Component extends React.PureComponent {
    state = {
        $ready: false
    };

    componentDidMount() {
        Op.yiCard(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            const {children} = this.props;
            return (
                <PageCard reference={this}>
                    {children}
                </PageCard>
            );
        }, Ex.parserOfColor("OxCard").container());
    }
}

export default Component;