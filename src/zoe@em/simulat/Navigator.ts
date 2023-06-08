import DataRouter from "./DataRouter";
import BindContainer from "./BindContainer";
import StateIn from '../state/StateIn';

class Navigator implements BindContainer {
    private active: string = "";
    private aside: string = "";
    private keys: Array<String> = [];

    constructor(
        data: {
            active: string;
            aside: string;
            keys: Array<String>;
        } = {
            active: undefined,
            aside: undefined,
            keys: []
        }
    ) {
        this.active = data.active;
        this.aside = data.aside;
        this.keys = data.keys;
    }

    init(router: DataRouter): void {
        const params = router.params();
        this.active = params.nid;
        this.aside = params.sid;
    }

    __type(): String {
        return "Navigator"
    }

    /**
     * 根据属性真实执行Redux写路径
     * @param props
     */
    flush(props: any = {}): void {
        const {fnFlush} = props;
        // 必须更新引用，不仅仅是更新内容
        const reference = this;
        if (fnFlush) {
            fnFlush(new StateIn(
                {
                    "layout.navigator": reference
                },
                null
            ));
        }
    }

    get(): any {
        const sid = this.aside;
        const nid = this.active;
        const keys = this.keys;
        return {sid, nid, keys};
    }

    /**
     * 生成绑定按钮执行操作的函数：Link
     * @param props
     * @param {string} active
     * @param {string} aside
     * @returns {Function}
     */
    bind(props: any, active: string, aside: string): Function {
        const reference = this;
        return (event: any) => {
            reference.active = active;
            reference.aside = aside;
            reference.flush(props);
        };
    }

    isActive(nid: string, sid: string): boolean {
        let match: boolean = false;
        if (sid) {
            match = sid === this.aside;
        }
        if (nid) {
            match = nid === this.active;
        }
        return match;
    }

    setActive(nid: string, sid: string): void {
        this.active = nid;
        this.aside = sid;
    }

    setKeys(keys: Array<any>): void {
        this.keys = keys;
    }
}

export default Navigator;
