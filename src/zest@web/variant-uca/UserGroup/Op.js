import __Zn from '../zero.uca.dependency';

const _configuration = (reference) => {
    const internal = __Zn.fromHoc(reference, "config");

    const $config = __Zn.clone(internal);
    const {config = {}} = reference.props;
    if (config.title) {
        $config.title = config.title;
    }

    // source configuration
    let source = __Zn.clone($config.source ? $config.source : {});
    if (config.source) {
        $config.source = __Zn.assign(source, config.source, 2)
    }
    return $config;
}

const _configType = (reference, source = {}) => {
    const {type} = source;
    const dataType = __Zn.onDatum(reference, type).sort(__Zn.sorterAscTFn('sort'));
    const options = [];
    dataType.forEach(item => {
        const option = {key: item.key, title: item.name};
        const icon = __Zn.configIcon(item.metadata);
        if (icon) {
            option.icon = __Zn.v4Icon(icon);
        }
        option.code = item.code;
        options.push(option);
    });
    return options;
}
const configValue = (reference, source, dataType = []) => {
    const {value} = source;
    const dataValue = __Zn.onDatum(reference, value);
    const values = [];
    dataType.forEach(type => {
        let found = __Zn.elementFind(dataValue, {
            category: type.code,
        });
        found = __Zn.clone(found);
        found.forEach(item => {
            item.icon = type.icon;
            values.push(item);
        })
    })
    return values;
}
export default {
    componentInit: (reference) => {
        const state = {};
        const $config = _configuration(reference);
        state.$config = $config;
        if ($config.source) {
            // Extract Data based on source
            const $dataType = _configType(reference, $config.source);
            state.$dataType = $dataType;
            if (0 < $dataType.length) {
                state.$dataKeys = [$dataType[0].code];
            } else {
                state.$dataKeys = [];
            }
            state.$dataValue = configValue(reference, $config.source, $dataType);
        }
        __Zn.of(reference).in(state).ready().done();
        // reference.?etState(state);
        // state.$ready = true;
    },
    rxViewQ: (reference) => ($checked = {}) => {
        // $dataKeys processing
        __Zn.of(reference).in({
            $dataKeys: [$checked.key]
        }).done();
        // reference.?etState({$dataKeys: [$checked.key]});
    },
    rxChange: (reference) => __Zn.fn(reference).onChange
}