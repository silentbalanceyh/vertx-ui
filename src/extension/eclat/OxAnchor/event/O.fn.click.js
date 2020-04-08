import Ux from 'ux';

export default (reference) => (event) => {
    Ux.prevent(event);
    reference.setState({$visible: true});
}