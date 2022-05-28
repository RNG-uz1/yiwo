// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: "yiwo-nft-9gw5pymu18ae114f"
})
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
    let size = event.size;
    let searchKey = event.searchKey;
    let area = event.areaProvince;
    if(searchKey == null || searchKey == ''){  //搜索框为空，不进行筛选
        if(area == '全国'){ //省份为全国时,不筛选
            return await db.collection("guide")
            .limit(7)
            .skip(size)
            .orderBy("readCount","desc")
            .get();
        }else{  //省份为具体省时,筛选省
            return await db.collection("guide").where({
                province: area
            })
            .limit(7)
            .skip(size)
            .orderBy("readCount","desc")
            .get();
        }
    }else{     //搜索框不为空时，进行筛选
        if(area == '全国'){ //省份为全国时,不筛选
            return await db.collection("guide").where({
                title: db.RegExp({
                    regexp: searchKey,
                    options: 'i'
                }),
            })
            .limit(7)
            .skip(size)
            .orderBy("readCount","desc")
            .get();
        }else{  //省份为具体省时,筛选省
            return await db.collection("guide").where({
                province: area,
                title: db.RegExp({
                    regexp: searchKey,
                    options: 'i'
                }),
            })
            .limit(7)
            .skip(size)
            .orderBy("readCount","desc")
            .get();
        }
    }
}