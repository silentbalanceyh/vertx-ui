import SkinSpecification, {withEnv} from '../__.theme.shared/SkinSpecification';
import {theme} from 'antd';

export default class implements SkinSpecification {

    private readonly envRef: any = null;

    constructor(envRef: any) {
        this.envRef = envRef;
    }

    config_provider(): Object {
        const token = withEnv(this.envRef);
        return {
            theme: {
                token,
                algorithm: theme.darkAlgorithm,
            }
        }
    }

    config_token(settings: any = {}): Object {
        return {}
    }
};