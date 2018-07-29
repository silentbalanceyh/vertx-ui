import Ux from 'ux';

const demoClick = (reference, message) => (event) => {
    reference.setState({message});
    Ux.writeButton(reference, event)(true);
};

const demoMarkdown = (reference, uri) => {
    Ux.ajaxResource(uri).then(source => {
        reference.setState({source})
    });
};
export default {
    demoClick,
    demoMarkdown
}