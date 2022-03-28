<template>
    <div class="min-h-screen">
        <div class="wrap flex flex-col justify-between" v-if="steps.one">
            <div class="wrap-input">
                <div class="label-input">가입하신 {{ titleText }} 입력하세요</div>
                <input type="text" v-model="uid" class="email-input" :placeholder="placeHolder"/>
                <div v-if="emailWrong" class="fail-msg">존재하지 않는 이메일 주소입니다</div>
                <v-btn @click="checkEmail()" depressed :disabled="uidDisabled"
                       style="width:100%;height:47px;color:#fff;background: #000"
                       class="button-find">찾기
                </v-btn>
            </div>
            <div v-if="emailAuthSucc">
                <div class="mt-7">
                    <div>
                        <div class="label-input">인증수단 선택</div>
                        <div :class="'option flex flex-row items-center border rounded-md '+emailSelected"
                             @click="setType('email')">
                            <img v-if="!emailSelected" src="../../assets/icons/radio.svg" alt="#"/>
                            <img v-else src="../../assets/icons/radioChecked.svg" alt="#"/>
                            <div class="ml-4">
                                <div class="method-type">이메일 인증</div>
                                <div class="method-content">
                                    {{ viewEmail }}로 인증번호가 전송됩니다.
                                </div>
                            </div>
                        </div>
                        <div :class="'option flex flex-row items-center border rounded-md '+smsSelected"
                             @click="setType('pcs')" v-if="viewPcs">
                            <img v-if="!smsSelected" src="../../assets/icons/radio.svg" alt="#"/>
                            <img v-else src="../../assets/icons/radioChecked.svg" alt="#"/>
                            <div class="ml-4">
                                <div class="method-type">SMS 인증</div>
                                <div class="method-content">
                                    {{ viewPcs }}로 인증번호가 전송됩니다.
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
                <div class="submit-authenticate mt-10" @click="formSubmit()">인증하기</div>
            </div>
        </div>
        <div class="wrap flex flex-col justify-between step2-content"  v-else-if="steps.two">
            <div>
                <div class="wrap-input">
                    <div class="label-input">인증번호를 입력해주세요.</div>
                    <div class="label-input">인증번호는 5분간 유효합니다.</div>
                    <div class="relative">
                        <input
                            v-model="authNum"
                            style="border:solid 1px #ddd;"

                            type="text"
                        class="otp-input"
                        placeholder="인증번호 입력"
                        />
                        <div class="remaining-time">남은시간{{ authTime }}</div>


                    </div>
                    <div class="flex flex-row justify-end">
                        <v-btn @click="formSubmit()" :disabled="authDisabled" style="color:#fff;background: #000;" class="button-resend mt-3">인증번호 재발송</v-btn>
                    </div>
                </div>
            </div>
            <div class="submit-authenticate" @click="sendAuthNumComplete()">인증</div>
        </div>
        <div class="wrap flex flex-col justify-between"   v-else-if="steps.three">
            <div>
                <div class="wrap-input">
                    <div class="label-input">새 비밀번호</div>
                    <div class="sublabel-input">
                        영문 또는 숫자와 특수문자의 조합으로
                    </div>
                    <div class="sublabel-input">6자리 이상 15자리 이하이어야 합니다.</div>
                    <div class="mt-5">
                        <v-text-field
                            outlined
                            required
                            type="password"
                            :error-messages="upassErrors"
                            @input="$v.upass.$touch()"
                            @blur="$v.upass.$touch()"
                            v-model="upass"
                            label="새 비밀번호"
                            placeholder="새 비밀번호를 입력해주세요"
                        />

                        <v-text-field
                            type="password"
                            outlined
                            required
                            :error-messages="reupassErrors"
                            @input="$v.reupass.$touch()"
                            @blur="$v.reupass.$touch()"
                            v-model="reupass"
                            label="새 비밀번호 확인"
                            placeholder="새 비밀번호 확인을 입력해주세요"
                        />
                    </div>
                </div>
            </div>
            <div class="submit-authenticate" @click="passChangeComplete()">변경</div>
        </div>
    </div>

</template>


<script>

import {mapActions} from "vuex";
import AUTH from '../../api/auth'

import {
    API_URL_CHECK_FINDPW_AUTHNUM,
    API_URL_SEND_FIND_PW,
    API_URL_UPDATE_MEMBER_PASSWORD,
    API_URL_GET_MEMBER_EMAIL_WITHINFO
} from '../../api/urls';
import apiService from '../../api/apiService'
import {validationMixin} from 'vuelidate'
import {required,minLength, maxLength} from 'vuelidate/lib/validators'


export default {
    name: 'findPw',
    mixins: [validationMixin],
    validations: {
        upass: {required, minLength: minLength(6), maxLength: maxLength(15)},
        reupass: {required},

    },
    watch: {
        uid(val) {
            if (this.emailWrong) this.emailWrong = false;
            if (val) {
                this.uidDisabled = false;
            } else this.uidDisabled = true;
        }
    },
    computed: {
        upassErrors() {
            const errors = []
            if (!this.$v.upass.$dirty) return errors
            !this.$v.upass.required && errors.push('비밀번호를 입력하세요')
            if (!this.$v.upass.minLength || !this.$v.upass.maxLength) {
                errors.push('비밀번호는 6자 이상 15자 이하로 입력하세요')
            }
            if (this.$v.upass.required && this.$v.upass.minLength && this.$v.upass.maxLength) {
                //let eng = this.upass.search(/[a-z]/ig);
                let spe = this.upass.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi);
                if (spe < 0) {
                    errors.push('비밀번호는 영문 또는 숫자와 특수문자의 조합만 가능합니다')
                    this.upassValid = false;
                } else {
                    this.upassValid = true;
                }

            }

            return errors
        },
        reupassErrors() {
            const errors = []
            if (!this.$v.reupass.$dirty) return errors
            !this.$v.reupass.required && errors.push('비밀번호 확인을 입력하세요')
            if (this.upass != this.reupass) {
                errors.push('비밀번호와 비밀번호 확인이 다릅니다')
                this.reupassValid = false;
            } else {

                this.reupassValid = true;
            }
            return errors
        },
    },
    data() {
        return {
            uid: '',
            upass: '',
            reupass: '',
            findType: 'email',
            uidDisabled: true,
            authDisabled: true,
            emailSelected: 'option-selected',
            smsSelected: '',
            titleText: '이메일을',
            placeHolder: '이메일 주소',
            emailAuthSucc: false,
            emailWrong: false,
            viewPcs: '',
            viewEmail: '',
            steps: {
                one: true,
                two: false,
                three:false,
            },
            authNum:'',
            authTime:'',
            upassValid:false,
            reupassValid:false,

        }
    },
    created() {
        this.setClass('sub')
        this.setTitle('비밀번호 찾기');
        this.setBackUrl('');
        let memberInfo = AUTH.getSession();
        if (memberInfo) {
            this.$router.push({path: '/'});
            return;
        }

    },
    methods: {
        ...mapActions('mobile', ["setClass", "setTitle", "setBackUrl"]),
        setType(type) {
            this.findType = type;
            if (type == 'email') {
                this.emailSelected = 'option-selected'
                this.smsSelected = ''

            } else {
                this.emailSelected = ''
                this.smsSelected = 'option-selected'

            }
        },
        formSubmit() {

            const frm = new FormData()
            frm.append('findType', this.findType)
            frm.append('uid', this.resultUid)
            this.$eventBus.$emit('overlay', 'open');
            apiService.post(API_URL_SEND_FIND_PW, frm, (res) => {
                this.$eventBus.$emit('overlay', 'hide');
                let data = res.data;
                if (data.result == 'success') {
                    this.steps.one = false;
                    this.steps.two = true;
                    if(!this.authDisabled) {
                        let params = {
                            message: '인증번호를 재발송 하였습니다',
                        };
                        this.$eventBus.$emit('modalOpen', params);
                    }
                    this.setTime();
                } else {
                    let params = {
                        message: '인증번호 발송에 실패하였습니다',
                    };
                    this.$eventBus.$emit('modalOpen', params);
                }


            })
        },
        setTime() {
            this.authDisabled = true;
            let nowTime = 300;
            let timeInterval = setInterval(()=>{
                nowTime--;
                if(nowTime<1) {
                    this.authDisabled = false;
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
        checkEmail() {

            const frm = new FormData()
            frm.append('email', this.uid)
            this.$eventBus.$emit('overlay', 'open');
            apiService.post(API_URL_GET_MEMBER_EMAIL_WITHINFO, frm, (res) => {
                this.$eventBus.$emit('overlay', 'hide');
                let data = res.data;
                let params = {}
                if (data.result == 'success') {
                    if (!data.data.id) {
                        this.emailWrong = true;
                        return;
                    }
                    this.resultUid = data.data.id;

                    this.viewPcs = '';
                    this.emailWrong = false;
                    this.emailAuthSucc = true;
                    let viewEmail = data.data.mail
                    this.viewEmail = viewEmail.substring(0, 5) + '*****';
                    if (data.data.pcs) {
                        let viewPcs = data.data.pcs;
                        this.viewPcs = viewPcs.substring(0, 5) + '*****';
                    }

                } else if (data.result == 'wrong') {
                    this.emailWrong = true;
                } else {
                    params = {
                        message: '잘못된 접근입니다',
                    };
                    this.$eventBus.$emit('modalOpen', params);
                }


            })

        },
        sendAuthNumComplete() {
            if(!this.authNum) {
                let params = {
                    message: '인증번호를 입력하세요',
                };
                this.$eventBus.$emit('modalOpen', params);
                return;
            }
            const frm = new FormData()
            frm.append('uid', this.resultUid)
            frm.append('authNum', this.authNum)
            this.$eventBus.$emit('overlay', 'open');
            apiService.post(API_URL_CHECK_FINDPW_AUTHNUM, frm, (res) => {
                this.$eventBus.$emit('overlay', 'hide');
                let data = res.data;
                let params = {}
                if (data.result == 'success') {

                    this.steps.two = false;
                    this.steps.three = true;
                } else if (data.result == 'wrongAuthNum') {
                    this.authDisabled = false;
                    this.authNum = '';
                    params = {
                        message: '잘못된 인증번호 입니다',
                    };
                    this.$eventBus.$emit('modalOpen', params);
                } else {
                    params = {
                        message: '잘못된 접근입니다',
                    };
                    this.$eventBus.$emit('modalOpen', params);
                }


            })
        },
        passChangeComplete() {
            this.$v.$touch()
            if(this.reupassValid && this.upassValid) {
                const frm = new FormData()
                frm.append('uid', this.resultUid)
                frm.append('upass', this.upass)
                this.$eventBus.$emit('overlay', 'open');
                apiService.post(API_URL_UPDATE_MEMBER_PASSWORD, frm, (res) => {
                    this.$eventBus.$emit('overlay', 'hide');
                    let data = res.data;
                    let params = {}
                    if (data.result == 'success') {
                        params = {
                            message: '비밀번호 변경에 성공하였습니다',
                            doAction:()=> {
                                this.$router.back();
                            }
                        };

                    } else {
                        params = {
                            message: '잘못된 접근입니다',
                        };

                    }
                    this.$eventBus.$emit('modalOpen', params);
                });

            }
        }
    }

}
</script>

<style lang="scss" scoped>

@import "../../assets/style/forgot_pw_1.css";

.fail-msg {
    color: #ff1818;
    font-size: 12px;
    padding-top: 5px;
}

.step2-content {
    .label-input {
        font-size: 18px;
        font-weight: 500;
        line-height: 27px;
    }

    .otp-input {
        margin-top: 16px;
        padding: 12px;
        width: 100%;
        border: 1px solid #ddd;
        border-radius: 5px;
        font-size: 15px;
    }

    .remaining-time {
        position: absolute;
        top: 32px;
        right: 14px;
        font-size: 13px;
        color: #ff1414;
    }
}
</style>