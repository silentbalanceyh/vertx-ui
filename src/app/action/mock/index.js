import fnRoom from './fnRoom.json'
import fnFetchRoomType from './fnFetchRoomType'
import fnFetchCodePrice from './fnFetchCodePrice'
import fnFetchCodeCommission from './fnFetchCodeCommission'
import fnFetchCompensation from './fnFetchCompensation'
import fnFetchCodeGroup from './fnFetchCodeGroup'
import fnTabular from './fnTabularData'
import fnFetchPayTerm from './fnFetchPayTerm'
import fnFetchHotel from './fnFetchHotel'
import fnFetchTent from './fnFetchTent'
import fnFetchFloor from './fnFetchFloor'
import fnApp from './fnApp';
import fnHotel from './fnHotel';
import fnPreApp from './fnPreApp';
import fnHtlStatus from './fnHtlStatus';
// 订单数据
import fnTodayOrder from './fnTodayOrder';
// 夜审数据
import fnTodayLeave from './fnTodayLeave';
import fnTodayContinue from './fnTodayContinue';
// 读取房间对应数据
import fnRoomBill from './fnRoomBill';
import fnRoomBook from './fnRoomBook';
import fnRoomOrder from './fnRoomOrder';

export default {
    // 订单数据信息
    fnTodayOrder,
    fnTodayLeave,
    fnTodayContinue,
    // 房间对应接口
    fnRoom,
    fnRoomBill,
    fnRoomBook,
    fnRoomOrder,
    // 辅助数据
    fnFetchRoomType,
    fnFetchCodePrice,
    fnFetchCodeCommission,
    fnFetchCompensation,
    fnFetchCodeGroup,
    fnFetchPayTerm,
    fnFetchHotel,
    fnFetchTent,
    fnFetchFloor,
    // 全局专用处理数据
    fnTabular,
    fnHotel,
    fnApp,
    fnPreApp,
    fnHtlStatus
}
