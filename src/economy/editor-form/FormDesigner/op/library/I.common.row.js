import Ux from 'ux';

export default {
    rowRefresh: (reference, data = []) => {
        // reference.setState({$cells});
        const {config = {}} = reference.props;
        const rowConfig = {};
        rowConfig.config = config;
        rowConfig.data = data;
        Ux.fn(reference).rxRowConfig(rowConfig);
    }
}