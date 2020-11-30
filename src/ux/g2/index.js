import g2Bar from './O.g2.bar';

const g2Add = (graphic, data = []) => {
    if (graphic) {
        graphic.data(data);
        graphic.render();
    }
}
const g2Update = (graphic, data = []) => {
    if (graphic) {
        graphic.changeData(data);
        graphic.render();
    }
}
export default {
    g2Add,
    g2Update,
    // 创建图引用
    g2Bar,
}