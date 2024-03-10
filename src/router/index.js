import { createRouter, createWebHashHistory } from 'vue-router';
import Hello from '../components/Hello.vue';
import Home from "../components/Home.vue";
import TypeBook from '../components/TypeBook.vue';
import Bookshelf from '../components/Bookshelf.vue';
import Login from '../components/Login.vue';
import BookDetail from '../components/BookDetail.vue';
import BookList from '../components/BookList.vue';
import ReadBook from '../components/ReadBook.vue';

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: 'hello'
    },
    {
      path: '/hello',
      component: Hello,
      children: [
        {
          path: '',
          component: Home
        },
        {
          path: 'home',
          component: Home
        },
        {
          path: 'typeBook',
          component: TypeBook
        },
        {
          path: 'bookshelf',
          component: Bookshelf
        },
        {
          path: 'bookDetail/:bid',
          name: 'bookDetail',
          component: BookDetail
        },
        {
          path: 'bookList',
          component: BookList
        }
      ]
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/readBook',
      component: ReadBook
    }
  ]
})