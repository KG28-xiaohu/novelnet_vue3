<template>
    <div class="book_list_box">
        <div class="book_list">
            <div class="book_list_title">
                <span>搜索结果</span>
                <button @click="router.go(-1)">返回上一页&gt;</button>
            </div>
            <div class="book_list_list">
                <div v-for="(item, index) in obj.books" :key="index" @click="goBookDetail(item.bid)">
                    <img :src="`/image/bookImg/${item.imgPath}`" />
                    <div class="book_list_list_content">
                        <span class="book_list_list_content_top">{{ item.name }}</span>
                        <span class="book_list_list_content_middle">
                            {{ cutString(item.introduction, 115) }}
                        </span>
                        <div class="book_list_list_content_bottom">
                            <span>{{ item.author }}</span>
                            <span>{{ item.type }} | {{ item.state }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import axios from '../hooks/request';
import { onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { cutString } from "../hooks/cutString";

let route = useRoute();
let router = useRouter();

let obj = reactive({
    searchBookArgs: {},
    books: {}
})

//获取路由参数
let routeQueryArgs = () => {
    let type = route.query.type;
    let name = route.query.name;
    let num = route.query.num;
    if (type) {
        obj.searchBookArgs.type = type;
    }
    if (name) {
        obj.searchBookArgs.name = name;
    }
    if (num) {
        obj.searchBook.num = num;
    }else{
        obj.searchBookArgs.num = -1;
    }
}

let getBooks = () => {
    routeQueryArgs();
    axios.get("/book/getBooks", {
            params: obj.searchBookArgs,
        }).then((res) => {
            obj.books = res.data.data;
        });
}

let goBookDetail = (bid) => {
    router.push({name: 'bookDetail', params: {bid}});
}

onMounted(() => {
    getBooks();
})
</script>

<style scoped>
.book_list_box{
    padding-top: 0.1px;
}

.type_book_box {
    padding-top: 0.1px;
}

.book_list {
    margin-top: 40px;
}

.book_list_title {
    display: flex;
    justify-content: space-between;
    /* 在子元素之间和两端分配空间 */
    /* flex-wrap: wrap; */
    /* 允许子元素换行 */
    align-items: center;
    /* 垂直居中 */
}

.book_list_title span {
    font-size: 22px;
    font-weight: 600;
}

.book_list_title button {
    padding: 0 5px;
    border: 1px solid #000000;
    border-radius: 10px;
    background-color: #ffffff00;
    cursor: pointer;
}

.book_list_list {
    width: 100%;
    height: 500px;
    margin-top: 20px;
    display: flex;
    flex-direction: column;
}

.book_list_list>div {
    margin: 15px 0;
    display: flex;
    height: 170px;
}

.book_list_list>div>img {
    height: 170px;
}

.book_list_list_content {
    padding: 15px 0 15px 30px;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    flex-wrap: wrap;
}

.book_list_list_content_top {
    font-size: 25px;
    font-weight: 600;
    line-height: 30px;
}

.book_list_list_content_middle {
    font-size: 18px;
    text-indent: 20px;
    line-height: 25px;
}

.book_list_list_content_bottom {
    color: #6f6f6f;
    font-size: 14px;
    line-height: 25px;
    display: flex;
    justify-content: space-between;
}
</style>