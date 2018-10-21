import Default from './Ux.Jsx.Default';
import Op from './Ux.Jsx.Op';
import Single from './Ux.Jsx.Single';
import ViewFn from './Ux.Jsx.View.Fn';
import View from './Ux.Jsx.View';

export default {
    ...Default,
    ...Op,
    ...Single,
    ...ViewFn,
    // 不暴露不该暴露的渲染函数
    extractValue: View.extractValue,
};