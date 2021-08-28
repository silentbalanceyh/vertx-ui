import React from 'react';
import Ux from "ux";
import Ex from "ex";
import Jsx from './Web';

// =====================================================
// componentInit/componentUp
// =====================================================
const componentInit = (reference) => {
    const {config = {}} = reference.props;
    const $combine = Ex.yiCombine(reference, config);
    const state = {};
    state.$combine = $combine;
    /*
     * View Reading
     * uri, method as method
     */
    const {$options = {}} = reference.props;
    const params = {};
    params.method = "POST";
    params.uri = $options[Ex.Opt.AJAX_SEARCH_URI];
    Ux.ajaxPost("/api/view-p/fetch", params).then(response => {
        console.log(response);
        state.$ready = true;
        reference.setState(state);
    })
}

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab("ExEditorView")
    .to()
)
class Component extends React.PureComponent {
    state = {
        $ready: false
    };

    componentDidMount() {
        componentInit(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            const {$combine = {}} = this.state;
            return (
                <div className={"ex-editor-dialog"}>
                    {Ex.jsxMyView(this, $combine.view)}
                    {Jsx.renderBar(this)}
                </div>
            )
        }, Ex.parserOfColor("ExEditorView").private())
    }
}

export default Component