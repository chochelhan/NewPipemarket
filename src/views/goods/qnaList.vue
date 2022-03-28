<template>
    <div class="page-contents" style="background-color: #eee;min-height:calc(100vh - 50px)">
        <QnaListComponent :pid="pid" type="goodsAllList"></QnaListComponent>
    </div>
</template>

<script>




import QnaListComponent from '../components/qnaList'

import {mapActions} from "vuex";
import AUTH from "../../api/auth";

export default {
    components:{
        QnaListComponent
    },
    data() {
        return {
            isLogin:false,
            pid:'',
        };
    },
    created() {
        this.setClass('goodsDetail')
        this.setTitle('Q&A');
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

