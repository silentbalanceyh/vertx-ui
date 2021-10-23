import Mock from 'mock';

const yiPage = (reference) => {
    const state = {};
    state.$ready = true;
    state.$data = Mock.Editor.form;
    state.$model = Mock.Editor.model;
    reference.setState(state);
}
export default {
    yiPage
}