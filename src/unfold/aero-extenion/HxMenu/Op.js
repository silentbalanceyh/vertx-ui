import Ux from 'ux';
import React from 'react';
import {SafetyCertificateOutlined} from '@ant-design/icons';

const yoCol = (reference, cindex) => {
    const {config = {}} = reference.props;
    const {$span} = reference.state;
    const {columns = 3} = config;
    const attrs = {};
    if (0 === cindex) {
        attrs.className = "hx-col-f";
    } else if ((columns - 1) === cindex) {
        attrs.className = "hx-col-l";
    } else {
        attrs.className = "hx-col-c";
    }
    attrs.span = $span;
    return attrs;
}
const yoData = (reference, cell = {}) => {
    const {config = {}, data = {}, $owner = {}} = reference.props;
    const {webTree = {}, webAdmit} = config;
    // DEV-MENU / SYS-MENU require your role `admit = true`
    const dataArray = Ux.clone(data[cell.value] ? data[cell.value] : []);
    dataArray.forEach(menu => {
        // disabled or not
        if (webAdmit && 0 < webAdmit.length && webAdmit.includes(menu.type)) {
            menu.disabled = !$owner['power'];
        }

        // icon process
        if (menu.icon) {
            menu.icon = Ux.v4Icon(menu.icon, {
                style: {
                    fontSize: 14,
                }
            })
        }
    })
    return Ux.toTree(dataArray, webTree);
}
const yoCard = (reference, cell = {}) => {
    // Card Attribute
    const attrCard = {};
    attrCard.size = "small";
    const {config = {}} = reference.props;
    const {webAdmit} = config;
    if (webAdmit && 0 < webAdmit.length) {
        if (webAdmit.includes(cell.value)) {
            attrCard.title = (
                <span>
                    <SafetyCertificateOutlined
                        style={{
                            color: "#FFA500",
                            fontSize: 16
                        }}/>
                    &nbsp;
                    {cell.label}
                </span>
            )
        } else {
            attrCard.title = (
                <span>
                    <SafetyCertificateOutlined
                        style={{
                            color: "#32CD32",
                            fontSize: 16
                        }}/>
                    &nbsp;
                    {cell.label}
                </span>
            )
        }
    } else {
        attrCard.title = cell.label;
    }
    return attrCard;
}
export default {
    // column
    yoCol,
    yoData,
    yoCard
}