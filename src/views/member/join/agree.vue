<template>
    <div class="container wrap subpage">
        <div>
            <p class="signup-text-guide">
                피리마켓 서비스 이용약관에<br>동의해주세요.
            </p>
            <div class="item-term w-full item-term-active" >
                <div class="flex flex-row items-center" @click="allCheckToggle()">
                    <div class="wrap-check">
                        <img v-if="allCheck"  src="../../../assets/images/check_yellow.png" />
                        <img v-else src="../../../assets/images/check.png" />
                    </div>
                    <p class="font-semibold">약관 전체동의</p>
                </div>
            </div>
            <div class="item-flex item-term w-full">
                <div class="flex flex-row items-center" @click="agreeCheck('agree')">
                    <div class="wrap-check">
                        <img v-if="agree.agree"  src="../../../assets/images/check_yellow.png" />
                        <img v-else src="../../../assets/images/check.png" />
                    </div>
                    <p>이용약관 동의(필수)</p>

                </div>
                <div @click="showAgree('use')" class="view-btn">자세히보기</div>
            </div>
            <div class="item-flex item-term w-full">
                <div class="flex flex-row items-center"  @click="agreeCheck('privacy')">
                    <div class="wrap-check">
                        <img v-if="agree.privacy"  src="../../../assets/images/check_yellow.png" />
                        <img v-else src="../../../assets/images/check.png" />
                    </div>
                    <p>개인정보처리방침(필수)</p>
                </div>
                <div @click="showAgree('privacy')" class="view-btn">자세히보기</div>
            </div>
            <div class="item-flex item-term w-full">
                <div class="flex flex-row items-center"  @click="agreeCheck('market')">
                    <div class="wrap-check">
                        <img v-if="agree.market"  src="../../../assets/images/check_yellow.png" />
                        <img v-else src="../../../assets/images/check.png" />
                    </div>
                    <p>마케팅 정보 수신 동의(선택)</p>
                </div>
                <div @click="showAgree('market')" class="view-btn">자세히보기</div>
            </div>
        </div>
        <v-btn  depressed class="btn-register text-white text-base" @click="next()">동의하고 가입하기</v-btn>

        <div v-if="modalShow"
             class="
        fixed
        top-0
        left-0
        bg-black bg-opacity-60
        w-full
        h-full
        flex
        justify-center
        items-center
        px-8
      " style="z-index:40;">
            <div class="w-full bg-white rounded-2xl">
                <div class="value-text" v-html="content">

                </div>
                <div class="button-text" @click="modalShow=false">
                        닫기
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import apiService from "@/api/apiService";
import {API_URL_GET_AGREE_INFO, API_URL_INSERT_MEMBER_INFO} from "@/api/urls";
import AUTH from "@/api/auth";

export default {
    data() {
        return {
            allCheck:false,
            agree:{
                agree:false,
                privacy:false,
                market:false,
            },
            memberJoinInfo: {
                agreeInfo:{},
                dataInfo:{}
            },
            snsId:'',
            snsType:'',
            modalShow:false,
            content:'',
            contentData: {

            }
        };
    },
    created() {
        let snsInfo = localStorage.getItem('snsInfo');
        if(snsInfo) {
            snsInfo = JSON.parse(snsInfo)
            this.snsId = snsInfo.id;
            this.snsType = snsInfo.type;
        }

        let memberJoinInfo = sessionStorage.getItem('memberJoinInfo');
        if(memberJoinInfo) {
            memberJoinInfo = JSON.parse(memberJoinInfo);
            this.memberJoinInfo = memberJoinInfo;
            this.allCheck = this.memberJoinInfo.agreeInfo.allCheck;
            this.agree = this.memberJoinInfo.agreeInfo.agree;
        }
        this.getData();
    },
    methods: {
        getData() {
            const frm = new FormData();
            apiService.post(API_URL_GET_AGREE_INFO, frm, (res) => {
                this.contentData = {
                    privacy:res.data.policyData.collection.contents,
                    use:res.data.policyData.use.contents,
                    market:res.data.policyData.marketing.contents,
                }

            });

        },
        allCheckToggle() {
            if(this.allCheck) {
                this.allCheck = false;
                for(let key in this.agree) {
                    this.agree[key] = false;
                }
            } else {
                this.allCheck = true;
                for(let key in this.agree) {
                    this.agree[key] = true;
                }
            }
        },
        agreeCheck(cmd) {
            if(this.agree[cmd])this.agree[cmd] = false;
            else this.agree[cmd] = true;

            let check = true;
            for(let key in this.agree) {
                if(!this.agree[key]) {
                    check = false;
                    break;
                }
            }
            this.allCheck = check;
        },
        showAgree(cmd) {
            this.content = this.contentData[cmd];
            this.modalShow = true;
        },
        next() {
            if(!this.agree.agree || !this.agree.privacy) {
                let params = {
                    message: '필수 동의사항에 체크하세요',
                }
                this.$eventBus.$emit('modalOpen', params);
                return;
            }
            this.memberJoinInfo.agreeInfo = {
                allCheck:this.allCheck,
                agree:this.agree
            };
            sessionStorage.setItem('memberJoinInfo',JSON.stringify(this.memberJoinInfo));
            if(this.snsType) {
               this.$router.push('/vmember/join/snsStep')
            } else {

                this.$router.push('/vmember/join/step1')
            }

        },

    },
    mounted() {

    },

}
</script>
<style lang="scss" scoped="true">
@import "../../../assets/style/signup1.css";

.item-term {
    padding:10px 18px;
    p {
        padding-top: 15px;
    }
}
.item-flex {
    display: flex;
    justify-content: space-between;
    .view-btn {
        border:solid 1px #9d9d9d;
        color:#9d9d9d;
        font-size:11px;
        border-radius:3px;
        height:19px;
        padding:0 3px;
        margin-top:16px;

    }
}
.value-text {
    margin:20px;
    font-size:11px;
    color:#000;
    max-height:300px;
    overflow-y:auto;
}
.button-text {
    height:47px;
    width:100%;
    border-top:solid 1px #ddd;
    text-align:center;
    line-height:47px;
    color:#000;
}
</style>