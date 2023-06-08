import React from 'react';
import __Zn from '../zero.uca.dependency';

import ParamPanel from '../ParamPanel/UI';

export default (reference) => {
    const {data = []} = reference.state;
    return (
        <ParamPanel data={data} onChange={((data = []) => {
            __Zn.of(reference).in({
                data: __Zn.clone(data)
            }).hide().handle(() => {

                const magic = {};
                data.forEach(item => magic[item.name] = item.value);
                /* 将 magic 传入 */
                __Zn.fn(reference).onChange(magic);
            })
            // reference.?etState({data: __Zn.clone(data)});
            // const magic = {};
            // data.forEach(item => magic[item.name] = item.value);
            // /* 将 magic 传入 */
            // __Zn.fn(reference).onChange(magic);
            // reference.?etState({$visible: false});
        })} reference={reference} $changeCascade={false}/>
    );
}