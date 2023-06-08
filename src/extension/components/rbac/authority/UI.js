import React from 'react';
import Ux from 'ux';
import Ex from 'ex';
import {ExAuthority} from 'ei';
import Op from './Op';
import Sk from 'skin';
import __ from './Cab.module.scss';

@Ux.zero(Ux.rxEtat(require('./Cab'))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiPage(this);
    }

    render() {
        const attrPage = Sk.mix(__.upg_rbac_authority);
        return (
            <div {...attrPage}>
                {Ex.ylCard(this, () => {
                    const {$param = {}} = this.state;
                    const inherit = Ex.yoAmbient(this);
                    inherit.$inited = $param;
                    return (
                        <ExAuthority {...inherit}/>
                    )
                }, Ex.parserOfColor("PxAuthority").page())}
            </div>
        )
    }
}

export default Component