import React from 'react';
import Ux from "ux";
import Ex from "ex";
import Jsx from './Web';
import Op from './Op';
import {List} from "antd";
// =====================================================
// componentInit/componentUp
// =====================================================
const componentInit = (reference) => {
    /*
     * 防止二次读取，只有在打开窗口时执行
     * 在关闭时由于React原因会触发一次操作，这次操作不再执行刷新的加载流程
     */
    const {$opened = false} = reference.props;
    if ($opened) {
        const {config = {}} = reference.props;
        const $combine = Ex.yiCombine(reference, config);
        const stateInit = {};
        stateInit.$combine = $combine;
        /*
         * 视图管理配置
         */
        const {list = {}, dialog = {}} = $combine;
        const $list = Ux.clone(list);
        $list.renderItem = Jsx.renderItem(reference);
        $list.size = "small"
        $list.className = "v-list";
        $list.header = Jsx.renderHeader(reference, list.header);
        stateInit.$list = $list;
        /*
         * 表单窗口专用
         */
        const add = Ux.configDialog(reference, dialog.add);
        const edit = Ux.configDialog(reference, dialog.edit);
        stateInit.$dialog = {
            add, edit,
        }
        stateInit.$mode = "VIEW";       // 选择模式
        /*
         * View Reading
         * uri, method as method
         */
        stateInit.$ready = true;
        stateInit.$dirty = true;
        stateInit.$loading = true;
        reference.setState(stateInit);
    }
}
const componentUp = (reference) => {
    const {$dirty = false, $loading} = reference.state;
    if ($dirty) {
        if (!$loading) {
            reference.setState({$loading: true});
        }
        Op.rxRefresh(reference).then(state => reference.setState(state))
    }
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

    componentDidUpdate(prevProps, prevState, snapshot) {
        componentUp(this, {state: prevState, props: prevProps})
    }

    render() {
        return Ex.yoRender(this, () => {
            const {
                $combine = {},
                $data = [], $loading = true,     // 数据处理
                $list,                           // 列表配置
            } = this.state;
            return (
                <div className={"ex-editor-list"}>
                    {Ux.aiViewMy($combine.view, this)}
                    {Jsx.renderDialog(this)}
                    <div className={"content"}>
                        {Jsx.renderBar(this)}
                        <List {...$list} loading={$loading}
                              dataSource={$data}
                        />
                    </div>
                </div>
            )
        }, Ex.parserOfColor("ExEditorView").private())
    }
}

export default Component