<template>
    <div class="container wrap subpage">
        <div>
            <p class="signup-text-guide">정보를 입력해주세요</p>
            <v-text-field
                outlined
                required
                :error-messages="nameErrors"
                @input="$v.name.$touch()"
                @blur="$v.name.$touch()"
                v-model="name"
                label="닉네임"
                placeholder="닉네임을 입력해주세요"
            />
            <div style="margin-top:-7px;">- 영문(대/소문자), 한글, 특수문자(.-_&) 포함</div>
            <div>- 최대 8자까지 가능</div>
            <p class="signup-text-guide" style="margin-top:50px;">핸드폰으로 본인인증을<br>진행해주세요</p>
            <div class="flex flex-row justify-between">
                <input
                    v-model="pcs"
                    type="number"
                    style="border:solid 1px #ddd;"
                    class="border rounded input-phone"
                    placeholder="휴대폰 번호(숫자만 입력)"
                />
                <v-btn depressed @click="sendPcs()"   style="background: #000;color:#fff;height:45px;" class="text-white btn-otp">인증번호 받기</v-btn>
            </div>
            <div class="wrap-otp-input" v-if="sendPcsNum">
                <input
                    v-model="authNum"
                    style="border:solid 1px #ddd;"
                    class="border w-full rounded input-otp"
                    placeholder="인증번호 입력"
                />
                <p class="time-down">남은시간 {{ authTime }}</p>
            </div>
        </div>
        <v-btn @click="joinMember()" depressed class="btn-register text-white text-base">인증완료</v-btn>
    </div>
</template>

<script>

import apiService from "../../../api/apiService";
import {
    API_URL_CHECK_MEMBER_EMAIL,
    API_URL_INSERT_MEMBER_INFO,
    API_URL_SEND_MEMBER_PCS
} from "../../../api/urls";
import AUTH from "../../../api/auth";
import {validationMixin} from "vuelidate";
import {email, maxLength, minLength, required} from "vuelidate/lib/validators";

export default {
    mixins: [validationMixin],
    validations: {
        name: {required,maxLength: maxLength(8)},
    },
    computed: {
        nameErrors() {
            const errors = []
            if (!this.$v.name.$dirty) return errors
            !this.$v.name.required && errors.push('닉네임을 입력하세요')
            !this.$v.name.maxLength && errors.push('닉네임은 최대8자까지 가능합니다')
            const regex = /^[ㄱ-ㅎ가-힣a-zA-Z0-9._\-&]+$/;
            if(!regex.test(this.name)) {
                errors.push('영문(대/소문자), 한글, 특수문자(.-_&) 포함된 형태만 가능합니다')
            }
            return errors
        },
    },
    data() {
        return {
            pcs:'',
            sendPcsNum:false,
            authNum:'',
            authTime:'',
            memberJoinInfo:{},
            agree:{},
            snsId:'',
            snsType:'',
            name:'',

        };
    },
    watch: {
        pcs(val) {
            if(this.sendPcsNum) {
                this.sendPcsNum = false;
                this.authNum = '';
            }
        }
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
            this.agree = memberJoinInfo.agreeInfo.agree;
        } else {
            this.$router.back();
        }
        if(location.hostname == 'localhost') {
            this.snsId = '2323';
            this.snsType = 'ka';
        }
        if(!this.snsId) {
            this.$router.back();
        }
    },
    methods: {
        sendPcs() {

            if(!this.pcs) {
                let  params = {
                    message:'휴대폰 번호를 입력하세요'
                }
                this.$eventBus.$emit('modalOpen', params);
                return;
            }

            const frm = new FormData()
            frm.append('pcs',this.pcs)
            this.$eventBus.$emit('overlay', 'open');
            apiService.post(API_URL_SEND_MEMBER_PCS, frm, (res) => {
                this.$eventBus.$emit('overlay', 'hide');
                let params = {};
                if(res.data.result == 'success') {
                    params.message = '휴대폰으로 인증번호를 발송하였습니다'
                    this.setTime(res.data.data);
                } else {
                    params.message = '인증번호 발송에 실패 하였습니다'
                }
                this.$eventBus.$emit('modalOpen', params);
            });
        },
        setTime(time) {
            this.sendPcsNum = true;
            let nowTime = 180;
            let timeInterval = setInterval(()=>{
                nowTime--;
                if(nowTime<1) {
                    this.sendPcsNum = false;
                    this.authNum = '';
                    clearInterval(timeInterval);
                    return;
                }
                let min = nowTime/60;
                let sec = nowTime%60;
                sec = (sec<10)?'0'+sec:sec;
                this.authTime = Math.floor(min)+':'+sec;

            },1000);
        },
        joinMember() {
            this.$v.$touch();
            if(this.nameErrors.length>0) {
                return;
            }

            if(!this.pcs) {
                let  params = {
                    message:'휴대폰 번호를 입력하세요'
                }
                this.$eventBus.$emit('modalOpen', params);
                return;
            }
            if(!this.authNum) {
                let  params = {
                    message:'인증 번호를 입력하세요'
                }
                this.$eventBus.$emit('modalOpen', params);
                return;
            }

            const frm = new FormData()
            frm.append('userId', this.snsId+this.snsType)
            frm.append('snsType',this.snsType)
            frm.append('name', this.name)
            frm.append('pw', this.snsId)
            frm.append('comparePw', this.snsId)
            frm.append('pcs', this.pcs)
            frm.append('authNum', this.authNum)
            let agreeMarket = '';
            if(this.agree.market) {
                frm.append('smsEmail','yes');
                agreeMarket = 'yes';
            } else {
                frm.append('smsEmail','no');
                agreeMarket = 'no';
            }

            this.$eventBus.$emit('overlay', 'open');
            apiService.post(API_URL_INSERT_MEMBER_INFO, frm, (res) => {
                this.$eventBus.$emit('overlay', 'hide');

                let params = {};
                if(res.data.result=='success') {
                    res.data.user.userInfo.snsType = this.snsType;
                    AUTH.setSession(res.data.user);

                    let updateParams = {name:this.name,market:agreeMarket};
                    this.$eventBus.$emit('updateApiMemberInfo',updateParams);
                    params = {
                        message: '회원가입이 완료되었습니다',
                        doAction:()=>{
                            this.$router.push('/');
                        }
                    }
                } else if(res.data.result == 'wrongAuthNum') {
                    params = {
                        message: '잘못된 인증번호 입니다',
                    }

                } else if(res.data.result == 'doubleId') {
                    params = {
                        message: '중복된 아이디 또는 휴대폰 번호 입니다',
                    }

                }
                this.$eventBus.$emit('modalOpen', params);

            });

        }
    }

}
</script>
<style lang="scss" scoped="true">
@import "../../../assets/style/signup5.css";
.btn-register {
    border-radius: 27px;
    background: #ffbb53 !important;
    height: 55px !important;
    position: relative;
    bottom: 0;
    width: 100%;
    font-family: 'Noto Sans' !important;
    font-weight:600  !important;
    font-size:13pt !important;
    color:#fff !important;
    margin-top: 120px;
}
.uid-result {
    margin-top:-25px;
    padding-left:10px;
    font-size:12px;
    margin-bottom:10px;
    &.warn {
        color:#ff1818;
    }
}
</style>