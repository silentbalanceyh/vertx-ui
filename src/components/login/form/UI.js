import React from 'react'
import './Cab.less';
import Ux from 'ux';

import {ExSubmit} from 'ei';
import Ex from 'ex';
import Op from './Op';
import {Spin} from 'antd';

import renderHome from './Web.Fn.Home';

@Ux.zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI")
    .unmount()
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiPage(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            const title = Ux.fromHoc(this, "title");
            const {$logged = false, $loading = false} = this.state;
            return $logged ? (
                <div className={"logged-container"}>
                    {renderHome(this)}
                </div>
            ) : (
                <div>
                    <dl>
                        <dt>{title.banner}</dt>
                        <dd className={"login-container"}>
                            <div className={"form"}>
                                <Spin spinning={$loading} tip={title.loading}>
                                    <div className={"form-title"}>{title.login}</div>
                                    <ExSubmit {...Ex.yoAmbient(this)} $op={Op}
                                        doSubmitting={submitted => this.setState({$loading: submitted})}/>
                                </Spin>
                            </div>
                        </dd>
                    </dl>
                </div>
            )
        }, Ex.parserOfColor("PxLogin").page({top: 120}))
    }
}

export default Component