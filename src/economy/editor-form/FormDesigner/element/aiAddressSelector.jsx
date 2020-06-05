import React from 'react';
import {component} from "../../../_internal";
import {Form} from "antd";
import Sd from './aiShared';

@component({
    "i18n.cab": require('./Cab.json'),
    "i18n.name": "aiAddressSelector",
})
class Component extends React.PureComponent {
    componentDidMount() {
        Sd.yiComponent(this, {
            id: "SubForm-Setting-aiAddressSelector",
            renders: {
                addrCountryApi: Sd.yoRenders.addrCountryApi,
                addrStateApi: Sd.yoRenders.addrStateApi,
                addrCityApi: Sd.yoRenders.addrCityApi,
                addrRegionApi: Sd.yoRenders.addrRegionApi,
                addrInitApi: Sd.yoRenders.addrInitApi
            }
        });
    }

    render() {
        const {$inited = {}} = this.props;
        return Sd.yoComponent(this, $inited);
    }
}

export default Form.create({})(Component)