<template>
    <div class="container wrap subpage">
        <div>
            <p class="signup-text-guide">본인 인증하고 혜택 받으세요!</p>
            <div class="item-term w-full">
                <div class="flex flex-row">
                    <div class="wrap-check">
                        <img src="../../../assets/images/check_yellow.png" />
                    </div>
                    <p>웰컴! 할인쿠폰을 드려요.</p>
                </div>
            </div>
            <div class="item-term w-full">
                <div class="flex flex-row">
                    <div class="wrap-check">
                        <img src="../../../assets/images/check_yellow.png" />
                    </div>
                    <p>더 많은 혜택을 받을 수 있어요.</p>
                </div>
            </div>
            <div class="item-term w-full">
                <div class="flex flex-row">
                    <div class="wrap-check">
                        <img src="../../../assets/images/check_yellow.png" />
                    </div>
                    <p>이벤트 참여 시 추가인증이 필요없어요.</p>
                </div>
            </div>
        </div>
        <div class="button-row">
            <v-btn depressed class="btn-veirfy w-button" @click="insertMember()">괜찮아요. 다음에 할래요.</v-btn>
            <v-btn depressed class="w-button text-white" @click="next()">본인 인증하기</v-btn>
        </div>
    </div>
</template>

<script>

import apiService from "../../../api/apiService";
import {API_URL_INSERT_MEMBER_INFO} from "../../../api/urls";
import AUTH from "../../../api/auth";

export default {
    data() {
        return {
            memberJoinInfo:{},
            agree:{},
        };
    },
    created() {
        let memberJoinInfo = sessionStorage.getItem('memberJoinInfo');
        if(memberJoinInfo) {
            this.memberJoinInfo = JSON.parse(memberJoinInfo);
            this.agree = this.memberJoinInfo.agreeInfo.agree;
        } else {
            this.$router.back();
        }
    },
    methods: {
        insertMember() {
            let info = this.memberJoinInfo.dataInfo;
            const frm = new FormData()
            frm.append('userId', info.uid)
            frm.append('email', info.uid)
            frm.append('name', info.name)
            frm.append('pw', info.upass)
            frm.append('comparePw', info.upass)

            if(this.agree.market) {
                frm.append('smsEmail','yes');
            } else {
                frm.append('smsEmail','no');
            }


            this.$eventBus.$emit('overlay', 'open');
            apiService.post(API_URL_INSERT_MEMBER_INFO, frm, (res) => {
                this.$eventBus.$emit('overlay', 'hide');

                let params = {};
                if(res.data.result=='success') {
                    AUTH.setSession(res.data.user);
                    params = {
                        message: '회원가입이 완료되었습니다',
                        doAction:()=>{
                            this.$router.push('/');
                        }
                    }
                } else if(res.data.result == 'doubleId') {
                    params = {
                        message: '중복된 아이디 입니다',
                    }

                }
                this.$eventBus.$emit('modalOpen', params);

            });
        },
        next() {
            this.$router.push('/vmember/join/step5')
        }
    },
    mounted() {

    },

}
</script>
<style lang="scss" scoped="true">
@import "../../../assets/style/signup4.css";
.button-row {
    position: fixed;
    bottom:6px;
}
.item-term {
    padding:10px 18px;
    p {
        padding-top: 15px;
    }
    .wrap-check {
        margin-top: 13px;
        background: none;
    }
}
.w-button {
    border-radius: 27px;
    background: #000 !important;
    height: 55px !important;
    width: 90%;
    font-family: 'Noto Sans' !important;
    font-weight:600  !important;
    font-size:13pt !important;
    color:#fff !important;
    margin-bottom: 14px;
    &.btn-veirfy {
        background:#fff !important;
        color:#888 !important;
    }
}
</style>