import Ux from 'ux';

export default (config) => {
    const $config = Ux.clone(config);
    const formRef = $config.form;
    {
        // 默认3列给定值
        if (formRef && !formRef.hasOwnProperty('columns')) {
            formRef.columns = 3;
        }
        // 布局修正处理
        if (!formRef.hasOwnProperty('window')) {
            formRef.window = 1;
        }
        // options处理
        if (!formRef.options) {
            formRef.options = {window: formRef.window};
        }
    }
    return $config;
}