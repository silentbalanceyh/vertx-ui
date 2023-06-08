import React from 'react';
import 'braft-editor/dist/index.css';

import BraftEditor from 'braft-editor';
import renderHTML from 'react-render-html';
import __Zn from '../zero.uca.dependency';
import Sk from 'skin';
import "./Cab.norm.scss";

const UCA_NAME = "BraftEditor"

const initConfig = (props) => {
    let {config = {}} = props;
    config = __Zn.clone(config);
    config.controls = [
        'bold',                 // 粗体
        'italic',               // 斜体
        'underline',            // 下划线
        // 'strike-through',    // 删除线
        'separator',
        'text-color',           // 字体颜色
        'font-size',            // 字体大小
        'text-align',           // 字对齐
        'separator',
        'line-height',          // 行高
        'letter-spacing',       // 字间距
        'separator'
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
// const componentUp = (reference) => {
//     const {content} = reference.state;
//     const previous = content.toHTML();
//     // 如果捕捉到undefined，执行转换
//     let current = BraftEditor.createEditorState(reference.props.value).toHTML();
//     // 不可能为undefined，也就是必须是<p></p>，即BraftEditor的默认值
//     if (current && current !== previous) {
//         const content = BraftEditor.createEditorState(reference.props.value);
//         __Zn.of(reference).in({
//             content
//         }).done();
//         // reference.?etState({content});
//     }
// };

class Component extends React.PureComponent {
    displayName = UCA_NAME;

    constructor(props) {
        super(props);
        this.state = componentCt(this.props);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // 强制更新
        // componentUp(this);
    }

    render() {
        const {config = {}, content} = this.state;
        const cssStyle = componentCss(config);
        const {readOnly = false} = this.props;
        const WebField = __Zn.V4InputGroup;
        if (readOnly) {
            const attrInput = Sk.mixUca("BraftViewer");
            return (
                <WebField {...attrInput}>
                    <div style={cssStyle}>
                        {renderHTML(content.toHTML())}
                    </div>
                </WebField>
            )
        } else {
            const attrInput = Sk.mixUca(UCA_NAME);
            return (
                <WebField {...attrInput}>
                    <BraftEditor {...config}
                                 {...cssStyle}
                                 readOnly={readOnly}
                                 value={content}
                                 onChange={(editorState) => {
                                     if (editorState) {
                                         __Zn.of(this).in({
                                             content: editorState
                                         }).handle(() => {

                                             // 调用Ant中的OnChange
                                             __Zn.fn(this).onChange(editorState.toHTML())
                                             // __Zn.xtChange(reference, editorState.toHTML(), true);
                                         })
                                         // this.?etState({content: editorState});
                                         // // 调用Ant中的OnChange
                                         // __Zn.fn(this).onChange(editorState.toHTML())
                                         // // __Zn.xtChange(reference, editorState.toHTML(), true);
                                     }
                                 }}/>
                </WebField>
            );
        }
    }
}

export default Component;