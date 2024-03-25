<template>
    <div class="home_box">
        <!-- 新闻资讯 -->
        <div class="news">
            <div class="news_title">
                <span>最新<br>资讯</span>
            </div>
            <div class="news_content">
                <a href="https://baijiahao.baidu.com/s?id=1792853388447758386" target="_blank">
                    课间10分钟能否改为半小时？
                </a>
                <a href="https://baijiahao.baidu.com/s?id=1792775348766360408" target="_blank">
                    人大代表:反对让学生逢雨逢雪停课
                </a>
                <a href="https://baijiahao.baidu.com/s?id=1792859371743765192" target="_blank">
                    2024中国向“新”发力
                </a>
                <a href="http://www.zuoxiang0824.com/test/" target="_blank">
                    北大青鸟Java课堂开课啦！
                </a>
            </div>
        </div>
        <!-- 好看的小说 -->
        <div class="good_novel">
            <div class="good_novel_title">
                <span>好看的小说</span>
                <button @click="showMove()">查看更多&gt;</button>
            </div>
            <div class="good_novel_list">
                <div v-for="item,index in obj.books" :key="index" @click="goBookDetail(item.bid)">
                    <img :src="`/image/bookImg/${item.imgPath}`">
                    <div class="good_novel_list_content">
                        <span class="good_novel_list_content_top">{{ item.name }}</span>
                        <span class="good_novel_list_content_middle">{{ cutString(item.introduction, 30) }}</span>
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
import axios from '../hooks/request';
import { onMounted, reactive } from 'vue';
import { cutString } from "../hooks/cutString";
import { useRoute, useRouter } from 'vue-router';

let route = useRoute();
let router = useRouter();

let obj = reactive({
    books: {}
})

let goBookDetail = (bid) => {
    router.push({name: 'bookDetail', params: {bid}});
}

let showMove = () => {
    router.push({
        path: "/hello/bookList"
    });
};

onMounted(() => {
    axios.get("/book/getBooks", {
        params: {
            num: 9
        }
    }).then(res => {
            obj.books = res.data.data;
        })
})
</script>

<style scoped>
.home_box {
    padding-top: 0.1px;
}

.news {
    width: 100%;
    height: 100px;
    margin: 30px 0;
    padding: 15px;
    box-sizing: border-box;
    border-radius: 20px;
    background-color: #ffffff;
    display: flex;
    justify-content: space-between;
    /* 在子元素之间和两端分配空间 */
    flex-wrap: wrap;
    /* 允许子元素换行 */
    align-items: center;
    /* 垂直居中 */
}

.news_title {
    width: 90px;
    height: 70px;
    padding: 5px;
    box-sizing: border-box;
    border-radius: 10px;
    background-image: linear-gradient(to right bottom, #F8A889, #F9503F);
    text-align: center;
}

.news_title span {
    line-height: 30px;
    font-size: 24px;
    font-weight: 600;
    color: #ffffff;
    font-family: "宋体", sans-serif;
}

.news_content {
    width: 1060px;
    display: flex;
    justify-content: space-between;
    /* 在子元素之间和两端分配空间 */
    flex-wrap: wrap;
    /* 允许子元素换行 */
    align-items: center;
    /* 垂直居中 */
}

.news_content a {
    color: #000000;
    font-size: 16px;
    text-decoration: none;
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

.good_novel_list>div{
    display: flex;
    height: 150px;
}

.good_novel_list>div>img{
    height: 150px;
}

.good_novel_list_content{
    padding: 15px 10px;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    flex-wrap: wrap;
}

.good_novel_list_content_top{
    font-size: 18px;
    font-weight: 600;
    line-height: 30px;
}

.good_novel_list_content_middle{
    font-size: 14px;
    text-indent: 20px;
    line-height: 25px;
}

.good_novel_list_content_bottom{
    color: #6f6f6f;
    font-size: 14px;
    line-height: 25px;
    display: flex;
    justify-content: space-between;
}
</style>