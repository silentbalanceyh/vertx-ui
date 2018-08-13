const rxAdd = (reference, connectKey) => (event) => {
    event.preventDefault();
    reference.setState({
        show: true,
        editKey: undefined,
        connectKey
    })
};

const rxClose = (reference) => (event) => {
    event.preventDefault();
    reference.setState({
        show: false,
        editKey: undefined,
        connectKey: ""
    })
};
export default {
    rxAdd,
    rxClose
}