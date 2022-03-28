<template>
    <div style="padding-top:30px;">
    <router-view/>
    </div>
</template>

<script>
import AUTH from '../../api/auth';
import {mapActions} from "vuex";
export default {
    watch: {
        '$route'(to, from) {

        },
    },
    data() {
        return {

        };
    },
    created() {
        this.setTitle('회원가입');
        this.setClass('sub')
        this.setBackUrl('');
        let memberInfo = AUTH.getSession();
        if (memberInfo) {
            this.$router.push({path: '/'});
            return;
        }
        if(this.$route.name=='memberAgree')sessionStorage.setItem('memberJoinInfo','');
    },
    methods: {
        ...mapActions('mobile', ["setClass", "setTitle", "setBackUrl"]),
    },
    mounted() {

    },

}
</script>
<style lang="scss">
.subpage {
    margin-top:10px;

}
.btn-register {
    border-radius: 27px;
    background: #ffbb53 !important;
    height: 55px !important;
    position: fixed;
    bottom: 0;
    width: 90%;
    font-family: 'Noto Sans' !important;
    font-weight:600  !important;
    font-size:13pt !important;
    color:#fff !important;
    margin-bottom: 20px;
}
</style>