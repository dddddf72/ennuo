import axios from "axios";
export default {
    loginSync(context, data) {
        return new Promise((resolve,reject) => {
            axios.post("/api/userlogin", data).then(res => {
                if (res.data.code == 200) {
                    context.commit("setUserInfo", res.data.list);
                }
            //   console.log(res);
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        
    });
  }
};
