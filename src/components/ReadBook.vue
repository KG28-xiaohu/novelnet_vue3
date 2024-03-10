<template>
    <div class="read_book_box" id="read_book_box">
        <div class="read_book">
            <div class="read_book_title">
                <h1>第{{ obj.bookChapter.chapterNum }}章 {{ obj.bookChapter.title }}</h1>
                <div>
                    <div>
                        <span>书名：</span>
                        <span>{{ obj.bookChapter.book.name }}</span>
                    </div>
                    <div>
                        <span>作者：</span>
                        <span>{{ obj.bookChapter.book.author }}</span>
                    </div>
                    <div>
                        <span>推荐数：</span>
                        <span>{{ obj.bookChapter.book.recommendNum }}</span>
                    </div>
                    <div>
                        <span>上架时间：</span>
                        <span>{{ obj.bookChapter.book.updateTime }}</span>
                    </div>
                </div>
            </div>
            <div class="read_book_content">
                <p v-for="item, index in obj.bookContentList" :key="index">
                    {{ item }}
                </p>
            </div>
            <ul class="read_book_side_nav">
                <li v-if="!obj.isTop" @click="goTopBut()">
                    顶部
                </li>
                <li @click="goBookDetail()">
                    详情
                </li>
                <li @click="goBookshelf()">
                    书架
                </li>
                <li @click="changeChapter(-1)">
                    上一章
                </li>
                <li @click="changeChapter(1)">
                    下一章
                </li>
                <li @click="router.go(-1)">
                    返回
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import axios from "../hooks/request";
import { onMounted, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { lineFeed } from "../hooks/cutString";

let route = useRoute();
let router = useRouter();

let obj = reactive({
    args: {},
    bookChapter: {
        book: {}
    },
    bookContentList: [],
    isTop: true,
})

let getChapterArgs = () => {
    let user = sessionStorage.getItem('user');
    if (user) {
        obj.args.uid = JSON.parse(user).uid;
    }
    routeQueryArgs();
}

let routeQueryArgs = () => {
    let bid = route.query.bid;
    let chapterNum = route.query.chapterNum;
    if (bid) {
        obj.args.bid = bid;
    }
    if (chapterNum) {
        obj.args.chapterNum = chapterNum;
    }
}

let getBookChapter = (num) => {
    obj.args.num = num;
    axios.get("/chapter/getChapter", {
        params: obj.args
    }).then(res => {
        if (res.data.code == 200) {
            obj.bookChapter = res.data.data;
            obj.bookContentList = lineFeed(obj.bookChapter.content);
            obj.args.chapterNum = obj.bookChapter.chapterNum;
        } else if (res.data.code == 401) {
            alert("已是第一章");
        } else if (res.data.code == 402) {
            alert("已是最后一章");
        }
    })
}

let goBookshelf = () => {
    if (sessionStorage.getItem('user')) {
        router.push({ path: "/hello/bookshelf" });
    } else {
        if (confirm("此操作需要登录，是否登录？")) {
            goLogin();
        }
    }
}

let goBookDetail = () => {
    router.push({ name: 'bookDetail', params: { bid: obj.args.bid } });
}

// 点击按钮返回顶部
let goTopBut = () => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
};

let changeChapter = (num) => {
    goTopBut();
    getBookChapter(num);
}

onMounted(() => {
    getChapterArgs();
    getBookChapter(0);
    
    // 当页面滚动时
    window.onscroll = function () {
        if (document.documentElement.scrollTop > 300 || document.body.scrollTop > 300) {
            // 显示返回顶部按钮
            obj.isTop = false;
        } else {
            // 隐藏返回顶部按钮
            obj.isTop = true;
        }
    }
})
</script>

<style scoped>
.read_book_box {
    min-height: 100vh;
    background-color: #E0E0E0;
}

.read_book {
    width: 900px;
    min-height: 100vh;
    margin: 0 auto;
    padding: 20px 70px;
    box-sizing: border-box;
    background-color: #F7F7F7;
    position: relative;
}

.read_book_title {
    height: 100px;
    border-bottom: 1px dashed gray;
    text-align: center;
}

.read_book_title h1 {
    line-height: 70px;
}

.read_book_title>div {
    display: flex;
    justify-content: space-around;
}

.read_book_title>div>div {
    font-size: 14px;
}

.read_book_title>div>div span:first-of-type {
    color: gray;
}

.read_book_content p {
    margin-top: 20px;
    font-size: 20px;
    text-indent: 30px;
    line-height: 40px;
}

.read_book_side_nav {
    position: fixed;
    right: 100px;
    top: 50px;
    /* width: 200px; */
    background-color: #f8f9fa00;
    border: 1px solid #dee2e600;
    padding: 10px;
    list-style-type: none;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0);
    display: flex;
    flex-direction: column;
}

.read_book_side_nav li {
    /* 设置宽度和高度相等以形成正方形 */
    width: 50px;
    /* 可以根据需要调整 */
    height: 50px;
    /* 与宽度相同 */
    padding: 10px;
    /* 如有需要，可以添加内边距 */
    margin: 5px;
    /* 可选：添加外边距以分隔列表项 */
    text-align: center;
    /* 可选：使文本居中显示 */
    line-height: 50px;
    /* 设置行高以垂直居中单行文本 */
    border-radius: 10px;
    /* 设置圆角 */
    background-color: #e9ecef;
    /* 设置背景颜色 */
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.read_book_side_nav li:hover {
    background-color: #dee2e6;
    /* 鼠标悬停时的背景颜色 */
}
</style>