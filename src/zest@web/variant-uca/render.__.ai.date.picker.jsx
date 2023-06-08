import React from 'react';
import {DatePicker} from "antd";
import {_Ant} from 'zo';
// // import DatePicker from './O.picker.date';
// const __dataDay = (value) => {
//     let listData;
//     switch (value.date()) {
//         case 8:
//             listData = [
//                 {type: 'warning', content: 'This is warning event.'},
//                 {type: 'success', content: 'This is usual event.'},
//             ];
//             break;
//         case 10:
//             listData = [
//                 {type: 'warning', content: 'This is warning event.'},
//                 {type: 'success', content: 'This is usual event.'},
//                 {type: 'error', content: 'This is error event.'},
//             ];
//             break;
//         case 15:
//             listData = [
//                 {type: 'warning', content: 'This is warning event'},
//                 {type: 'success', content: 'This is very long usual event。。....'},
//                 {type: 'error', content: 'This is error event 1.'},
//                 {type: 'error', content: 'This is error event 2.'},
//                 {type: 'error', content: 'This is error event 3.'},
//                 {type: 'error', content: 'This is error event 4.'},
//             ];
//             break;
//         default:
//     }
//     return listData || [];
// };
// const __dataMonth = (value) => {
//     if (value.month() === 8) {
//         return 1394;
//     }
// };
// const __mountRender = (jsx = {}) => {
//     jsx.cellRender = (dayJs, info = {}) => {
//         if (info.type === 'date') {
//             const listData = __dataDay(dayJs);
//             return (
//                 <ul className="events">
//                     {listData.map(item => (
//                         <li key={item.content}>
//                             <Badge status={item.type} text={item.content}/>
//                         </li>
//                     ))}
//                 </ul>
//             );
//         }
//         if (info.type === 'month') {
//             const num = __dataMonth(dayJs);
//             return num ? (
//                 <div className="notes-month">
//                     <section>{num}</section>
//                     <span>Backlog number</span>
//                 </div>
//             ) : null;
//         }
//         return info['originNode'];
//     }
// }
// Fix issue: 'monthCellRender' is deprecated. Please use 'cellRender' instead.
const aiDatePicker = (reference, jsx = {}, onChange) => {
    // DisabledDate
    _Ant.onDisabledDate(jsx);
    // onChange处理
    const {config = {}, depend} = jsx;
    _Ant.onChange(jsx, onChange, {
        reference,
        depend,
        config,
    });
    // 处理readOnly
    _Ant.onReadOnly(jsx, true, reference);
    if (!jsx.style) {
        jsx.style = {width: "100%"};
    }
    return (<DatePicker {...jsx} className={"ux_readonly ux_date_picker"}/>);
}
export default {
    aiDatePicker,
}