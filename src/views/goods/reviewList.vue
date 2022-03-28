<template>
    <div class="page-contents" style="background-color: #fff;min-height:calc(100vh - 50px);">
        <ReviewListComponent :pid="pid" type="goodsAllList"></ReviewListComponent>
    </div>
</template>

<script>




import ReviewListComponent from '../components/reviewList'

import {mapActions} from "vuex";
import AUTH from "../../api/auth";

export default {
    components:{
        ReviewListComponent
    },
    data() {
        return {
            isLogin:false,
            pid:'',
        };
    },
    created() {
        this.setClass('goodsDetail')
        this.setTitle('리뷰');
        this.setBackUrl('');
        let memberInfo = AUTH.getSession();
        if (memberInfo) {
            this.isLogin = true;
        }
        this.pid = this.$route.params.pid;
    },
    methods: {
        ...mapActions('mobile', ["setClass", "setTitle", "setBackUrl"]),

    }

}
</script>

