/*
 * 窗口函数，用于构造新窗口专用，窗口引用主要用于区域的 resize 动作
 */
class GWindow {
    private readonly referenceRef = null;
    private adWidth: number = 0;
    private adHeight: number = 0;

    constructor(reference: any) {
        this.referenceRef = reference;
    }

    adjustW(adWidth: number = 0): GWindow {
        this.adWidth = adWidth;
        return this;
    }

    adjustH(adHeight: number = 0): GWindow {
        this.adHeight = adHeight;
        return this;
    }

    adjust(adWidth: number = 0, adHeight: number = 0): GWindow {
        this.adWidth = adWidth;
        this.adHeight = adHeight;
        return this;
    }

    dataOption(): any {
        const range = {height: 0, width: 0};
        range.width = document.body.offsetWidth - this.adWidth;
        range.height = document.body.offsetHeight - this.adHeight;
        return range;
    }

    resizeFn(graph): any {
        const options = this.dataOption();
        return () => {
            if (graph) {
                const {width, height} = options;
                graph.resize(width, height);
            }
        }
    }
}

export default GWindow;