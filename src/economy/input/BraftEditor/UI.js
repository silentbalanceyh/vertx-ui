import React from 'react';
import 'braft-editor/dist/index.css';
import './Cab.less';
import BraftEditor from 'braft-editor';
import renderHTML from 'react-render-html';
import {Input} from 'antd';
import Ux from "ux";

/**
 * ## 「组件」`BraftEditor`
 *
 * 富文本编辑器
 *
 * ```js
 * import { BraftEditor } from 'web';
 * ```
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |x|x|Ok|
 *
 * ### 2. 属性说明
 *
 * 该属性说明位于`optionJsx.config`节点中，即`jsx`中的`config`对象信息。
 *
 * |属性名|二级属性|源|类型|说明|
 * |:---|---|:---|:---|:---|
 * |value||props|Any|Ant Form给当前组件传入的值。|
 * |config||state|Object|当前编辑器的配置。|
 * |config|controls|state|Array|打开或禁用编辑器的工具栏选项。|
 * |content||state|EditorState|当前编辑器的内容。|
 *
 * ### 3. 组件核心点
 *
 * > 目前富文本编辑器还未执行重置以及content部分的上层onChange方法调用，后续需要补充开发。
 *
 * @memberOf module:web-input
 * @method BraftEditor
 **/
// =====================================================
// componentInit/componentUp
// =====================================================
const initConfig = (props) => {
    let {config = {}} = props;
    config = Ux.clone(config);
    config.controls = [
        'bold', 'italic', 'underline', 'strike-through', 'separator',
        'text-color', 'font-size', 'text-align', 'separator',
        'line-height', 'letter-spacing', 'separator'
    ];
    return config;
};
const initValue = (props) => {
    // Fix：解决切换问题
    const {value} = props;
    if (value) {
        return BraftEditor.createEditorState(value);
    } else {
        return BraftEditor.createEditorState(null);
    }
};
const componentCt = (props) => {
    const config = initConfig(props);
    return {
        content: initValue(props),
        config
    };
}
const componentCss = (config = {}) => {
    const {height} = config;
    const style = {};
    if (height) {
        style.maxHeight = height;
    } else {
        style.maxHeight = 180;
    }
    const cssAttrs = {};
    cssAttrs.style = style;
    cssAttrs.contentStyle = {
        maxHeight: style.maxHeight - 50,
        fontSize: 14,
    }
    return cssAttrs;
}
const componentUp = (reference) => {
    const {content} = reference.state;
    const previous = content.toHTML();
    // 如果捕捉到undefined，执行转换
    let current = BraftEditor.createEditorState(reference.props.value).toHTML();
    // 不可能为undefined，也就是必须是<p></p>，即BraftEditor的默认值
    if (current && current !== previous) {
        const content = BraftEditor.createEditorState(reference.props.value);
        reference.setState({content});
    }
};

class Component extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = componentCt(this.props);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // 强制更新
        componentUp(this);
    }

    render() {
        const {config = {}, content} = this.state;
        const cssStyle = componentCss(config);
        const {readOnly = false} = this.props;
        if (readOnly) {
            return (
                <Input.Group className={"web-braft-viewer"}>
                    <div style={cssStyle}>
                        {renderHTML(content.toHTML())}
                    </div>
                </Input.Group>
            )
        } else {
            return (
                <Input.Group className={"web-braft-editor"}>
                    <BraftEditor {...config}
                                 {...cssStyle}
                                 readOnly={readOnly}
                                 value={content}
                                 onChange={(editorState) => {
                                     if (editorState) {
                                         this.setState({content: editorState});
                                         // 调用Ant中的OnChange
                                         Ux.fn(this).onChange(editorState.toHTML())
                                         // Ux.xtChange(reference, editorState.toHTML(), true);
                                     }
                                 }}/>
                </Input.Group>
            );
        }
    }
}

export default Component;