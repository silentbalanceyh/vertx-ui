import Init from './Op.Init';
import Ux from 'ux';

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
    const {$self} = reference.props;
    rxList(reference, true)(id, {});
    const {rxDelete} = $self;
    if (rxDelete) {
        rxDelete(id);
    }
};

const rxClose = (reference) => (event) => {
    if (event) {
        event.preventDefault();
    }
    reference.setState({
        show: false,
        editKey: undefined,
        connectKey: ""
    })
};
const rxList = (reference, deleted = false) => (id, record) => {
    const {$items} = reference.props;
    const dataRecord = Ux.rapitRecord($items, id, record, deleted);
    Ux.writeTree(reference, {
        "list.items": dataRecord
    })
};
export default {
    rxAdd,
    rxClose,
    rxEdit,
    rxDelete,
    rxList
}