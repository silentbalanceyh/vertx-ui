# API: /api/htl/ticket/inoccup

## Definition

```json
{
    "uri": "/api/htl/ticket/inoccup",
    "identifier": "htl.orders",
    "method":"POST",
    "paramType": "BODY",
    "in":"in.api.htl.ticket.inoccup.post",
    "out":"out.api.htl.ticket.inoccup.post",
    "address": "MSG://MESSAGE/QUEUE/DATA",
    "requiredParam": [
        "traveler"
    ],
    "responder": "com.vie.un.flow.JObjectRepdor"
}
```

## Request

```json
{
    "cat" : "OT，订单类型，$TABULAR$:Personal=preorder.category",
    "hotelId" : "DA，酒店ID，-- ( ID )",
    "companyId" : "DA，公司ID，-- ( ID )",
    "method" : "OT，预定方式，-- ( ID：type=preorder.method )",
    "suretyType" : "OT，担保类型，-- ( ID：type=surety.type )",
    "codeSource" : "DT，客人来源，-- ( ID：type=code.source )",
    "codeMarket" : "DT，市场分类，-- ( ID：type=code.market )",
    "grouped": "O，是否团队预定？，-- ( 布尔值 )",
    "groupName": "R，团队名称，-- ( 字符串，grouped=true时必填 )",
    "groupLeader": "R，领队姓名，-- ( 字符串，grouped=true时必填 )",
    "member": "OA，筛选，会员卡卡号，-- ( REF：ref.member )",
    "preservor": "R，联系人，-- ( 字符串 )",
    "phone": "R，联系电话，-- ( 字符串 )",
    "ref" : {
        "partner": "O，协议单位ID，-- ( ID )",
        "member": "O，会员ID，-- ( GUID )",
        "operator": "O，销售员ID，-- ( GUID )"
    },
    "partner": "OA，筛选，协议单位名称信息，-- ( REF：ref.partner )",
    "creditItem" : "OA，付款项，-- ( ID )",
    "surety" : "O，担保人，-- ( 字符串 )",
    "operator": "OA，筛选，销售员姓名，-- ( REF：ref.operator )",
    "comment" : "O，订单备注，-- ( 字符串 )",
    "traveler" : [ {
      "roomNumber" : "R，房间号，-- ( 字符串 )",
      "roomTypeId": "OA，预定房型，-- ( ID )",
      "arriveTime": "R，抵达日期，-- ( 日期时间 )",
      "type" : "O，入住类型，-- ( ID：type=in.room.type )",
      "codeGroup" : "OA，团购码，-- ( ID )",
      "codeCommission" : "OA，佣金码，-- ( ID )",
      "major" : "O，主账房？，-- ( 布尔值 )",
      "gender" : "O，性别？，-- ( 布尔值 )",
      "brekker" :  "O，房包早？，-- ( 布尔值 )",
      "idcType" : "O，证件类型，-- ( ID：type=idc.type )",
      "secret" : "O，是否保密？，-- ( 布尔值 )",
      "codePrice" : "RA，房价码，-- ( ID )",
      "unitPrice" : "R，房间单价，-- ( 金钱值 )",
      "discount" : "O，折扣，-- ( %格式 )",
      "mobile" : "R，宾客电话，-- ( 字符串 )",
      "nation" : "O，民族，-- ( 字符串 )",
      "realname" : "O，真实姓名，-- ( 字符串 )",
      "nickname" : "O，昵称，-- ( 字符串 )",
      "nativePlace" : "O，籍贯，-- ( 字符串 )",
      "idcNumber" : "O，证件号码，-- ( 字符串 )",
      "tserial" : "O，宾客序号，-- ( SERIAL )",
      "address" : "O，地址信息，-- ( 字符串 )",
      "country" : "O，国籍，-- ( 字符串 )",
      "birthday" : "O，生日，-- ( 日期 )",
      "leaveTime": "O，离店日期，-- ( 日期时间 )",
      "insideDays" : "O，入住天数，-- ( 正数 )",
      "cardNumber" : "O，房卡数量，-- ( 正数 )",
      "driverLicense" : "O，车牌号，-- ( 字符串 )"
    } ],
    "sigma": "D，Sigma值，-- ( HASH )",
    "sig":"<Security>，签名值",
    "$$USER$$": "<Security>，TOKEN中拿到的用户ID"
}
```