<template>
    <div class="type_book_box">
        <!-- 好看的小说 -->
        <div class="good_novel">
            <div class="good_novel_title">
                <span>好看的小说</span>
                <button @click="showMove()">查看更多&gt;</button>
            </div>
            <div class="good_novel_list">
                <div v-for="(item, index) in obj.books" :key="index" @click="goBookDetail(item.bid)">
                    <img :src="`/src/image/bookImg/${item.imgPath}`" />
                    <div class="good_novel_list_content">
                        <span class="good_novel_list_content_top">{{ item.name }}</span>
                        <span class="good_novel_list_content_middle">
                            {{ cutString(item.introduction, 30) }}
                        </span>
                        <div class="good_novel_list_content_bottom">
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
import axios from "../hooks/request";
import { onMounted, reactive, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { cutString } from "../hooks/cutString";

let route = useRoute();
let router = useRouter();

let obj = reactive({
    type: "",
    books: {},
});

let getBooks = () => {
    obj.type = route.query.type;
    axios.get("/book/getBooks", {
            params: {
                type: obj.type,
                num: 9,
            },
        }).then((res) => {
            obj.books = res.data.data;
        });
};

let goBookDetail = (bid) => {
    router.push({name: 'bookDetail', params: {bid}});
}

let showMove = () => {
    router.push({
        path: "/hello/bookList",
        query: {
            type: obj.type,
        },
    });
};

onMounted(() => {
    getBooks();
});

watch(
    () => route.query.type,
    () => getBooks()
);
</script>

<style scoped>
.type_book_box {
    padding-top: 0.1px;
}

.good_novel {
    margin-top: 40px;
}

.good_novel_title {
    display: flex;
    justify-content: space-between;
    /* 在子元素之间和两端分配空间 */
    flex-wrap: wrap;
    /* 允许子元素换行 */
    align-items: center;
    /* 垂直居中 */
}

.good_novel_title span {
    font-size: 22px;
    font-weight: 600;
}

.good_novel_title button {
    padding: 0 5px;
    border: 1px solid #000000;
    border-radius: 10px;
    background-color: #ffffff00;
    cursor: pointer;
}

.good_novel_list {
    width: 100%;
    height: 500px;
    margin-top: 20px;
    display: grid;
    grid-template-rows: repeat(3, 1fr);
    grid-template-columns: repeat(3, 1fr);
    gap: 20px 40px;
}

.good_novel_list>div {
    display: flex;
    height: 150px;
}

.good_novel_list>div>img {
    height: 150px;
}

.good_novel_list_content {
    padding: 15px 10px;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    flex-wrap: wrap;
}

.good_novel_list_content_top {
    font-size: 18px;
    font-weight: 600;
    line-height: 30px;
}

.good_novel_list_content_middle {
    font-size: 14px;
    text-indent: 20px;
    line-height: 25px;
}

.good_novel_list_content_bottom {
    color: #6f6f6f;
    font-size: 14px;
    line-height: 25px;
    display: flex;
    justify-content: space-between;
}
</style>