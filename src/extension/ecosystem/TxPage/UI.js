import React from 'react';
import Ux from "ux";
import Ex from 'ex';
import {Card} from 'antd';

import Op from './Op';
import Rdr from './Web';

import Sk from 'skin';
import "./Cab.norm.scss";

const UCA_NAME = "TxPage";
@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab(UCA_NAME)
    .to()
)
class Component extends React.PureComponent {
    displayName = UCA_NAME;
    componentDidMount() {
        Op.yiPage(this);
        // Ex.wf(this).yiPage().then(Ux.pipe(this));
    }

    // 两个界面之间的切换流程
    componentDidUpdate(prevProps, prevState, snapshot) {
        Op.yuPage(this, {
            state: prevState,
            props: prevProps
        });
    }

    render() {
        const {$error = false} = this.state;
        if ($error) {
            const error = Ux.fromHoc(this, "error");
            return Ux.aiErrorPage(error);
        } else {
            return Ex.yoRender(this, () => {
                const {$workflow = {}} = this.state;
                const {children, $inited = {}} = this.props;
                /*
                 * 根据 task 提取配置信息，然后传入到下层中
                 */
                if ($workflow.task) {
                    const inherits = Op.yoPage(this, $workflow, $inited);
                    // Ex.wf(this).yoPage($workflow, $inited);
                    inherits.rxTaskActive = ($taskActive) =>
                        Ux.of(this).in({$taskActive}).done();
                    // this.?etState({$taskActive});
                    /*
                     * $workflow:
                     * {
                     *     bpmn: "xml of bpmn",
                     *     code: "workflow code",
                     *     config: {
                     *         linkage: {
                     *         },
                     *         run: {
                     *         },
                     *         ui: {
                     *         }
                     *     },
                     *     definitionId: xxx,
                     *     definitionKey: xxx,
                     *     name: xxx,
                     *     task: "e.xxx",
                     *     type: "workflow type"
                     * }
                     * $inited:
                     * {
                     *     W_Ticket + W_Todo
                     * }
                     */
                    const attrPage = Sk.mixTx(UCA_NAME);
                    return (
                        <div {...attrPage}>
                            <Card title={Rdr.renderTitle(this, $workflow)}
                                  className={Ux.Env.ECONOMY.CARD_CONTAINER}
                                  extra={Rdr.renderExtra(this, $workflow)}>
                                {React.cloneElement(children, inherits)}
                            </Card>
                        </div>
                    )
                } else {
                    console.warn("流程错误：", $workflow);
                    return false;
                }
            }, Ex.parserOfColor(UCA_NAME).container());
        }
    }
}

export default Component