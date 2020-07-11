import React from 'react';
import Ux from 'ux';
import Op from './Op';
import Ex from "ex";
import jsx from './Web.Tree';
import Wizard from './wizard/UI';

@Ux.zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI.Perm.List")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiPermPage(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        Op.yuPermPage(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            return Ux.aiGridLR(this,
                () => {
                    const {$tree = []} = this.state;
                    return jsx.treePermission(this, $tree);
                },
                () => {
                    const {$selectedData} = this.state;
                    return (
                        <Wizard {...Ex.yoAmbient(this)}
                                rxRefresh={() => this.setState({$loading: true})}
                                data={$selectedData}/>
                    );
                },
                {
                    rowCls: "web-authority-resource",
                    rightCls: "content"
                })
        }, Ex.parserOfColor("PxPermissions").control());
    }
}

export default Component