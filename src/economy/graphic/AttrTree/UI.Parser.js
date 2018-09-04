const parseConfig = (ref) => {
    const {reference, $configuration} = ref.props;
    if ($configuration) {
        return $configuration;
    } else {
        const {$hoc} = reference.state;
        return $hoc._("configuration");
    }
};

const parseData = (ref) => {
    const {reference, $configuration} = ref.props;
    if ($configuration) {
        return $configuration.data
    } else {
        const {$hoc} = reference.state;
        return $hoc._("data");
    }
};

export default {
    parseConfig,
    parseData,
}