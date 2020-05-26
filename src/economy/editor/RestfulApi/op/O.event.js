import Ux from 'ux';

export default {
    onClick: (reference) => (event) => {
        Ux.prevent(event);
        reference.setState({$visible: true})
    },
    onSubmit: (reference) => (event) => {
        Ux.prevent(event);
        const {$selected} = reference.state;
        if ($selected) {

        } else {
            const {$op = {}} = reference.state;
            if ($op.submit) {
                const {empty} = $op.submit;
                Ux.messageFailure(empty);
            }
        }
    },
    onSearch: (reference) => (searchText) => {
        const {$source} = reference.props;
        if (Ux.isFunction($source)) {
            reference.setState({$loading: true})
            $source(searchText).then(($data = []) => {
                /* 前端备注 key */
                $data.forEach(Ux.applyKey);
                reference.setState({$loading: false, $data})
            })
        }
    }
}