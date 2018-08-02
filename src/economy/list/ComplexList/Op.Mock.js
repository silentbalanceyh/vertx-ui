import Ux from 'ux';

const mockCheck = (reference, options = {}, state = {}) => {
    if (options['mock.enabled']) {
        const {$list} = reference.props;
        if (!$list) {
            state['mock'] = true;
        }
    }
};
const mockInit = (reference) => {
    const {mock, mocker} = reference.state;
    if (mock && !mocker) {
        const {$mockData = {}} = reference.props;
        let mocker = Ux.mockCrud(reference.props.reference).bind($mockData.data);
        Ux.Logger.mocker(mocker);
        reference.setState({mocker});
    }
};
const mockConnect = (reference, data) => {
    const {mock, mocker} = reference.state;
    const {$query} = reference.props;
    if (mock && mocker) {
        // 当mock打开的时候调用mocker中的过滤数据
        return mocker.filter($query.is() ? $query.to() : {}).to();
    } else {
        return data;
    }
};
export default {
    mockCheck,
    mockInit,
    mockConnect
}