<template>
    <div class="page-contents">
        <div class="bfit-box">
            <div class="benefit-box" @click="showMemberBenefit()">
                <img src="../../assets/images/image.png">
            </div>
        </div>
    </div>
</template>

<script>

import {mapActions} from "vuex";
import AUTH from "../../api/auth";
import UTIL from "../../api/util";
import apiService from "../../api/apiService";
import {API_URL_GET_MYPAGE_MAIN} from "../../api/urls";

export default {
    data() {
        return {};
    },
    created() {
        this.setClass('none')
        this.setTitle('');
        this.setBackUrl('');
        let memberInfo = AUTH.getSession();
        if (!memberInfo) {
            this.$router.push('/');
            return;
        }
    },
    methods: {
        ...mapActions('mobile', ["setClass", "setTitle", "setBackUrl"]),
        showMemberBenefit() {
            this.$router.back();
        }
    }

}
</script>

<style lang="scss" scoped>
.text-cut {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    line-height: 1em;
    height: 1em;
    display: inline-block;
    max-width: 70px;
}

.page-contents {
    z-index: 100;
    min-height: calc(100vh);
    background: #eee;
    .bfit-box {
        position: relative;
        width: 100%;
        overflow-y: auto;
        .benefit-box {
            position: relative;
            width: 100%;
            background: #eee;
            padding-bottom: 200px;
            img {
                max-width: 100%;
            }
        }
    }
}
</style>