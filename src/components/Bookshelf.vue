<template>
    <div class="bookshelf_box">
        <!-- 好看的小说 -->
        <div class="bookshelf">
            <div class="bookshelf_title">
                <span>我的书架</span>
                <button @click="router.go(-1)">返回上一页&gt;</button>
            </div>
            <div class="bookshelf_list">
                <div v-for="(item, index) in obj.books" :key="index" @click="goReadBook(item.book.bid)">
                    <img :src="`/image/bookImg/${item.book.imgPath}`" />
                    <div class="bookshelf_list_content">
                        <span class="bookshelf_list_content_top">{{ item.book.name }}</span>
                        <!-- <span class="bookshelf_list_content_middle">
                            {{ cutString(item.book.introduction, 30) }}
                        </span> -->
                        <div class="bookshelf_list_content_bottom">
                            <span>{{ item.book.author }}</span>
                            <span>{{ item.book.type }} | {{ item.book.state }}</span>
                        </div>
                        <div class="bookshelf_list_content_del">
                            <button @click.stop="delBookshelf(item.book.bid)">移除</button>
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
    books: {},
    book: {},
    lastChapter: {},
    lastChapterNum: 0
});

let getBooks = () => {
    let uid = JSON.parse(sessionStorage.getItem('user')).uid;
    axios.get("/bookshelf/token/getBookshelfByUid", {
        params: {
            uid
        },
    }).then((res) => {
        if (res.data.code == 200) {
            obj.books = res.data.data;
        }
    });
}

let goBookDetail = (bid) => {
    router.push({ name: 'bookDetail', params: { bid } });
}

let delBookshelf = (bid) => {
    if (confirm("确认移除收藏吗?")) {
        let uid = JSON.parse(sessionStorage.getItem('user')).uid;
        axios.delete("/bookshelf/token/delBook", {
            params: {
                uid,
                bid
            }
        }).then(res => {
            if (res.data.code == 200) {
                getBooks();
            } else {
                alert("移除失败");
            }
        })
    }
}


let getBook = (bid) => {
    axios.get(`/book/getBook/${bid}`).then(res => {
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
                        readBook(-1);
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

let goReadBook = (bid) => {
    getBook(bid);
}

onMounted(() => {
    getBooks();
});

</script>

<style scoped>
.bookshelf_box {
    padding-top: 0.1px;
}

.bookshelf {
    margin-top: 40px;
}

.bookshelf_title {
    display: flex;
    justify-content: space-between;
    /* 在子元素之间和两端分配空间 */
    flex-wrap: wrap;
    /* 允许子元素换行 */
    align-items: center;
    /* 垂直居中 */
}

.bookshelf_title span {
    font-size: 22px;
    font-weight: 600;
}

.bookshelf_title button {
    padding: 0 5px;
    border: 1px solid #000000;
    border-radius: 10px;
    background-color: #ffffff00;
    cursor: pointer;
}

.bookshelf_list {
    width: 100%;
    height: 500px;
    margin-top: 20px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px 40px;
}

.bookshelf_list>div {
    display: flex;
    height: 150px;
}

.bookshelf_list>div>img {
    height: 150px;
}

.bookshelf_list_content {
    padding: 15px 10px;
    display: flex;
    justify-content: space-around;
    flex-direction: column;
    flex-wrap: wrap;
}

.bookshelf_list_content_top {
    font-size: 18px;
    font-weight: 600;
    line-height: 30px;
}

.bookshelf_list_content_middle {
    font-size: 14px;
    text-indent: 20px;
    line-height: 25px;
}

.bookshelf_list_content_bottom {
    color: #6f6f6f;
    font-size: 14px;
    line-height: 25px;
    display: flex;
    justify-content: space-between;
}

.bookshelf_list_content_del {
    text-align: right;
}

.bookshelf_list_content_del button {
    padding: 0 10px;
    border: none;
    border-radius: 10px;
    background-color: #d8d8d8;
    font-size: 14px;
    line-height: 20px;
}
</style>