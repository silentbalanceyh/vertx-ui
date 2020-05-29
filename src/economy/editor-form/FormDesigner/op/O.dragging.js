import Form from './O.dragging.web';
import Row from './O.dragging.row';
import Cell from './O.dragging.cell';

export default {
    Form,
    Row,
    Cell,
    /* 这两个事件会在拖拽过程中报错 */
    sourceFix: {
        onItemHover: (event) => {

        },
        onClick: (event) => {

        }
    }
};