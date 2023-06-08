import React from 'react'
import Ux from 'ux';
import Op from './Op';

const {zero} = Ux;

const jsx = {
    "source.category": (reference, jsx) => {
        /** 关于是否禁用下拉的处理 **/
        jsx.disabled = Op.initCategoryDisabled(reference);
        return Ux.aiSelect(reference, jsx,
            Op.initCategory(reference));
    }
};

@zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI.Form.Source")
    .bind(Op)
    .connect(state => Ux.dataIn(state)
        .rework({
            "status": ["submitting"]     // 防重复提交，连接检查专用
        })
        .to()
    )
    .state({
        $connected: false,  // 连接检查是否通过
    })
    .form()
    .raft(2).raft(jsx).to()
)
class Component extends React.PureComponent {
    render() {
        return Ux.uiFieldForm(this, jsx, 2)
    }
}

export default Component