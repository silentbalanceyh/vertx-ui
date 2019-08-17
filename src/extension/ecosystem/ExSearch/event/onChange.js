import Ex from 'ex';

export default (reference) => (event) => {
    Ex.prevent(event);
    const searchText = event.target.value;
    reference.setState({searchText});
}