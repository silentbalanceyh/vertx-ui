import Ux from 'ux';

export default {
    onClick: (reference) => (event) => {
        Ux.prevent(event);
        reference.setState({$visible: true})
    },
    onSubmit: (reference) => (event) => {
        Ux.prevent(event);
        const {$selected, $data = []} = reference.state;
        if ($selected) {
            const unique = Ux.elementUnique($data, 'key', $selected);
            const {rxSubmit, config = {}} = reference.props;
            /*
             * optionJsx.config.linker 操作
             */
            const formValues = {};
            Ux.writeLinker(formValues, config, () => unique);
            const ref = Ux.onReference(reference, 1);
            Ux.formHits(ref, formValues);

            if (Ux.isFunction(rxSubmit)) {
                rxSubmit(unique);
            }
            reference.setState({$visible: false});
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