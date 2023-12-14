<template>
    <div class="box">
        <h2>小米数码商城</h2>
        <div>
            <span>全国热点门店:</span>
            <select v-model="city_Code">
                <option value="0">选择城市</option>
                <option :value="item.code" v-for="item in hotCitys" :key="item.cityid" @click="handleClick(item.code)">
                    {{ item.name }}
                </option>
            </select>
            <select v-model="city_Areas">
                <option value="0">选择区县</option>
                <option :value="item.area_id" v-for="item in hotCityAreas" :key="item.area_id">
                    {{ item.area_name }}
                </option>
            </select>
        </div>
    </div>
    <!-- 这里必须用ID 要不然显示不出来地图 -->
    <div id="container">

    </div>
</template>

<script setup>
import { onMounted, shallowRef, ref, watch } from "vue";
import AMapLoader from "@amap/amap-jsapi-loader";
import { $get } from '../../utils/request'


const map = shallowRef(null)
// 获取创建地图时的AMap
var MyAMap = null
// 所有热门城市
const hotCitys = ref([])
// 热门城市下的区县
const hotCityAreas = ref([])
// 当前选择城市的ID
const city_Code = ref("0")
// 当前选择区县的ID
const city_Areas = ref("0")

// 监听城市下拉菜单的改变
watch(city_Code, (newValue) => {
    city_Areas.value = "0"
    loadAreas(newValue)
})

// 监听区县下拉菜单的改变
watch(city_Areas, (newValue) => {
    if (newValue !== "0") {
        loadSpops(city_Code.value, newValue)
    }
})

// 获取门店信息和当前区县的坐标
const loadSpops = async (city_id, area_id) => {
    // 拼接城乡
    let address = hotCitys.value.find(item => item.code === city_Code.value).name + hotCityAreas.value.find(item => item.area_id === city_Areas.value).area_name
    // 获取区县坐标
    let dataListOne = await getLocation(address)
    // 获得区县经纬度
    let location = dataListOne.geocodes[0].location
    // 创建经纬度对象
    let position = new AMap.LngLat(location.split(",")[0], location.split(",")[1])
    // 设置地图中心点的位置
    map.value.setCenter(position)
    // 设置地图缩放等级
    map.value.setZoom(13)


    // 获取区县的门店信息
    let { shop_data } = await $get("/api/at/shop", {
        city_id,
        area_id
    })

    // 循环遍历创建marker
    shop_data.forEach(item => {
        const marker = new MyAMap.Marker({
            position: [item.map_longitude, item.map_latitude],
            title: item.shop_name
        })

        marker.on("click", (e) => {
            const position = [e.lnglat.lng, e.lnglat.lat]
            map.value.setCenter(position)
            map.value.setZoom(17)
        })

        map.value.add(marker)
    })
}

// 以地名获取经纬度
const getLocation = async (address) => {
    return await $get("https://restapi.amap.com/v3/geocode/geo", {
        key: "8d73d2e455b1a28deefc28db7afb1397",
        address
    })
}

// 获取城市列表下的区县
const loadAreas = async (cityCode) => {
    let dataList = await $get('/api/aj/get_area', {
        citycode: cityCode
    })
    // Object.keys拿到每一个key 放到一个数组中
    let array = Object.keys(dataList.result).map(key => {
        return {
            area_id: key,
            area_name: dataList.result[key]
        }
    })
    hotCityAreas.value = array
}

// 获取城市列表
const loadCitys = async () => {
    let dataList = await $get('/api/aj/getcitycode')
    hotCitys.value = dataList.result.hotcity
}

// 初始化地图等信息
onMounted(() => {
    // 初始化地图
    AMapLoader.load({
        key: "bcd0f6abbc4666f14ca0cb412d35ee3a",    // 申请的key
        version: "2.0",                             // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: [],                                // 需要使用的的插件列表，如比例尺'AMap.Scale'等
    }).then((AMap) => {
        MyAMap = AMap
        // 设置地图容器id
        map.value = new AMap.Map("container", {
            viewMode: "3D",                         // 是否为3D地图模式
            pitch: 0,                               // 倾斜的角度
            zoom: 5,                                // 初始化地图级别
            center: [116.397428, 39.90923],         // 初始化地图中心点位置
        })
    }).catch((e) => {
        console.log(e)
    })
    // 获取城市列表
    loadCitys()
})
</script>

<style lang="scss" scoped>
#container {
    padding: 0px;
    margin: 0px;
    width: 100%;
    height: 650px;
}

.box {
    box-sizing: border-box;
    padding: 10px;

    div {
        select {
            margin-left: 10px;
        }
    }
}
</style>