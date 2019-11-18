import Ex from 'ex';

const yiPage = (reference) => {
    const {$name, data = {}} = reference.props;
    const state = {};
    if ($name) {
        Ex.I.form({code: $name}).then(form => {
            state.$ready = {};
            state.$config = form;
            state.$inited = data;
            reference.setState(state);
        })
    } else {
        console.error("[ Ex ] `ExRecord` 缺少重要变量 $name ");
    }
};
export default {
    yiPage
}