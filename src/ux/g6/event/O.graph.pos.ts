import {ModeLayout} from "./I.contract";

const FACTOR = 2.4;

class GPos {
    private readonly _mode: ModeLayout = ModeLayout.LeftRight;

    private _width: number = 0;
    private _height: number = 0;

    private _widthInner: number = 0;
    private _heightInner: number = 0;

    private _center: any = {};
    private _adjust: any = {
        x: 0, y: 0
    };

    constructor(position: any) {
        if (position) {
            // 已配置 position
            const {start, mode = ModeLayout.LeftRight} = position;
            this._mode = mode;
            if (start) {
                const {x = 0, y = 0} = start;
                this.init(x, y);
            } else {
                // 无法读取 start，默认初始化
                this.init();
            }
        } else {
            // 未配置 position，默认初始化
            this.init();
        }
    }

    /**
     * 修改 pos 内部位置处理
     * @param {Number} adjustY Y轴偏移量
     * @param {Number} adjustX X轴偏移量
     */
    compress = (adjustY: number = 0, adjustX: number = 0) => {
        // 重算偏移量
        this._adjust.x = adjustX;
        this._adjust.y = adjustY;
        // 重算中心点
        const _width = this._widthInner - adjustX;
        const _height = this._heightInner - adjustY;
        this._center.x = parseInt(String(_width / FACTOR));
        this._center.y = parseInt(String(_height / FACTOR));
        // 重新赋值
        this._width = _width;
        this._height = _height;
    }

    // 构造核心数据
    width = () => this._width;

    height = () => this._height;

    adjust = () => this._adjust;

    center = () => this._center;

    mode = () => this._mode;

    // 私有函数执行初始化
    private init(inWidth: number = 0, inHeight: number = 0): void {
        this._width = document.body.offsetWidth - inWidth;
        this._height = document.body.offsetHeight - inHeight;

        this._widthInner = this._width;
        this._heightInner = this._height;

        // 中心点
        const _center: any = {};
        _center.x = parseInt(String(this._width / FACTOR));
        _center.y = parseInt(String(this._height / FACTOR));

        this._center = _center;
    }
}

export default GPos;