import __Zn from './zero.uca.dependency';
import React from 'react';

const Cv = __Zn.Env;
export default {
    TAG: (reference, column = {}) => {
        const $config = column[Cv.K_NAME.CONFIG] ? column[Cv.K_NAME.CONFIG] : {};
        return (text) => {
            // $empty
            if (text) {
                const {size = 24} = $config;
                // tag:xxx
                // icon
                if (text.startsWith("tag:")) {
                    const key = text.split(":")[1];
                    const image = Cv.TAG[key];
                    return (
                        <img src={image} style={{
                            width: size,
                            height: size,
                        }} alt={text}/>
                    )
                } else {
                    return __Zn.v4Icon(text, {
                        style: {fontSize: size}
                    });
                }
            } else return column[Cv.K_NAME.EMPTY];
        };
    },
}