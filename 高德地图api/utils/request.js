import axios from 'axios'

// 分装axios
var instance = axios.create({
    // 多少秒算请求失败
    timeout: 200000
})

export let $get = async (url, params) => {
    let { data } = await instance.get(url, { params })
    return data
}

export let $post = async (url, params) => {
    let { data } = await instance.post(url, params)
    return data
} 