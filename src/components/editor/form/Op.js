import Mock from 'mock';

const yiPage = (reference) => {
    const state = {};
    state.$ready = true;
    const json = Mock.Editor.form;
    const {_form} = json;
    if (_form) {
        state.$data = _form;
    }
    state.$model = Mock.Editor.model;
    reference.setState(state);
}
export default {
    yiPage
}