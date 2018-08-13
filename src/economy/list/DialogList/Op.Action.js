import Init from './Op.Init';

const rxAdd = (reference, connectKey) => (event) => {
    event.preventDefault();
    reference.setState({
        show: true,
        editKey: undefined,
        connectKey
    })
};

const rxEdit = (reference, id) => {
    const {$self} = reference.props;
    const options = Init.readOption($self);
    const connectKey = options["op.edit.window"];
    $self.setState({
        show: true,
        editKey: id,
        connectKey
    })
};

const rxDelete = (reference, id) => {
    console.info("Delete", id);
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
    rxClose,
    rxEdit,
    rxDelete
}