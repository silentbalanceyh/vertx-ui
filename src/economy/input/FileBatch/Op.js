import Ux from 'ux';

const rxVCard = (reference) => (event) => {
    Ux.prevent(event);
    reference.setState({$listType: "picture-card"});
}
const rxVList = (reference) => (event) => {
    Ux.prevent(event);
    reference.setState({$listType: "text"});
}
const rxVClean = (reference) => (event) => {
    Ux.prevent(event);
    Ux.fn(reference).onChange([]);
    reference.setState({fileList: []});
}
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    rxVCard,
    rxVList,
    rxVClean,
}