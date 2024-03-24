<template>
    <div class="hello_box">
        <div class="top_nav_box">
            <div class="top_nav">
                <h1 class="title_ds">盗圣小说</h1>
                <ul class="type_ul">
                    <li>
                        <router-link to="/hello/home" :class="obj.top_nav_index == -1 ? 'link_class' : 'no_link_class'"
                            @click="chageTopNavIndex(-1)">
                            首页
                        </router-link>
                    </li>
                    <li v-for="(item, index) in obj.types" :key="index">
                        <router-link :to="`/hello/typeBook?type=${item}`" :class="obj.top_nav_index == index ? 'link_class' : 'no_link_class'
                            " @click="chageTopNavIndex(index)">
                            {{ item }}
                        </router-link>
                    </li>
                </ul>
                <div class="search_box">
                    <input type="text" class="search_input" placeholder="书名搜索" v-model="obj.searchStr" />
                    <button class="search_button" @click="searchBook()">🔍</button>
                </div>
                <div class="top_nav_right">
                    <span @click="goBookshelf()" class="top_nav_right_bookshelf"> 书架 </span>
                    <span v-if="!obj.isLogin" @click="goLogin()" class="top_nav_right_personal_center">
                        登录&nbsp;&nbsp;|&nbsp;&nbsp;注册
                    </span>
                    <span v-if="obj.isLogin" class="top_nav_right_personal_center">
                        欢迎用户：{{ obj.user.username }}
                        <ul class="top_nav_right_none_ul">
                            <li @click="goUserInformation()">个人信息</li>
                            <li @click="logout()">退出登录</li>
                        </ul>
                    </span>
                </div>
            </div>
        </div>
        <div class="hello_box_placeholder"></div>
        <div class="content_box_max">
            <div class="content_box">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script setup>
import axios from "../hooks/request";
import { onMounted, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";

let route = useRoute();
let router = useRouter();

let obj = reactive({
    types: [],
    top_nav_index: -1,
    isLogin: false,
    user: {},
    searchStr: "",
});

let chageTopNavIndex = (index) => {
    obj.top_nav_index = index;
};

let clearTopNavIndex = () => {
    obj.top_nav_index = -2;
};

let goBookshelf = () => {
    if (obj.isLogin) {
        clearTopNavIndex();
        router.push({ path: "/hello/bookshelf" });
    } else {
        if (confirm("此操作需要登录，是否登录？")) {
            goLogin();
        }
    }
}

let goLogin = () => {
    clearTopNavIndex();
    router.push({ path: "/login" });
};

let logout = () => {
    obj.isLogin = false;
    sessionStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push('/hello');
};

let goUserInformation = () => {
    router.push({
        path: '/hello/userInformation'
    })
}

let searchBook = () => {
    if (obj.searchStr != null && obj.searchStr != "") {
        clearTopNavIndex();
        router.push({
            path: "/hello/bookList",
            query: {
                name: obj.searchStr,
            },
        });
    } else {
        alert("搜索内容为空");
    }
};

//重新加载
let reload = () => {
    let user = sessionStorage.getItem("user");
    if (user) {
        obj.user = JSON.parse(user);
        obj.isLogin = true;
    } else {
        obj.user = {};
        obj.isLogin = false;
    }
    axios.get("/book/getType").then((res) => {
        obj.types = res.data.data;
    });
}

onMounted(() => {
    reload();
});
</script>

<style scoped>
.top_nav_box {
    width: 100%;
    height: 72px;
    position: fixed;
    /* 固定位置 */
    top: 0;
    /* 固定在顶部 */
    left: 0;
    /* 固定在左侧 */
    background-color: #f7eff0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    /* 盒阴影 */
    z-index: 10;
}

.hello_box_placeholder {
    width: 100%;
    height: 72px;
    background-color: transparent;
    /* 透明背景 */
    transition: height 0.3s ease;
    /* 添加高度过渡效果 */
}

/* 整体导航栏样式 */
.top_nav {
    width: 1200px;
    margin: 0 auto;
    /* 背景颜色 */
    padding: 20px 0;
    /* 内边距 */
    display: flex;

    align-items: center;
    justify-content: space-between;
    /* 水平间距 */
}

/* 标题样式 */
.title_ds {
    font-size: 24px;
    /* 字体大小 */
    font-weight: bold;
    /* 字体加粗 */
    color: #bc2224;
    /* 字体颜色 */
    margin: 0;
    /* 外边距为0 */
    padding: 0;
    /* 内边距为0 */
}

/* 类型列表样式 */
.type_ul {
    width: 500px;
    list-style-type: none;
    /* 移除默认的列表样式 */
    padding: 0;
    /* 内边距为0 */
    margin: 0;
    /* 外边距为0 */
    display: flex;
    /* 使用Flexbox布局 */
    justify-content: center;
    /*子元素水平居中*/
}

/* 类型列表项样式 */
.type_ul li {
    font-size: 18px;
    /*字体大小*/
    margin: 0 5px;
    /* 左右外边距 */
    padding: 5px;
    /* 内边距 */
    background-color: #f7f2f4;
    /* 背景颜色 */
    border-radius: 4px;
    /* 边框圆角 */
    cursor: pointer;
    /* 鼠标悬停时变为手型 */
    transition: background-color 0.3s ease;
    /* 背景颜色过渡效果 */
}

.no_link_class {
    color: #000000;
    text-decoration: none;
    border-bottom: none;
}

.link_class {
    color: #bc2224;
    text-decoration: none;
    border-bottom: 3px solid #bc2224;
}

/* 鼠标悬停时的样式 */
.type_ul li:hover {
    background-color: #f0f0f0;
    /* 鼠标悬停时的背景颜色 */
}

/* 如果v-for的item是激活状态，可以添加如下样式 */
.type_ul li.active {
    background-color: #4caf50;
    /* 激活状态的背景颜色 */
    color: #fff;
    /* 激活状态的文字颜色 */
}

.search_box {
    height: 35px;
    margin: 0 10px;
    padding: 0 0 0 10px;
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 4fr 1fr;
    background-color: #ffffff;
    border-radius: 20px;
    overflow: hidden;
}

.search_input,
.search_button {
    outline: none;
    border: none;
    background-color: #ffffff;
}

.top_nav_right {
    display: flex;
    align-items: center;
    /* 垂直居中 */
    justify-content: space-;
    /* 水平间距 */
    min-width: 150px;
    max-width: 300px;
    /* 宽度设置为100%，或者你可以根据需要设置具体的像素值 */
}

.top_nav_right span {
    font-size: 14px;
    /* 字体大小 */
    color: #333;
    /* 字体颜色 */
    cursor: pointer;
    /* 鼠标悬停时变为手型图标，表示可以点击 */
}

.top_nav_right span:hover {
    color: #d7392b;
    /* 字体颜色 */
}

/* 如果需要设置登录和注册之间的间距，可以给它们添加单独的样式 */
.top_nav_right span:first-child {
    margin-right: 10px;
    /* 登录和书架之间的间距 */
}

.top_nav_right_bookshelf {
    width: 50px;
}

.top_nav_right_personal_center {
    /* width: 200px; */
    position: relative;
}

.top_nav_right_personal_center:hover .top_nav_right_none_ul{
    display: inline-block;
}

.top_nav_right_none_ul {
    display: none;
    width: 77px;
    color: #000000;
    list-style: none;
    padding: 10px;
    background-color: #ffffff;
    position: absolute;
    top: 20px;
    left: 0px;
    border-radius: 10px;
}

.top_nav_right_none_ul li {
    cursor: pointer;
    padding: 10px 10px;
}

.top_nav_right_none_ul li:hover {
    background-color: #efefef;
}

.content_box_max {
    position: relative;
}

.content_box_max::before {
    content: "";
    display: block;
    width: 100%;
    height: 300px;
    background-image: linear-gradient(to bottom, #ffe1dc, #f6e4e3 25%, #ffffff);
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
}

.content_box {
    width: 1200px;
    margin: 0 auto;
}
</style>