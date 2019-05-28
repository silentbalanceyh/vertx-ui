const irExClear = (reference = {}) => (event) => {
    event.preventDefault();
    console.info(reference.props);
};
const irExFilter = (reference = {}) => (event) => {

};
export default {
    irExClear,
    irExFilter,
}