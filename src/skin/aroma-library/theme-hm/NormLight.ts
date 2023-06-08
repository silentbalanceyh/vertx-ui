import SkinSpecification, {withEnv} from '../__.theme.shared/SkinSpecification';

export default class implements SkinSpecification {

    private readonly envRef: any = null;

    constructor(envRef: any) {
        this.envRef = envRef;
    }

    config_provider(): Object {
        const token = withEnv(this.envRef);
        return {
            theme: {
                token
            }
        }
    }

    config_token(settings: any = {}): Object {
        return {
            sider: {
                colorTextMenuActive: settings.colorPrimary,
                colorTextMenuItemHover: settings.colorPrimary,
                colorTextMenuSelected: settings.colorPrimary,
            },
            header: {
                colorTextMenuActive: settings.colorPrimary,
                colorTextMenuSelected: settings.colorPrimary
            }
        }
    }
}