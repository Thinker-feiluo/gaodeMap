<template>
    <div class="box">
        <h2>小米</h2>
        <div>
            <span>全国热点门店:</span>
            <select name="" id=""></select>
            <select name="" id=""></select>
        </div>
    </div>
    <!-- 这里必须用ID 要不然显示不出来地图 -->
    <div id="container">

    </div>
</template>

<script setup>
import { onMounted, shallowRef } from "vue";
import AMapLoader from "@amap/amap-jsapi-loader";
import { $get } from '../../utils/request'

const map = null


onMounted(() => {
    AMapLoader.load({
        key: "bcd0f6abbc4666f14ca0cb412d35ee3a",    // 申请的key
        version: "2.0",                             // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: [],                                // 需要使用的的插件列表，如比例尺'AMap.Scale'等
    }).then((AMap) => {
        // 设置地图容器id
        map = new AMap.Map("container", {
            viewMode: "3D",                         // 是否为3D地图模式
            pitch: 0,                               // 倾斜的角度
            zoom: 11,                               // 初始化地图级别
            center: [116.397428, 39.90923],         // 初始化地图中心点位置
        })
    }).catch((e) => {
        console.log(e)
    })
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