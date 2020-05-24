import Mock from 'mock';

const yiPage = (reference) => {
    const state = {};
    state.$ready = true;
    state.$data = Mock.Editor.form;
    reference.setState(state);
}
export default {
    yiPage
}