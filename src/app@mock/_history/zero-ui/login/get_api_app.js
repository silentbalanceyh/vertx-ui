export default {
    mock: true,
    data: {
        "mHotel": {
            "pPreMarket": "178c2a88-2c02-4853-beb7-6c9ed72ca211",
            "pIsManual": true,
            "pIsWard": false,
            "pRoomHours": 1,
            "pTimeAudit": "23:00:00",
            "pTimeOpen": "1:00:00",
            // eslint-disable-next-line no-template-curly-in-string
            "pApproveTitle": "`${day}夜审记录单`",
            "pOrderExpired": false,
            "pOrderToday": false,
            "pOrderWaiting": true,
            "pPreMethod": "583dc148-a4cb-4a0f-87b8-9b21e1641327",
            "pTimeArrive": "18:00:00",
            "pTimeLeave": "12:00:00",
            "pOrderKeep": 2,
            "pPreSurety": "f5c25a1a-d3f3-46c0-a131-5b4aea1c46f6",
            "pBreakPrice": 20,
            "pBreakInclude": false,
            "pBreakDefault": true,
            "pIsDirtyIn": true,
            "pIsDirtyAuto": false,
            "pIsFullName": false,
            "pIsUniqueID": false,
            "pDayLongTerm": 10,
            "pCheckedLimit": 2,
            "pRoomAlert": 40,
            "pRoomAllow": 3,
            "pRoomVFrom": 3,
            "pRoomVTo": 7,
            "pPreSource": "33d51074-a6ed-4c92-bc21-656c2b1c9dd6",
            "pPayMode": "90793f81-49ec-4b85-bdcf-6b1c955df7d4",
            "pPrintCount": 3,
            "pLowerPrice": 100,
            "pIsOneSplit": true,
            "pExceedFull": 120,
            "pExceedHalf": 60,
            "pPayPre": "2ca2b429-8f2a-4028-b297-77402490e13d",
            "pPayAuthorize": "aba2154e-b860-4f92-8b66-0c587b35315e",
            "pFeeFull": "e7e930a9-72c3-4ffd-b746-169366586248",
            "pFeeHalf": "1c6e544d-2fa7-4875-9932-dea37717a2aa",
            "pFeeOther": "cc2b9356-fe21-4333-953c-546d2a4160c8",
            "pKey": "5cbacbae-b3d1-44fb-9c02-81dd94ee92a4",
            "__metadata": {
                "pPreMarket": "STRING",
                "pIsManual": "BOOLEAN",
                "pIsWard": "BOOLEAN",
                "pRoomHours": "DECIMAL",
                "pTimeAudit": "TIME",
                "pTimeOpen": "TIME",
                "pTimeRunning": "DATE",
                "pApproveTitle": "STRING",
                "pOrderExpired": "BOOLEAN",
                "pOrderToday": "BOOLEAN",
                "pOrderWaiting": "BOOLEAN",
                "pPreMethod": "STRING",
                "pTimeArrive": "TIME",
                "pTimeLeave": "TIME",
                "pOrderKeep": "INTEGER",
                "pPreSurety": "STRING",
                "pBreakPrice": "DECIMAL",
                "pBreakInclude": "BOOLEAN",
                "pBreakDefault": "BOOLEAN",
                "pIsDirtyIn": "BOOLEAN",
                "pIsDirtyAuto": "BOOLEAN",
                "pIsFullName": "BOOLEAN",
                "pIsUniqueID": "BOOLEAN",
                "pDayLongTerm": "INTEGER",
                "pCheckedLimit": "INTEGER",
                "pRoomAlert": "INTEGER",
                "pRoomAllow": "INTEGER",
                "pRoomVFrom": "INTEGER",
                "pRoomVTo": "INTEGER",
                "pPreSource": "STRING",
                "pPayMode": "STRING",
                "pPrintCount": "INTEGER",
                "pLowerPrice": "DECIMAL",
                "pIsOneSplit": "BOOLEAN",
                "pExceedFull": "INTEGER",
                "pExceedHalf": "INTEGER",
                "pPayPre": "SELECTOR",
                "pPayAuthorize": "SELECTOR",
                "pFeeFull": "SELECTOR",
                "pFeeHalf": "SELECTOR",
                "pFeeOther": "SELECTOR"
            },
            "key": "ea951ec-9e7f-403b-b437-243bfd29a4fb",
            "active": true,
            "appId": "78fce5a2-17f3-4dac-a75c-7e751595015c",
            "sigma": "ENhwBAJPZuSgIAE5EDakR6yrIQbOoOPq",
            "agent": "夏宛凝",
            "email": "main@hpe.com",
            "name": "零点酒店",
            "code": "1001.00",
            "companyId": "e33b0103-bb53-44b2-83af-b40ea67c24c9",
            "createdBy": "zero-environment",
            "language": "cn",
            "locationId": "30c5632d-12ed-4044-a602-808784d3b4bf"
        },
        "bags": [
            {
                "key": "0a8c3e34-d359-48ab-86af-17898c50a007",
                "name": "OA办公系统",
                "nameAbbr": "ZERO-E",
                "nameFull": "Zero Enterprise Management",
                "type": "Z-COMMERCE",
                "uiIcon": "BLOCK_ZERO_E",
                "uiSort": 12005,
                "entry": true,
                "entryId": "zero.oa",
                "appId": "78fce5a2-17f3-4dac-a75c-7e751595015c",
                "active": true,
                "sigma": "ENhwBAJPZuSgIAE5EDakR6yrIQbOoOPq",
                "language": "cn",
                "createdBy": "zero-environment"
            },
            {
                "key": "5cbacbae-b3d1-44fb-9c02-81dd94ee92a4",
                "name": "酒店管理",
                "nameAbbr": "HOTEL",
                "nameFull": "Hotel Management",
                "type": "EXTENSION",
                "uiIcon": "BLOCK_HT",
                "uiSort": 20005,
                "uiConfig": {
                    "store": "mHotel",
                    "record": {
                        "dao": "com.needee.domain.tables.daos.HtlHotelDao",
                        "pojo": "hotel",
                        "criteria": {
                            // eslint-disable-next-line no-template-curly-in-string
                            "appId": "`${appId}`",
                            // eslint-disable-next-line no-template-curly-in-string
                            "sigma": "`${sigma}`",
                            "": true
                        }
                    },
                    "config": {
                        "_assist": {
                            "tabular": {
                                "uri": "/api/types/tabulars",
                                "method": "POST",
                                "magic": {
                                    "$body": [
                                        "params.paymode",
                                        "code.source",
                                        "code.market",
                                        "preorder.method",
                                        "surety.type"
                                    ]
                                },
                                "group": "type"
                            }
                        },
                        "_page": {
                            "title": "酒店参数设置",
                            "left": [
                                "btnSave,保存,$opSaveArg,primary",
                                "btnReset,重置,$opReset"
                            ],
                            "back": {
                                "state": {
                                    "status.submitting": null
                                }
                            }
                        },
                        "_form": {
                            "columns": 3,
                            "className": "web-form-bottom-16",
                            "ui": [
                                [
                                    {
                                        "field": "$button",
                                        "hidden": true,
                                        "optionJsx.extension": [
                                            "$opSaveArg,保存,SUBMIT_REDUX,primary",
                                            "$opReset,重置,RESET"
                                        ]
                                    }
                                ],
                                "HOTEL-ORDER",
                                "HOTEL-SCH",
                                "HOTEL-CHECK-IN",
                                "HOTEL-PAY",
                                "HOTEL-APPR"
                            ],
                            "hidden": [
                                "pKey",
                                "pPayPre",
                                "pPayAuthorize",
                                "pFeeFull",
                                "pFeeHalf",
                                "pFeeOther"
                            ],
                            "op": {
                                "$opSaveArg": "act.app.modulat.extension-configure"
                            }
                        },
                        "_modal": {
                            "success": {
                                "saved": "恭喜，该模块的配置参数已成功保存！"
                            }
                        }
                    }
                },
                "entry": true,
                "entryId": "zero.hotel",
                "appId": "78fce5a2-17f3-4dac-a75c-7e751595015c",
                "active": true,
                "sigma": "ENhwBAJPZuSgIAE5EDakR6yrIQbOoOPq",
                "language": "cn",
                "createdBy": "zero-environment"
            },
            {
                "key": "a94f83ae-7320-4358-a372-a683c3eece07",
                "name": "资源管理器",
                "nameAbbr": "ZERO-F",
                "nameFull": "Zero Resource Management",
                "type": "Z-FOUNDATION",
                "uiIcon": "BLOCK_ZERO_F",
                "uiSort": 11000,
                "entry": true,
                "entryId": "zero.resource",
                "appId": "78fce5a2-17f3-4dac-a75c-7e751595015c",
                "active": true,
                "sigma": "ENhwBAJPZuSgIAE5EDakR6yrIQbOoOPq",
                "language": "cn",
                "createdBy": "zero-environment"
            },
            {
                "key": "baaf0cae-58af-40b9-9672-26f8cca14727",
                "name": "CRM客户管理",
                "nameAbbr": "ZERO-C",
                "nameFull": "Zero Customer Management",
                "type": "Z-FOUNDATION",
                "uiIcon": "BLOCK_ZERO_C",
                "uiSort": 12010,
                "entry": true,
                "entryId": "zero.crm",
                "appId": "78fce5a2-17f3-4dac-a75c-7e751595015c",
                "active": true,
                "sigma": "ENhwBAJPZuSgIAE5EDakR6yrIQbOoOPq",
                "language": "cn",
                "createdBy": "zero-environment"
            }
        ],
        "key": "78fce5a2-17f3-4dac-a75c-7e751595015c",
        "name": "app.micro.hotel",
        "code": "htl",
        "title": "零点智慧酒店",
        "domain": "ox.engine.cn",
        "appPort": 4000,
        "urlEntry": "/login/index",
        "urlMain": "/main/index",
        "path": "/htl",
        "route": "/htl",
        "appKey": "18VqhtJUCgHe1N0pgq1wrl7BcC5FFE0fcOJ8e2XO8ShqRIkOysdt970XzNRc0eFc",
        "active": true,
        "sigma": "ENhwBAJPZuSgIAE5EDakR6yrIQbOoOPq",
        "language": "cn",
        "createdBy": "zero-environment",
        "storePath": "/apps/ht/document"
    }
}