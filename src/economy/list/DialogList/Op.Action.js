import Init from './Op.Init';
import Ux from 'ux';

const rxAdd = (reference, connectKey) => (event) => {
    event.preventDefault();
    reference.setState({
        show: true,
        // 互斥写法
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
        // 互斥写法
        editKey: id,
        connectKey
    })
};

const rxDelete = (reference, id) => {
    const {$self} = reference.props;
    Ux.itemDelete(reference, id);
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
        addKey: undefined,
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
const rxReset = (reference) => () => {
    reference.setState({editKey: undefined})
};
export default {
    rxAdd,
    rxClose,
    rxEdit,
    rxDelete,
    rxList,
    rxReset
}