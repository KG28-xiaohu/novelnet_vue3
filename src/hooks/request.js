import axios from "axios";
    let http=axios.create({
        baseURL:"http://localhost:8081"
    })
    http.interceptors.request.use(
        config=>{
            let token=localStorage.getItem("token")
            if(token){
                config.headers.Authorization=token;
            }
            return config
        }
    )
export default http
//axios拦截器：拦截所有axios