import {PureComponent} from 'react';
import marked from 'marked';
import renderHTML from 'react-render-html';
import hljs from 'highlight.js';
import 'highlight.js/styles/xcode.css';

const renderMD = new marked.Renderer();
marked.setOptions({
    renderer: renderMD,
    tables: true,
    breaks: false,
    sanitize: false,
    highlight: (code, language) => language
        ? hljs.highlight(language, code).value
        : hljs.highlightAuto(code).value
});

class MarkdownRenderer extends PureComponent {

    render() {
        const {$source} = this.props;
        return $source ? renderHTML(marked($source)) : null;
    }
}

export default MarkdownRenderer;