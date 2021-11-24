const layout = {
    1006: "12,12",   // ---- --
    1008: "9,15",    //
    1012: "6,18",    // ---- ---- ----
    1016: "4,20,98",    // ---- ---- ---- ----
    1018: "4,20",    // ---- ---- ---- ---- --
    1024: "3,21",    // ---- ---- ---- ---- ---- ----
    2006: "12,12",   // ---- --
    2106: "10,14",   //                       -- ----
    2112: "7,17",    //                ---- ---- ----
    3112: "5,19",    //        -- ---- -- ----
    3006: "12,12",   // ---- --
    3106: "10,14",   //        -- ----
    3212: "5,19",    //                ---- ---- ----
    2012: "6,18",    // ---- ---- ----
    4006: "12,12",   // ---- --
    4106: "10,14",   //        -- ----
    4206: "10,14",   //                ---- --
    4306: "10,14",   //                       -- ----
    3008: "9,15",    // ---- ----
    3108: "9,15",    //           ---- ----
    3208: "9,15",    //                     ---- ----
    3012: "6,18",    // ---- ---- ----
    3206: "10,14",   //                       -- ----
    2008: "9,15",    // ---- ----
    2116: "4,20",    //           ---- ---- ---- ----
    2016: "4,20",    // ---- ---- ---- ----
    2108: "9,15",    //                     ---- ----
    2118: "3,21,98", //        -- ---- ---- ---- ----
    2018: "4,20",    // ---- ---- ---- ---- --
};
const adjust = {
    1016: "2.5%",      // 修正
    2118: "2%",       //        -- ---- ---- ---- ----
    2016: "2%",       // ---- ---- ---- ----
    2116: "2%"
};
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    layout,
    adjust
};