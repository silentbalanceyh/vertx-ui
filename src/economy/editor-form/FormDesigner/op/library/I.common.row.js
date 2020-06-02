import Ux from 'ux';

export default {
    rowRefresh: (reference, $cells = []) => {
        reference.setState({$cells});
        const {config = {}} = reference.props;
        const rowConfig = {};
        rowConfig.key = config;
        rowConfig.data = $cells;
        Ux.fn(reference).rxRowConfig(rowConfig);
    }
}