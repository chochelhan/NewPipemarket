import axios from 'axios'
import {
    CONFIG_HEADER_GET, CONFIG_HEADER_POST,
    CONFIG_HEADER_FILE
} from './urls'

import AUTH from './auth'

export default {
    DEBGU: true,
    vueObj: null,
    setApp(obj) {
        this.vueObj = obj;
    },
    post(url, frm, afterFunc, errorFunc) {
        this.checkDebug();

        if (AUTH.device == 'app') {
            if (url == '/api/member/getApiMemberInfo') {
                this.postAction(url, frm, afterFunc, errorFunc);
            } else {
                if (!AUTH.getSession()) {
                    const appInterval = setInterval(() => {
                        if (AUTH.getSession()) {
                            clearInterval(appInterval);
                            this.postAction(url, frm, afterFunc, errorFunc);
                        }
                    }, 200)
                } else {
                    this.postAction(url, frm, afterFunc, errorFunc);
                }
            }
        } else {
            this.postAction(url, frm, afterFunc, errorFunc);
        }
    },
    postAction(url, frm, afterFunc, errorFunc) {
        axios.post(url, frm, {headers: CONFIG_HEADER_POST}).then(res => {

            if (res.data.data && res.data.data.forceLogout == 'forceLogout') {

                this.forceLogout();
                return;
            }
            if (this.DEBGU) {
                console.log(res.data)
            }
            afterFunc(res.data);

        }).catch((error) => {
            this.setError(error);

        });
    },
    postFile(url, frm, afterFunc) {
        this.checkDebug();
        if (AUTH.device == 'app') {
            if (!AUTH.getSession()) {
                const appInterval = setInterval(() => {
                    if (AUTH.getSession()) {
                        clearInterval(appInterval);
                        this.postFileAction(url, frm, afterFunc);
                    }
                }, 200)
            }  else {
                this.postFileAction(url, frm, afterFunc);
            }
        } else {
            this.postFileAction(url, frm, afterFunc);
        }
    },
    postFileAction(url, frm, afterFunc) {
        axios.post(url, frm, {headers: CONFIG_HEADER_FILE}).then(res => {
            if (res.data.data && res.data.data.forceLogout == 'forceLogout') {
                this.forceLogout();
                return;
            }

            if (this.DEBGU) {
                console.log(res.data)
            }
            afterFunc(res.data);
        }).catch((error) => {
            this.setError(error);

        });
    },
    get(url, frm, afterFunc, errorFunc) {
        this.checkDebug();

        if (AUTH.device == 'app') {
            if (!AUTH.getSession()) {
                const appInterval = setInterval(() => {
                    if (AUTH.getSession()) {
                        clearInterval(appInterval);
                        this.getAction(url, frm, afterFunc, errorFunc);
                    }
                }, 200)
            } else {
                this.getAction(url, frm, afterFunc, errorFunc);
            }


        } else {
            this.getAction(url, frm, afterFunc, errorFunc);
        }
    },
    getAction(url, frm, afterFunc, errorFunc) {
        axios.get(url, {params: frm, headers: CONFIG_HEADER_GET}).then(res => {
            if (this.DEBGU) {
                console.log(res.data)
            }
            afterFunc(res.data);
            if (res.data.data && res.data.data.forceLogout == 'forceLogout') {

                this.forceLogout();
                return;
            }

        }).catch((error) => {
            if (errorFunc) errorFunc(error.response.data)
            else this.setError(error);


        });
    },
    forceLogout() {
        const url = location.pathname;
        AUTH.dataEmpty();
        if (url == '/main') {
            this.vueObj.$eventBus.$emit('forceLogOut')
        } else {
            this.vueObj.$router.push('/main');
        }
    },
    checkDebug() {
        if (location.host == 'localhost:8080') {
            this.DEBGU = true;
        } else this.DEBGU = false;
    },
    setError(error) {
        if (!this.DEBGU) return;
        if (error.response) {
            // ????????? ?????????????????? ????????? 2xx??? ????????? ???????????? ?????? ????????? ??????????????????.
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        } else if (error.request) {
            // ????????? ????????? ????????? ????????? ?????? ???????????????.
            // `error.request`??? ??????????????? XMLHttpRequest ???????????? ??????
            // Node.js??? http.ClientRequest ?????????????????????.
            console.log(error.request);
        } else {
            // ????????? ???????????? ????????? ???????????? ?????? ????????? ??????????????????.
            console.log('Error', error.message);
        }

    }


}
