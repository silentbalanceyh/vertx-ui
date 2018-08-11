import Ux from 'ux';

const fnDialog = (reference: any = {}, show = false) => (event: any) => {
    event.preventDefault();
    reference.setState({$visible: show})
};

const fnChange = (reference: any = {}) => (pagination: any, filters: any, sorter: any) => {
    reference.setState({$loading: true, $visible: true});
    const {config = {}, mock} = reference.props;
    if (config.ajax) {

        const params = fnParams(reference);
        params.pager.size = pagination.pageSize;
        params.pager.page = pagination.current;
        Ux.asyncData(config.ajax, params, ($data) => {
            reference.setState({$loading: false, $data});
        }, mock)
    }
};

const fnParams = (reference: any) => {
    const {config = {}} = reference.props;
    Ux.E.fxTerminal(!config.ajax, 10053, config);
    if (config.ajax) {
        const ref = Ux.onReference(reference, 1);
        Ux.E.fxTerminal(!ref, 10079, ref);
        if (ref) {
            return Ux.parseAjax(ref, config.ajax.params);
        }
    }
};

const fnLoading = (reference: any = {}) => (event: any) => {
    event.preventDefault();
    reference.setState({
        $loading: true, $visible: true,
        $data: [], $tableKey: Ux.randomString(16),
        $select: undefined
    });
    const {config = {}, mock} = reference.props;
    if (config.ajax) {
        const params = fnParams(reference);
        Ux.asyncData(config.ajax, params, ($data) => {
            reference.setState({$loading: false, $data});
        }, mock);
    }
};

const fnSelect = (reference: any = {}) => (event: any) => {
    event.preventDefault();
    const {$select} = reference.state;
    const {config = {}} = reference.props;
    const ref = reference.props.reference;
    if ($select) {
        if (config.linker) {
            const values = Ux.Uson.create($select)
                .keep(Object.keys(config.linker))
                .convert(config.linker)
                .date(config.linkerDate).to();
            Ux.E.fxInfo(true, 10081, config.linker, values);
            Ux.formHits(ref, values);
            const {fnCallback} = config;
            if (fnCallback) {
                fnCallback($select);
            }
        }
        reference.setState({$visible: false})
    } else {
        Ux.E.fxTerminal(!config.validation, 10080, config.validation);
        if (config.validation) {
            Ux.showError(ref, config.validation);
        }
    }
};

export default {
    fnDialog,
    fnLoading,
    fnChange,
    fnSelect
}
