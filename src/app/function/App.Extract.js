import Ux from 'ux';

const extract = (reference, md = "", json) => {

};

const markdown = (reference, ...uris) => {
    const array = [];
    uris.forEach(uri => array.push(Ux.ajaxResource(uri)));
    return Promise.all(array).then(md => reference.setState({md}))
};
const markdownPrepare = (reference, ...files) => {
    const {md = []} = reference.state;
    const {$hoc} = reference.props;
    console.info($hoc);
    const $markdown = [];
    md.forEach((each, index) => {
        const item = {};
        item.key = Ux.randomUUID();
        item.header = files[index];
        item.content = each;
        $markdown.push(item);
    });
    return $markdown;
};
export default {
    extract,
    markdown,
    markdownPrepare
}