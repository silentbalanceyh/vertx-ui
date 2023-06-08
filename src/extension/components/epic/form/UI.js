import React from 'react'
import Ux from "ux";
import Ex from 'ex';
import page from './page';

const componentInit = (reference) => {
    Ex.yiStandard(reference)
        .then(state => {
            state.$menus = Ux.g6DataTree({state}, {
                category: "data.category"
            });
            state.$selected = undefined;
            return Ux.promise(state);
        })
        .then(state => Ux.promise(Ex.uiTab(reference)
            .children({
                /* 表单管理主界面，Tab页面一 */
                tabForm: page.pageMain(reference),
                /* 表单管理设计界面，Tab页面二 */
                tabDesign: page.pageDesigner(reference),
            }).onMount(state))
        )
        .then(Ux.pipe(reference));
}

@Ux.zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI")
    .to()
)

class Component extends React.PureComponent {

    componentDidMount() {
        componentInit(this);
    }

    render() {
        const {__tabs} = this.state;
        return Ex.ylCard(this,
            () => __tabs.render(),
            Ex.parserOfColor("PxForm").page())
    }
}

export default Component