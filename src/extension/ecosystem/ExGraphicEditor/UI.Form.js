import React from 'react';
import Ux from "ux";
import Ex from 'ex';
import ExForm from '../ExForm/UI';

@Ux.zero(Ux.rxEtat(require('./Cab.json'))
    .cab("ExFormLink")
    .to()
)
class Component extends React.PureComponent {
    render() {
        const {
            $inited = {},
            $gEvent, $openId
        } = this.props;
        const form = Ex.yoForm(this, null, $inited);
        return (
            <ExForm {...form} $height={"300px"}
                    $op={{
                        $opEdgeSave: (reference) => (params) => {
                            // 关闭窗口，先调用
                            if ($gEvent) {
                                params.openId = $openId;
                                $gEvent.onWindowSubmit(params);
                            }
                            // 直接关闭
                            $gEvent.winClose();
                        }
                    }}/>
        );
    }
}

export default Component;