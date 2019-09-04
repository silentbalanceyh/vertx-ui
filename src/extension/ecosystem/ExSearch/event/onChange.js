import Ux from 'ux';

export default (reference) => (event) => {
    Ux.prevent(event);
    const searchText = event.target.value;
    reference.setState({searchText});
}