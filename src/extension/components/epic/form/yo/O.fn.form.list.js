import Ex from 'ex';

export default (reference) => {
    const {$identifier} = reference.props;
    if ($identifier) {
        const state = {};
        Ex.I.forms($identifier).then(forms => {
            state.$data = forms;
            state.$ready = true;
            reference.setState(state);
        })
    } else {
        const state = {};
        state.error = `Error to read form configuration, the "$identifier" is null, could not get forms.`;
        reference.setState(state);
    }
}