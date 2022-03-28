<template>
    <myCouponComponent></myCouponComponent>
</template>

<script>

import {mapActions} from "vuex";
import myCouponComponent from "./coupon/myCoupon"
export default {
    components: {
        myCouponComponent
    },
    data() {
        return {

        };
    },
    created() {
        this.setClass('goodsDetail')
        this.setTitle('쿠폰');
        this.setBackUrl('');


    },
    methods: {
        ...mapActions('mobile', ["setClass", "setTitle", "setBackUrl"]),
    }

}
</script>

