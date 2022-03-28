import {CONFIG_HEADER_POST, CONFIG_HEADER_GET, CONFIG_HEADER_FILE} from './urls'

export default {
    device:'web',
    autoLogin:true,

    setDevice(device) {
        this.device = device;
        if(this.device == 'web') {
            this.autoLogin = (localStorage.getItem('autoLogin')=='yes')?true:false;
        } else {
            this.autoLogin = true;
        }
        let member = this.getSession();
        if (member && member.code) {

            CONFIG_HEADER_POST.Authorization = member.code;
            CONFIG_HEADER_GET.Authorization = member.code;
            CONFIG_HEADER_FILE.Authorization = member.code;


        }
        CONFIG_HEADER_POST.device = this.device;
        CONFIG_HEADER_GET.device = this.device;
        CONFIG_HEADER_FILE.device = this.device;


    },
    getSession() {

        if (this.autoLogin) {
            if (localStorage.getItem('memberInfo')) {
                return JSON.parse(localStorage.getItem('memberInfo'))
            }
        } else {
            if (sessionStorage.getItem('memberInfo')) {
                return JSON.parse(sessionStorage.getItem('memberInfo'))
            }
        }
        return false;
    },
    setSession(params) {
        if (this.autoLogin) {
            localStorage.setItem('memberInfo', JSON.stringify(params.userInfo))
        } else {
            sessionStorage.setItem('memberInfo', JSON.stringify(params.userInfo))
        }

        localStorage.setItem('authToken',params.userInfo.code);


        CONFIG_HEADER_POST.Authorization = params.userInfo.code;
        CONFIG_HEADER_GET.Authorization = params.userInfo.code;
        CONFIG_HEADER_FILE.Authorization = params.userInfo.code;


    },
    updateSession(params) {
        if (this.autoLogin) {
            localStorage.setItem('memberInfo', JSON.stringify(params))
        } else {
            sessionStorage.setItem('memberInfo', JSON.stringify(params))
        }

    },
    logout() {
        if (this.autoLogin) {
            localStorage.setItem('memberInfo', '')
        } else {
            sessionStorage.setItem('memberInfo', '')
        }
        localStorage.setItem('autoLogin', 'no')
        localStorage.setItem('authToken','');

        CONFIG_HEADER_POST.Authorization = '';
        CONFIG_HEADER_GET.Authorization = '';
        CONFIG_HEADER_FILE.Authorization = '';
    },
    dataEmpty() {
        if (this.autoLogin) {
            if(localStorage.getItem('memberInfo')) {
                localStorage.setItem('appTempMemberInfo',localStorage.getItem('memberInfo'));
                localStorage.setItem('memberInfo', '')
            }

        } else {
            sessionStorage.setItem('memberInfo', '')
        }
        localStorage.setItem('autoLogin', 'no')
        CONFIG_HEADER_POST.Authorization = '';
        CONFIG_HEADER_GET.Authorization = '';
        CONFIG_HEADER_FILE.Authorization = ''
    },
    checkAppMemberInfo(uid) {
        if(localStorage.getItem('appTempMemberInfo')) {
            const mem = JSON.parse(localStorage.getItem('appTempMemberInfo'));
            if(mem.id == uid) {
                localStorage.setItem('memberInfo',localStorage.getItem('appTempMemberInfo'));
                CONFIG_HEADER_POST.Authorization = mem.code;
                CONFIG_HEADER_GET.Authorization = mem.code;
                CONFIG_HEADER_FILE.Authorization = mem.code;
                localStorage.setItem('appTempMemberInfo','');
                return true;
            } else return false;

        } else return false;


    }


}
