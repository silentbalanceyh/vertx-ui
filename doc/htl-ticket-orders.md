# API: /api/htl/ticket/orders

## Definition

```json
{
    "uri": "/api/htl/ticket/orders",
    "identifier": "htl.orders",
    "method":"POST",
    "paramType": "BODY",
    "in":"in.api.htl.ticket.orders.post",
    "out":"out.api.htl.ticket.orders.post",
    "address": "MSG://MESSAGE/QUEUE/DATA",
    "requiredParam": [
        "preservor",
        "phone",
        "orderItems"
    ],
    "responder": "com.vie.un.flow.JObjectRepdor"
}
```

## Request

```json
{
    "method": "OT，预定方式，-- ( ID：type=preorder.method )",
    "preservor": "R，联系人，-- ( 字符串 )",
    "phone": "R，联系电话，-- ( 字符串 )",
    "suretyType": "OT，担保类型，-- ( ID：type=surety.type )",
    "surety" : "O，担保人，-- ( 字符串 )",
    "comment" : "O，订单备注，-- ( 字符串 )",
    "ref": {
        "partner": "O，协议单位ID，-- ( ID )",
        "member": "O，会员ID，-- ( GUID )",
        "operator": "O，销售员ID，-- ( GUID )"
    },
    "sigma": "D，Sigma值，-- ( HASH )",
    "orderItems": [
        {
            "roomTypeId": "OA，预定房型，-- ( ID )",
            "brekker": "O，房包早？，-- ( 布尔值 )",
            "codePrice": "RA，房价码，-- ( ID )",
            "unitPrice": "R，房间单价，-- ( 金钱值 )",
            "arriveTime": "R，抵达日期，-- ( 日期时间 )",
            "insideDays": "R，入住天数，-- ( 正数 )",
            "leaveTime": "R，离店日期，-- ( 日期时间 )",
            "roomCounter": "R，预定房间数",
            "codeGroup": "OA，团购码，-- ( ID )",
            "codeCommission": "OA，佣金码，-- ( ID )",
            "insidePerson": "O，入住人数，-- ( 正数 )",
            "pos": "O，POS转账？，-- ( 布尔值 )",
            "hotelId": "DA，酒店ID，-- ( ID )",
            "sigma": "D，Sigma值，-- ( HASH )",
            "key": "( 前端，无实际意义 )"
        }
    ],
    "cat": "OT，订单类型，( EXPR：$TABULAR$:Personal=preorder.category )",
    "hotelId": "DA，酒店ID，-- ( ID )",
    "companyId": "DA，公司ID，-- ( ID )",
    "partner": "OA，筛选，协议单位名称信息，-- ( REF：ref.partner )",
    "member": "OA，筛选，会员卡卡号，-- ( REF：ref.member )",
    "amount": "O，会员卡内金额，-- ( 金额信息 )",
    "codeSource": "DT，客人来源，-- ( ID：type=code.source )",
    "codeMarket": "DT，市场分类，-- ( ID：type=code.market )",
    "operator": "OA，筛选，销售员姓名，-- ( REF：ref.operator )",
    "grouped": "O，是否团队预定？，-- ( 布尔值 )",
    "groupName": "R，团队名称，-- ( 字符串，grouped=true时必填 )",
    "groupLeader": "R，领队姓名，-- ( 字符串，grouped=true时必填 )",
    "sig":"<Security>，签名值",
    "$$USER$$": "<Security>，TOKEN中拿到的用户ID"
}
```