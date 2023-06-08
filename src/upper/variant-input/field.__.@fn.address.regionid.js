import Ux from 'ux';

export default (reference, jsx) => {
    const onChange = (selected, options) => {
        // 1.构造Form专用数据
        const data = {};
        // 城市数据提取
        const countryId = selected[0];
        const country = Ux.elementUnique(options, "value", countryId);
        if (country) {
            data.country = country.label;
            // 省会
            const stateId = selected[1];
            const state = Ux.elementUnique(country.children, "value", stateId);
            if (state) {
                data.state = state.label;
                // 城市
                const cityId = selected[2];
                const city = Ux.elementUnique(state.children, "value", cityId);
                if (city) {
                    data.city = city.label;
                    // 区域
                    const regionId = selected[3];
                    const region = Ux.elementUnique(city.children, "value", regionId);
                    if (region) {
                        data.region = region.label;
                    }
                }
            }
            Ux.formHits(reference, data);
        } else {
            Ux.formHits(reference, {
                country: undefined,
                state: undefined,
                city: undefined,
                region: undefined,
            })
        }
    };
    return Ux.aiAddressSelector(reference, jsx, onChange)
}