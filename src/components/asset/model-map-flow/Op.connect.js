import Ux from "ux";

const rxTopNext = (reference, stepData, isNext = true) => {
    const {$data = {}, $step} = reference.state;
    let step = $step;
    if (isNext) {
        step = $step + 1;
    }
    const data = Ux.clone($data);
    if (stepData) {
        Object.assign(data, stepData)
    }
    reference.setState({
        $data: data,
        $step: step,
        $stepSub: 0
    });
}

export default {
    rxCheckedAll: (reference) => (event) => {
        const checked = event.target.checked;
        const {$options = []} = reference.state;
        if (checked) {
            const $keySet = new Set();
            $options.forEach(option => $keySet.add(option.value));
            reference.setState({$keySet});
        } else {
            const $keySet = new Set();
            reference.setState({$keySet});
        }
    },
    rxChecked: (reference) => (keys = []) => {
        const $keySet = new Set(keys);
        reference.setState({$keySet});
    },
    rxNext: (reference) => (params) => {
        const ref = Ux.onReference(reference, 1);
        const {$data = {}} = ref.state;
        const data = Ux.clone($data);
        if (params) {
            if (params.relation || params.action) {
                if (params.relation) {
                    if (!data.relation) {
                        data.relation = {};
                    }
                    Object.assign(data.relation, params.relation);
                }
                if (params.action) {
                    if (!data.action) {
                        data.action = {};
                    }
                    Object.assign(data.action, params.action);
                }
            } else {
                Object.assign(data, params);
            }
        }
        Ux.fn(reference).rxNext(data);
    },
    rxNextPage: (reference, isNext = true) => (params) => {
        const {$data = {}} = reference.state;
        const data = Ux.clone($data);
        if (params) {
            Object.assign(data, params);
        }
        reference.setState({$data: data});
        if (isNext) {
            Ux.fn(reference).rxNextPage(data);
        } else {
            Ux.fn(reference).rxFirstPage(data);
        }
    },
    rxTopNextPage: (reference) => (stepData = {}) =>
        rxTopNext(reference, stepData),
    rxTopFirstPage: (reference) => (stepData = {}) =>
        rxTopNext(reference, stepData, false),
    rxTopNext: (reference) => ($data = {}) => {
        const {$stepSub = 0} = reference.state;
        const stepSub = $stepSub + 1;
        reference.setState({$stepSub: stepSub, $data});
    },
    rxTopDelete: (reference) => ({key, field}) => {
        let {$data = {}} = reference.state;
        if (Ux.isArray($data[field])) {
            const original = $data[field];
            const replaced = original.filter(item => key !== item.key);
            $data = Ux.clone($data);
            $data[field] = replaced;
            reference.setState({$data});
        }
    }
}