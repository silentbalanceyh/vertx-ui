import Ux from 'ux';

export default {
    mock: true,
    data: [
        {
            "id": "9dc718e3-1632-4b1d-a469-d2bcb2fe9a30",
            "name": "LECTEH",
            "code": "N.ISVW",
            "parentId": "MySQL"
        },
        {
            "id": "9980f501-38a0-4518-84ca-f4ab1b8463b5",
            "name": "JWZHTP",
            "code": "ZYGIIV",
            "parentId": "MySQL"
        },
        {
            "id": "43a62114-7b06-44f2-81ce-b4d7fcb48094",
            "name": "TQIAMI",
            "code": "YCJVSI",
            "parentId": "MySQL"
        },
        {
            "id": "ef173daa-c377-4215-ba1f-6344dcf58591",
            "name": "QMOVLM",
            "code": "QUQOLN",
            "parentId": "Hive"
        },
        {
            "id": "752a6a53-0048-47f8-a945-1ee6b6be1d66",
            "name": "RLJBBB",
            "code": "KKRGXW",
            "parentId": "Hive"
        },
        {
            "id": "5eb9a0c5-0c8a-472d-9491-723360cdc948",
            "name": "SFVLQS",
            "code": "I.NPOK",
            "parentId": "MySQL"
        },
        {
            "id": "7adaabbf-4a40-4b2d-8b2a-d0da5ce5b6da",
            "name": "KDDPQ.",
            "code": "OIXBTX",
            "parentId": "Hive"
        },
        {
            "id": "283c1bb2-7fef-4425-a0ad-199ed99921b2",
            "name": "JOBVGY",
            "code": ".JFLBK",
            "parentId": "MySQL"
        },
        {
            "id": "06ea2652-7cf6-40cd-a38d-75c8b389ff64",
            "name": "PNQIZU",
            "code": "OOLXFS",
            "parentId": "MySQL"
        },
        {
            "id": "8e0e2ab4-1b17-4763-9069-51645f028965",
            "name": "WKWEHZ",
            "code": "PYIECB",
            "parentId": "Hive"
        },
        {
            "id": "bd75dde8-cd8f-4643-abf4-296153e15271",
            "name": "XKVEHK",
            "code": "TKJFGJ",
            "parentId": "Hive"
        },
        {
            "id": "e26c4813-6801-46ef-b84f-8673fd021bde",
            "name": "LMMLYF",
            "code": "OUOOHG",
            "parentId": "MySQL"
        },
        {
            "id": "ff1c9a7b-36b6-4776-8aea-e55372d60ed0",
            "name": "HSLQMY",
            "code": "ROOTWP",
            "parentId": "Hive"
        },
        {
            "id": "767a7361-168d-4a2c-a173-da060e9f218e",
            "name": "FDDWQR",
            "code": "QSTYVW",
            "parentId": "Hive"
        },
        {
            "id": "9c30cea0-2ed4-45df-a195-e47a9e79ee26",
            "name": "QKJJXL",
            "code": "BOJNIK",
            "parentId": "MySQL"
        }
    ],
    processor: (response, params = {}) => {
        return Ux.promise(response.filter(item => item.parentId === params.parentId))
    }
}