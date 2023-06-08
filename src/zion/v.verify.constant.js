import __VALIDATOR_COMMON from './verify.__.fn._.validator.common';
import __VALIDATOR_ASYNC from './verify.__.fn._.validator.async';

import __NORMALIZER_COMMON from './verify.__.fn._.normalizer.common';

export default {

    V_NORMALIZER: {
        ...__NORMALIZER_COMMON,
    },
    V_VALIDATOR: {          // 常量验证器
        ...__VALIDATOR_ASYNC,
        ...__VALIDATOR_COMMON,
    },
}