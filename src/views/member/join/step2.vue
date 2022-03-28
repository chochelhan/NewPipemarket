<template>
    <div class="container wrap subpage">
        <div>
            <p class="signup-text-guide">로그인에 사용할<br>비밀번호를 입력해주세요</p>
            <v-text-field
                outlined
                required
                type="password"
                :error-messages="upassErrors"
                @input="$v.upass.$touch()"
                @blur="$v.upass.$touch()"
                v-model="upass"
                label="비밀번호"
                placeholder="비밀번호를 입력해주세요"
            />

            <v-text-field
                type="password"
                outlined
                required
                :error-messages="reupassErrors"
                @input="$v.reupass.$touch()"
                @blur="$v.reupass.$touch()"
                v-model="reupass"
                label="비밀번호 확인"
                placeholder="비밀번호 확인을 입력해주세요"
            />
        </div>
        <v-btn depressed class="btn-register text-white" @click="next()">다음</v-btn>
        <p>- 영문 또는 숫자와 특수문자의 조합</p>
        <p style="margin-top:-12px">- 6자리 이상 15자리 이하</p>
    </div>
</template>

<script>

import {validationMixin} from 'vuelidate'
import {required,minLength, maxLength} from 'vuelidate/lib/validators'

export default {
    mixins: [validationMixin],
    validations: {
        upass: {required, minLength: minLength(6), maxLength: maxLength(15)},
        reupass: {required},

    },
    data() {
        return {
            reupass:'',
            upass:'',
            upassValid:false,
            reupassValid:false,
            memberJoinInfo:{},
        };
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
    created() {
        let memberJoinInfo = sessionStorage.getItem('memberJoinInfo');
        if(memberJoinInfo) {
            memberJoinInfo = JSON.parse(memberJoinInfo);
            this.memberJoinInfo = memberJoinInfo;
            if(this.memberJoinInfo.dataInfo.uid) {
                this.upass = this.memberJoinInfo.dataInfo.upass;
                this.reupass = this.upass;
                this.reupassValid = true;
                this.upassValid = true;
            }
        } else {
            this.$router.back();
        }
    },
    methods: {
        next() {
            this.$v.$touch()
            if(this.reupassValid && this.upassValid) {
                this.memberJoinInfo.dataInfo.upass = this.upass;
                sessionStorage.setItem('memberJoinInfo',JSON.stringify(this.memberJoinInfo));
                this.$router.push('/vmember/join/step3')
            }
        }
    },
    mounted() {

    },

}
</script>
<style lang="scss" scoped="true">
@import "../../../assets/style/signup3.css";

.btn-register {
    background: #000000 !important;

}
</style>