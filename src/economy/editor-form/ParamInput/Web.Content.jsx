import React from 'react';
import Ux from 'ux';
import './Cab.less';
import ParamPanel from '../ParamPanel/UI';

export default (reference) => {
    const {data = []} = reference.state;
    return (
        <ParamPanel data={data} onChange={((data = []) => {
            reference.setState({data: Ux.clone(data)});
            const magic = {};
            data.forEach(item => magic[item.name] = item.value);
            /* 将 magic 传入 */
            Ux.fn(reference).onChange(magic);
            reference.setState({$visible: false});
        })} reference={reference} $changeCascade={false}/>
    );
}