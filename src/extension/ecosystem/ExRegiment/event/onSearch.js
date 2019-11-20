import Ux from 'ux';

export default (reference, config = {}) => (inputText) => {
    const {$query = {}} = reference.state;
    const {condition = []} = config;
    const $condition = Ux.qrInput(condition, inputText);
    const query = Ux.qrCombine($query, reference, $condition);
    reference.setState({$query: query});
}