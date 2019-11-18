import Ux from 'ux';

export default (reference) => {
    const {$selected = []} = reference.state ? reference.state : {};
    return {
        onChange: Ux.rxChecked(reference),
        selectedRowKeys: $selected.map(selected => selected.key),
        fixed: true,
    }
}