<template>
    <div class="page-contents">
        <ReceiveInfoForm orderEquals="not"></ReceiveInfoForm>
    </div>
</template>
<script>

import ReceiveInfoForm from '../components/receiveInfoForm'
import {mapActions} from "vuex";
export default {
    components:{
        ReceiveInfoForm:ReceiveInfoForm
    },
    data() {
        return {
        };
    },
    created() {
        this.setClass('sub')
        this.setTitle('신규 배송지 추가');
        this.setBackUrl('');
    },
    methods: {
        ...mapActions('mobile', ["setClass", "setTitle", "setBackUrl"]),

    }

}
</script>

<style lang="scss" scoped>
.active {
    border: solid 1px #000;
}
</style>