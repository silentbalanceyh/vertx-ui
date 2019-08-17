import Event from '../Op.Event';

export default (reference) => {
    const buttons = {};
    const {config = {}} = reference.props;
    buttons.id = config.button;
    buttons.className = "ux-hidden";
    buttons.onClick = Event.rxSubmit(reference);
    return buttons;
}