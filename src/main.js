import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import VueLodash from 'vue-lodash'
import lodash from 'lodash'

Vue.config.productionTip = false


var EventBus = new Vue();
Object.defineProperties(Vue.prototype, {
    $eventBus: {
        get: function () {
            return EventBus;
        }
    }
});


const vue = new Vue({
    router,
    store,
    vuetify,
    render: h => h(App),
}).$mount('#app')

window.snsJoinProc = function (data) {
    vue.$eventBus.$emit('returnSnsInfo', data)
}

if (window.ReactNativeWebView) {
    document.addEventListener('userId', function (data) {
        if (data.type === 'userId') {
            vue.$eventBus.$emit('getAppLoginUserInfo', data.data)
        }

    });

    window.addEventListener('userId', function (data) {
        if (data.type === 'userId') {
            vue.$eventBus.$emit('getAppLoginUserInfo', data.data)
        }

    });
}

