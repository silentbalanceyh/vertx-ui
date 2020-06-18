import Ux from 'ux';
import Ex from 'ex';

const toInit = (reference, input = {}) => {
    const {$identifier} = reference.props;
    const inited = {};
    if ($identifier) {
        inited.identifier = $identifier;
        const model = Ux.elementUniqueDatum(reference,
            "resource.models", "identifier", $identifier);
        if (model) {
            inited.modelName = model.alias;
        }
        const category = Ux.elementUniqueDatum(reference,
            "data.category", "identifier", $identifier);
        if (category) {
            inited.category = category.name;
        }
    }
    if (input.code) {
        const replaced = `form.${$identifier}.`;
        inited.code = input.code.replace(replaced, "");
    }
    if (!input.metadata) {
        inited.metadata = {
            design: true,
            deletion: true
        }
    }
    inited.active = true;
    return inited;
}

const onAdd = (reference) => (event) => {
    Ux.prevent(event);
    const data = toInit(reference);
    Ex.uiDialog(reference,
        __dialog => __dialog.onOpen(data)
    );
};
const onEdit = (reference, $inited) => (event) => {
    Ux.prevent(event);
    const data = toInit(reference, $inited);
    Ex.uiDialog(reference,
        __dialog => __dialog.onOpen(Object.assign({}, $inited, data))
    );
};
const onDelete = (reference, $inited = {}) => () => {
    reference.setState({$loading: true});
    Ux.ajaxDelete(`/api/ui-form/:key`, {key: $inited.key}).then(deleted => {
        let {$data = []} = reference.state;
        if (deleted) {
            $data = $data.filter(item => $inited.key !== item.key);
        }
        reference.setState({$data});
        Ux.toLoading(() => reference.setState({$loading: false}), 20);
    })
};
const onDesign = (reference, $inited) => (event) => {
    Ux.prevent(event);
    /* 上册引用 */
    Ex.uiTab(reference,
        __tabs => __tabs.onOpen('tabDesign', $inited)
    );
};
const onClose = (reference) => (event) => {
    Ux.prevent(event);
    Ex.uiTab(reference,
        __tabs => __tabs.onClose('tabDesign')
    );
}
export default {
    onAdd,
    onEdit,
    onDelete,
    onDesign,
    onClose
}