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
            const {rxSubmit} = reference.props;
            if (Ux.isFunction(rxSubmit)) {
                const {$data = []} = reference.state;
                const unique = Ux.elementUnique($data, 'key', $selected);
                rxSubmit(unique);
                reference.setState({$visible: false});
            } else {
                console.error("核心函数 rxSubmit 丢失！");
            }
        } else {
            const {$op = {}} = reference.state;
            if ($op.submit) {
                const {empty} = $op.submit;
                Ux.messageFailure(empty);
            }
        }
    },
    onRowSelect: (reference) => {
        return {
            type: "radio",
            onChange: (changeKey) => {
                if (1 === changeKey.length) {
                    const $selected = changeKey[0];
                    reference.setState({$selected});
                }
            }
        }
    },
    onSearch: (reference) => (searchText) => {
        const {rxSource} = reference.props;
        if (Ux.isFunction(rxSource)) {
            reference.setState({$loading: true, $selected: undefined})
            rxSource(searchText).then(($data = []) => {
                /* 前端备注 key */
                $data.forEach(Ux.applyKey);
                reference.setState({$loading: false, $data})
            })
        } else {
            console.error("核心函数 rxSource 丢失！");
        }
    }
}