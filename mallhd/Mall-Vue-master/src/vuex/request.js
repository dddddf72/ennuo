import Vue from 'vue';
import axios from 'axios';
import { MessageBox } from 'element-ui';

const Request = {};
const send = (url, method = 'get', params, headers = {}) => axios
    .request({
        url,
        method,
        [method.toLowerCase() === 'get' ? 'params' : 'data']: params,
        headers
    })
    .then(
        (res) => {
            if (res.data.code === -100) {
                window.location = '/login';
                return Promise.reject(new Error('not login'));
            }
            if (res.data.code === 200) {
                return Promise.resolve(res);
            }
            MessageBox.alert(res.data.msg || '服务异常', '提示', {
                confirmButtonText: '确定'
            });
            return Promise.reject(res);
        },
        (err) => {
            if (err.response.status === 302) {
                window.location = '/login';
                return Promise.reject(err);
            }

            MessageBox.alert('服务异常', '提示', {
                confirmButtonText: '确定'
            });
            return Promise.reject(err);
        }
    )
    .catch((error) => {
        console.log(error);
        return Promise.reject(error);
    });

export const $get = (url, params, headers = {}) => send(url, 'get', params, headers);
export const $post = (url, params, headers = {}) => send(url, 'post', params, headers);

Request.install = (vm) => {
    vm.prototype.$get = $get;
    vm.prototype.$post = $post;
};

Vue.use(Request);
