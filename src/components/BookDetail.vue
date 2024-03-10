<template>
    <div class="book_detail_box">
        <div class="book_detail_title">
            <span>小说详情</span>
            <button @click="router.go(-1)">返回上一页&gt;</button>
        </div>
        <div class="book_detail_top">
            <img :src="`/src/image/bookImg/${obj.book.imgPath}`" class="book_detail_img" />
            <div class="book_detail_content">
                <span class="book_detail_content_name">{{ obj.book.name }}</span>
                <span class="book_detail_content_author">{{ obj.book.author }}</span>
                <div class="book_detail_content_tag">
                    <span class="book_detail_content_type">
                        {{ obj.book.type }}
                    </span>
                    <span>
                        {{ obj.book.state }}
                    </span>
                    <span>
                        好评：{{ obj.book.loveNum }}
                    </span>
                </div>
                <div>
                    <span class="book_detail_content_issuedTime">
                        更新时间：{{ obj.book.issuedTime }}
                    </span>
                    <span>
                        {{ obj.lastChapterNum == 0 ? '未阅读' : `已看章节：第${obj.lastChapterNum}章  ${obj.lastChapter.title}` }}
                    </span>
                </div>
                <div class="book_detail_content_but_box">
                    <button class="book_detail_content_but_read" @click="readBook(-1)">
                        {{ obj.lastChapterNum == 0 ? '立即阅读' : '继续阅读' }}
                    </button>
                    <div class="book_detail_content_but_praise" @click="thumbsUp()">
                        <img src="../image/icon/praise.png" alt="">
                        <span>好评</span>
                    </div>
                    <div class="book_detail_content_but_collect" @click="collectBook()">
                        <img src="../image/icon/love.png" alt="">
                        <span>收藏</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="book_detail_introduction_box">
            <div class="book_detail_introduction_title">
                <span>书籍简介</span>
            </div>
            <div class="book_detail_introduction_content">
                <span>{{ obj.book.introduction }}</span>
            </div>
        </div>

        <div class="book_detail_chapters_box">
            <div class="book_detail_chapters_title">
                <span>书籍章节</span>
            </div>
            <ul class="book_detail_chapters_content">
                <li v-for="item in obj.book.chapters" :key="item.chapterNum" @click="readBook(item.chapterNum)">
                    <span>第{{ item.chapterNum }}章</span>
                    <span>《{{ item.title }}》</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import axios from '../hooks/request';
import { onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';

let route = useRoute();
let router = useRouter();

let obj = reactive({
    book: {},
    lastChapter: {},
    lastChapterNum: 0
})

//收藏图书
let collectBook = () => {
    let user = sessionStorage.getItem('user');
    if (user) {
        let uid = JSON.parse(user).uid;
        axios.post("/bookshelf/token/addBook", {
            uid,
            bid: obj.book.bid
        }, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(res => {
            if (res.data.code == 201) {
                alert("收藏成功！")
            } else if (res.data.code == 403) {
                alert("重复收藏！")
            } else {
                alert("收藏失败！")
            }
        })
    } else {
        if (confirm("此操作需要登录，是否登录？")) {
            router.push({ path: '/login' });
        }
    }
}

//点赞
let thumbsUp = () => {
    if (sessionStorage.getItem('user')) {
        axios.put(`/book/token/thumbsUp?bid=${obj.book.bid}`, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
            .then(res => {
                if (res.data.code == 200) {
                    alert("点赞成功！")
                    getBook();
                } else {
                    alert("点赞失败！")
                }
            })
    } else {
        if (confirm("此操作需要登录，是否登录？")) {
            router.push({ path: '/login' });
        }
    }
}

let getBook = () => {
    axios.get(`/book/getBook/${route.params.bid}`).then(res => {
        if (res.data.code == 200) {
            obj.book = res.data.data;
            getLastChapter();
        }
    })
}

//获取阅读的章节
let getLastChapter = () => {
    let user = sessionStorage.getItem('user');
    if (user) {
        let uid = JSON.parse(user).uid;
        axios.get("/bookshelf/token/getBookshelf", {
            params: {
                uid,
                bid: obj.book.bid
            }
        }).then(res => {
            if (res.data.code == 200) {
                obj.lastChapterNum = res.data.data.lastChapter;
                axios.get("/chapter/getChapter", {
                    params: {
                        uid,
                        bid: obj.book.bid,
                        chapterNum: obj.lastChapterNum
                    }
                }).then(res2 => {
                    if (res2.data.code == 200) {
                        obj.lastChapter = res2.data.data;
                    }
                })
            }
        })
    } else {
        obj.lastChapter = 0;
    }
}

let readBook = (chapterNum) => {
    if (chapterNum < 0) {
        router.push({ path: '/readBook', query: { bid: obj.book.bid, chapterNum: obj.lastChapterNum } });
    } else {
        router.push({ path: '/readBook', query: { bid: obj.book.bid, chapterNum } });
    }
}

onMounted(() => {
    getBook();
})
</script>

<style scoped>
.book_detail_box {
    padding-top: 0.1px;
}

.book_detail_title {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    /* 在子元素之间和两端分配空间 */
    flex-wrap: wrap;
    /* 允许子元素换行 */
    align-items: center;
    /* 垂直居中 */
}

.book_detail_title span {
    font-size: 22px;
    font-weight: 600;
}

.book_detail_title button {
    padding: 0 5px;
    border: 1px solid #000000;
    border-radius: 10px;
    background-color: #ffffff00;
    cursor: pointer;
}

.book_detail_top {
    height: 250px;
    margin-top: 30px;
    display: flex;
}

.book_detail_content {
    width: 600px;
    padding: 15px 35px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.book_detail_content_name {
    font-weight: 600;
    font-size: 30px;
}

.book_detail_content_author {
    color: #ff1500;
}

.book_detail_content_type {
    margin-right: 30px;
    padding: 0 10px;
    display: inline-block;
    border-radius: 5px;
    background-color: #e8e8e8;
    font-size: 14px;
    line-height: 25px;
}

.book_detail_content_tag span:last-of-type {
    margin-left: 50px;
}

.book_detail_content_issuedTime {
    display: inline-block;
    margin-right: 30px;
}

.book_detail_content_but_box {
    display: flex;
}

.book_detail_content_but_read {
    width: 170px;
    height: 50px;
    margin-right: 110px;
    border: none;
    border-radius: 25px;
    background-color: #CB3D30;
    color: #ffffff;
    font-size: 20px;
    font-weight: 600;
}

.book_detail_content_but_praise,
.book_detail_content_but_collect {
    margin: 0 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.book_detail_content_but_praise img,
.book_detail_content_but_collect img {
    width: 30px;
}

.book_detail_introduction_box,
.book_detail_chapters_box {
    margin-top: 40px;
}

.book_detail_introduction_title,
.book_detail_chapters_title {
    border-bottom: 1px solid #808080;
}

.book_detail_introduction_title span,
.book_detail_chapters_title span {
    line-height: 60px;
    font-weight: 600;
    font-size: 24px;
}

.book_detail_introduction_content {
    margin: 0;
    text-indent: 50px
}

.book_detail_introduction_content span {
    font-size: 18px;
    line-height: 50px;
}

.book_detail_chapters_content {
    list-style: none;
}

.book_detail_chapters_content li {
    height: 50px;
    border-bottom: 1px solid #c7c5c5;
    font-size: 18px;
    text-indent: 50px;
    line-height: 50px;
    cursor: pointer;
}

.book_detail_chapters_content li:hover {
    color: #ff0000;
}

.book_detail_chapters_content li span {
    margin-right: 50px;
}
</style>