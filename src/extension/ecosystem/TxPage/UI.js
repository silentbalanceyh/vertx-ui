import React from 'react';
import Ux from "ux";
import Ex from 'ex';
import {LoadingAlert} from "web";
import {Button, Card} from 'antd';
import './Cab.less';

const fxFailure = (reference) => {
    const error = Ux.fromHoc(reference, "error");
    return (
        <div style={{
            paddingTop: "10%",
            paddingLeft: "20%",
            paddingRight: "20%"
        }}>
            <LoadingAlert $alert={error}
                          className={"web-error-alert"}
                          $icon={"stop"} $type={"error"}/>
        </div>
    )
}

const fxExtra = (reference) => {
    const target = Ux.toQuery("target");
    if (target) {
        return (
            <Button shape={"circle"} className={"ux-spec"} icon={"double-left"}
                    onClick={event => {
                        Ux.prevent(event);
                        Ux.toOriginal(reference, null, ["tid"]);
                    }}
            />
        )
    } else return false;
}

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab("TxPage")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Ex.wf(this).yiPage().then(Ux.pipe(this));
    }

    render() {
        const {$error = false} = this.state;
        if ($error) {
            return fxFailure(this);
        } else {
            return Ex.yoRender(this, () => {
                const {$workflow = {}} = this.state;
                const {children, $inited = {}} = this.props;
                /*
                 * 根据 task 提取配置信息，然后传入到下层中
                 */
                if ($workflow.task) {
                    const inherits = Ex.wf(this).yoPage($workflow, $inited);
                    return (
                        <div className={"tx-page"}>
                            <Card title={$workflow.name}
                                  className={Ux.Env.ECONOMY.CARD_CONTAINER}
                                  extra={fxExtra(this)}>
                                {React.cloneElement(children, inherits)}
                            </Card>
                        </div>
                    )
                } else {
                    console.warn("流程错误：", $workflow);
                    return false;
                }
            }, Ex.parserOfColor("TxPage").container());
        }
    }
}

export default Component