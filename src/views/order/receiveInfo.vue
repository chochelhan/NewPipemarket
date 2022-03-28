<template>
    <div class="page-contents">
        <ReceiveInfo @regist="regist"></ReceiveInfo>
    </div>
</template>
<script>

import ReceiveInfo from '../components/receiveInfo'
export default {
    components:{
        ReceiveInfo:ReceiveInfo
    },
    data() {
        return {
            cartIdx: '',

        };
    },
    created() {
        this.cartIdx = this.$route.params.cartIdx;

    },
    methods: {
        regist() {
            this.$router.push('/vorder/' + this.cartIdx + '/receiveInfoForm');
        },

    }

}
</script>

<style lang="scss" scoped>
.active {
    border: solid 1px #000;
}
</style>