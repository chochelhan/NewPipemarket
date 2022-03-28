<template>
    <myCouponComponent v-if="isLogin"></myCouponComponent>
</template>

<script>

import {mapActions} from "vuex";
import myCouponComponent from "./coupon/myCoupon"
import AUTH from "@/api/auth";
export default {
    components: {
        myCouponComponent
    },
    data() {
        return {
            isLogin:false,
        };
    },
    created() {
        if(AUTH.device!='app') {
            this.$router.back();
            return;
        }
        let memberInfo = AUTH.getSession();
        if (memberInfo) {
            this.isLogin = true;
        }
       if(!this.isLogin) {
            const checkMember = setInterval(()=> {
                let memberInfo = AUTH.getSession();
                if (memberInfo) {
                    this.isLogin = true;
                    clearInterval(checkMember);
                }
            },200)
        }
        this.setClass('none')
        this.setTitle('');
        this.setBackUrl('');

    },
    methods: {
        ...mapActions('mobile', ["setClass", "setTitle", "setBackUrl"]),
    }

}
</script>

