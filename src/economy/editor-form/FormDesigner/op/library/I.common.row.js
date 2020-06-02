import Ux from 'ux';

export default {
    /*
     * 这里的 reference 是 Row
     */
    rowRefresh: (reference, data = []) => {
        const {config = {}} = reference.props;
        const rowConfig = {};
        rowConfig.key = config.key;
        rowConfig.data = data;
        Ux.fn(reference).rxRowConfig([rowConfig]);
    }
}