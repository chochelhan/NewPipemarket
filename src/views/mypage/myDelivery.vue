<template>
    <div class="page-contents">
        <ReceiveInfo :oid="oid" @regist="regist"></ReceiveInfo>
    </div>
</template>
<script>

import ReceiveInfo from '../components/receiveInfo'
import {mapActions} from "vuex";
export default {
    components:{
        ReceiveInfo:ReceiveInfo
    },
    data() {
        return {
            oid:'',
            cmd:'',
        };
    },
    created() {
        this.setClass('sub')
        this.setTitle('배송지 변경');
        this.setBackUrl('');
        this.oid = this.$route.params.oid;
    },
    methods: {
        ...mapActions('mobile', ["setClass", "setTitle", "setBackUrl"]),
        regist() {
            this.$router.push('/vmypage/receiveInfoForm');
        },

    }

}
</script>

<style lang="scss" scoped>
.active {
    border: solid 1px #000;
}
</style>