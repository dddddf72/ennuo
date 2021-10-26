import axios from 'axios'
import store from '../../store'
axios.defaults.headers.common['Authorization'] = store.state.userinfo.token;
// axios拦截器封装
// function getfn(url, params = {}) {
//     return new Promise((resolve, reject) => {
//         axios({
//             url, params,
//             headers: {
//                 Authorization:store.state.userinfo.token
//             }
//         }).then(res => {
//             resolve(res);
//         }).catch(err => {
//             reject(err)
//         })
//     })
// }
// function postfn(url, data={}) {
//     return new Promise((resolve, reject) => {
//         axios({
//             url, data,
//             headers: {
//                 Authorization:store.state.userinfo.token
//             }
//         }).then(res => {
//             resolve(res)
//         }).catch(err => {
//             reject(err)
//         })
//     })
// }
// export default {getfn,postfn}
export default axios;