import Ux from 'ux';

export default (reference) => {
    const extra = Ux.fromHoc(reference, "subtabsExtra");
    const {
        $activePage
    } = reference.state;
    if (extra && extra[$activePage]) {
        const buttons = extra[$activePage];
        const content = Ux.aiExprButtons(buttons, reference.props);
        const {$selected = {}} = reference.state;
        const selected = $selected[$activePage];
        content.forEach(each => each.disabled = !selected);
        return Ux.aiButtonGroup(reference, content);
    } else return false;
}