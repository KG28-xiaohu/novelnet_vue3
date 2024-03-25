<template>
    <div class="login_box">
        <div :class="{ container: true, 'panel-active': obj.isSignUp }">
            <!--  注册 -->
            <div class="container-form container-signup">
                <div action="#" class="form" id="form1">
                    <h2 class="form-title">注册账号</h2>
                    <input type="text" placeholder="Account" class="input" v-model="obj.user.account" />
                    <input type="password" placeholder="Password" class="input" v-model="obj.user.password" />
                    <input type="text" placeholder="Email" class="input" v-model="obj.user.email" />
                    <div>
                        <input type="text" placeholder="Verification" class="input2" v-model="obj.thisVerificationCode">
                        <button class="btn2" @click="mailboxVerification()">获取验证码</button>
                    </div>
                    <button type="button" class="btn" @click="enroll()">点击注册</button>
                </div>
            </div>
            <!-- 登录 -->
            <div class="container-form container-signin">
                <div action="#" class="form" id="form2">
                    <h2 class="form-title">欢迎登录</h2>
                    <input type="text" placeholder="Account" class="input" v-model="obj.user.account" />
                    <input type="password" placeholder="Password" class="input" v-model="obj.user.password" />
                    <a href="#" class="link">忘记密码?</a>
                    <button type="button" class="btn" @click="login()">登录</button>
                    <a href="#" class="link" @click="goBack()">返回主页</a>
                </div>
            </div>
            <div class="container-overlay">
                <div class="overlay">
                    <div class="overlay-panel overlay-left">
                        <button class="btn" id="signIn" @click="changeSign('signIn')">
                            已有账号，直接登录
                        </button>
                    </div>
                    <div class="overlay-panel overlay-right">
                        <button class="btn" id="signUp" @click="changeSign('signUp')">
                            没有账号，点击注册
                        </button>
                    </div>
                </div>
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

//邮箱正则
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

let obj = reactive({
    isSignUp: false,
    user: {
        account: "",
        password: "",
        email: "",
    },
    verificationCode: '',
    thisVerificationCode: ''
});

let clearUser = () => {
    obj.user = {
        account: "",
        password: "",
        email: "",
    };
}

let changeSign = (signInOrUp) => {
    clearUser();
    obj.isSignUp = signInOrUp == "signUp";
};

// 登录方法
let login = () => {
    axios
        .post(
            "/user/login",
            {
                account: obj.user.account,
                password: obj.user.password,
            },
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        )
        .then((res) => {
            if (res.data.code == 200) {
                localStorage.setItem("token", res.data.data);
                axios.post(
                    "/user/token/getUser",
                    {
                        account: obj.user.account,
                        password: obj.user.password,
                    },
                    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
                ).then(res => {
                    if (res.data.code == 200) {
                        sessionStorage.setItem("user", JSON.stringify(res.data.data));
                        goBack();
                    } {
                        alert(res.data.msg);
                    }
                });
            } else {
                alert(res.data.msg);
            }
        });
}

let mailboxVerification = () => {
    if (emailRegex.test(obj.user.email)) {
        alert("正在获取验证码");
        axios.get("/user/mailboxVerification", {
            params: {
                email: obj.user.email
            }
        }).then(res => {
            if (res.data.code == 200) {
                obj.verificationCode = res.data.data;
                console.log(res.data.data);
            } else {
                alert("验证码获取失败！")
            }
        })
    } else {
        alert("邮箱不符合规范！");
    }
}

//注册方法
let enroll = () => {
    if (obj.user.account != null && obj.user.email != null && obj.user.password != null) {
        if (obj.verificationCode == obj.thisVerificationCode) {
            axios.post("/user/enroll", obj.user).then(res => {
                if (res.data.code == 201) {
                    if (confirm("注册成功！是否自动登录？")) {
                        login();
                    } else {
                        changeSign();
                    }
                } else if (res.data.code == 403) {
                    alert("用户已存在！请重新输入");
                } else {
                    alert("系统出错！请稍后再试");
                }
            });
        } else {
            alert("邮箱验证码有误！")
        }
    } else {
        alert("数据请不要为空");
    }
}

let goBack = () => {
    router.push("/hello");
}

onMounted(() => { });
</script>

<style scoped>
.login_box {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    /* 设置内容居中 */
}

.login_box::before {
    content: "";
    display: block;
    width: 100%;
    height: 500px;
    background-image: linear-gradient(to bottom, #ffe1dc, #f6e4e3 25%, #ffffff);
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
}

.container {
    background-color: #e7e7e7;
    border-radius: 0.7rem;
    box-shadow: 0 0.9rem 1.7rem rgba(0, 0, 0, 0.25), 0 0.7rem rgba(0, 0, 0, 0.22);
    /* height: 920px;
               max-width: 1150px; */
    height: 420px;
    max-width: 750px;
    overflow: hidden;
    position: relative;
    width: 100%;
    /* 大盒子 */
}

/* 登录，注册框  */
.container-form {
    height: 100%;
    position: absolute;
    top: 0;
    transition: all 0.6s ease-in-out;
}

/* 登录框 - 默认层级 2 - 透明度 1*/
.container-signin {
    left: 0;
    width: 50%;
    z-index: 2;
}

/* 注册框 - 默认层级 1- 透明度 0*/
.container-signup {
    left: 0;
    opacity: 0;
    width: 50%;
    z-index: 1;
}

.form {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 0 3rem;
    height: 100%;
    text-align: center;
    background-color: #e7e7e7;
}

.form-title {
    font-weight: 300;
    margin: 0;
    margin-bottom: 1.25rem;
}

.link {
    color: #333;
    font-size: 0.9rem;
    margin: 1.5rem 0;
    text-decoration: none;
}

.input {
    width: 100%;
    background-color: #fff;
    padding: 0.9rem 0.9rem;
    margin: 0.5rem 0;
    border: none;
    outline: none;
}

.input2 {
    width: 50%;
    background-color: #fff;
    padding: 0.9rem 0.9rem;
    margin: 0.5rem 0;
    border: none;
    outline: none;
}

.btn {
    background-color: #f25d8e;
    box-shadow: 0 4px 4px rgba(255, 112, 159, 0.3);
    border-radius: 5px;
    color: #e7e7e7;
    border: none;
    cursor: pointer;
    font-size: 0.8rem;
    font-weight: bold;
    letter-spacing: 0.1rem;
    padding: 0.9rem 4rem;
    text-transform: uppercase;
    transition: transform 80ms ease-in;
}

.btn2 {
    background-color: #f25d8e;
    box-shadow: 0 4px 4px rgba(255, 112, 159, 0.3);
    border-radius: 5px;
    color: #e7e7e7;
    border: none;
    cursor: pointer;
    font-size: 0.8rem;
    font-weight: bold;
    letter-spacing: 0.1rem;
    margin-left: 20px;
    padding: 0.9rem 0.5rem;
    text-transform: uppercase;
    transition: transform 80ms ease-in;
}

.form>.btn {
    margin-top: 1.5rem;
}

/* .form>.btn2 {
    margin-top: 0.5rem;
} */

.btn:active,
.btn2:active {
    transform: scale(0.95);
}

.container-overlay {
    height: 100%;
    left: 50%;
    overflow: hidden;
    position: absolute;
    top: 0;
    transition: transform 0.6s ease-in-out;
    width: 50%;
    z-index: 100;
}

.overlay {
    width: 200%;
    height: 100%;
    position: relative;
    left: -100%;
    background: url("/image/lufei.jpg") no-repeat center fixed;
    background-size: cover;
    transition: transform 0.6s ease-in-out;
    transform: translateX(0);
}

.container-overlay {
    height: 100%;
    left: 50%;
    overflow: hidden;
    position: absolute;
    top: 0;
    transition: transform 0.6s ease-in-out;
    width: 50%;
    z-index: 100;
}

.overlay {
    width: 200%;
    height: 100%;
    position: relative;
    left: -100%;
    background: url("/image/lufei.jpg") no-repeat center fixed;
    background-size: cover;
    transition: transform 0.6s ease-in-out;
    transform: translateX(0);
}

.overlay-panel {
    height: 100%;
    width: 50%;
    position: absolute;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    transform: translateX(0);
    transition: transform 0.6s ease-in-out;
}

.overlay-left {
    transform: translateX(-20%);
}

.overlay-right {
    right: 0;
    transform: translateX(0);
}

.panel-active .overlay-left {
    transform: translateX(0);
}

.panel-active .container-overlay {
    transform: translateX(-100%);
}

.panel-active .overlay {
    transform: translateX(50%);
}

/* 设置激活时，登录注册层的位置和透明度  */
.panel-active .container-signIn {
    transform: translateX(100%);
}

.panel-active .container-signup {
    opacity: 1;
    z-index: 5;
    transform: translateX(100%);
    /* 通过类名 panel-active 添加激活的状态 */
}
</style>