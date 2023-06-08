import yoDynamic from './channel.@fn.yo.dynamic';
import Ux from "ux";

export default (reference) => {
    const attrs = yoDynamic(reference);
    /*
     * 初始化数据
     */
    const {
        $inited = {},
        $qr = {},
    } = reference.props;
    if (Ux.isEmpty($inited)) {
        attrs.$inited = Ux.clone($qr);
        // $condition中全部模糊匹配
    } else {
        // 直接处理 $inited 部分
        attrs.$inited = Ux.clone($inited);
    }
    {
        // #QR_LOCK
        const {$qrVLock = [], $qr = {}} = reference.props;
        if (0 < $qrVLock.length) {
            const $edition = {};
            Object.keys($qr).forEach(fieldQr => {
                const fields = fieldQr.split(',');
                const field = fields[0];
                if ($qrVLock.includes(field)) {
                    const op = fields[1] ? fields[1] : "=";
                    $edition[`${field},${op}`] = false;
                }
            })
            attrs.$edition = $edition;
        }
    }
    return attrs;
}