import marked from 'marked';
import renderHTML from 'react-render-html';
import hljs from 'highlight.js';
import 'highlight.js/styles/xcode.css';
import Images from './images';
// 数据文件
const renderMd = new marked.Renderer();
marked.setOptions({
    renderer: renderMd,
    tables: true,
    breaks: false,
    sanitize: false,
    highlight: (code, language) => language
        ? hljs.highlight(language, code).value
        : hljs.highlightAuto(code).value
});

const renderContent = (key) => (reference) => {
    const {$source = {}} = reference.state;
    let original = $source[key] ? $source[key] : "";
    Object.keys(Images).forEach(foundKey => {
        original = original.replace(foundKey,
            `<img alt="${foundKey}" src="${Images[foundKey].src}" style="${Images[foundKey].style ? Images[foundKey].style : ""}"/>`)
    })
    return renderHTML(marked(original));
}

export default {
    tabIntro: renderContent('tabIntro'),
    tabLayout: renderContent('tabLayout'),
    tabSource: renderContent('tabSource'),
    tabComponent: renderContent('tabComponent'),
    tabRule: renderContent('tabRule')
}