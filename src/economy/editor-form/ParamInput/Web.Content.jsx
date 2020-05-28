import React from 'react';
import './Cab.less';
import ParamPanel from '../ParamPanel/UI';

export default (reference) => {
    const {onChange} = reference.props;
    const {data = []} = reference.state;
    return (
        <ParamPanel data={data} onChange={onChange}
                    reference={reference}/>
    );
}