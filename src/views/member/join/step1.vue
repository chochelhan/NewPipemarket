<template>
    <div class="wrap subpage">
        <div>
            <p class="signup-text-guide">정보를 입력해주세요</p>
            <v-text-field
                outlined
                required
                :error-messages="uidErrors"
                @input="$v.uid.$touch()"
                @blur="$v.uid.$touch()"
                v-model="uid"
                label="아이디(이메일)"
                placeholder="이메일을 입력해주세요"
            />
            <div style="padding:10px 0 30px 0;">
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
                <div style="margin-top:-7px;">- 영문 또는 숫자와 특수문자의 조합</div>
                <div>- 6자리 이상 15자리 이하</div>
            </div>

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
        </div>
        <v-btn  depressed rounded class="btn-register text-white text-base" @click="next()">다음</v-btn>
    </div>
</template>

<script>

import {validationMixin} from 'vuelidate'
import {required, email, minLength, maxLength} from 'vuelidate/lib/validators'
import {API_URL_CHECK_MEMBER_UID} from "../../../api/urls";
import apiService from "../../../api/apiService";

export default {
    name:"memberStep1",
    mixins: [validationMixin],
    validations: {
        uid: {required, email},
        upass: {required, minLength: minLength(6), maxLength: maxLength(15)},
        reupass: {required},
        name: {required,maxLength: maxLength(8)},
    },
    data() {
        return {
            uid:'',
            name:'',
            succUid:false,
            uidResultMessage:'',
            uidResult:false,
            uidResultClass:'',
            reupass:'',
            upass:'',
            upassValid:false,
            reupassValid:false,
            memberJoinInfo:{}
        };
    },
    created() {
        let memberJoinInfo = sessionStorage.getItem('memberJoinInfo');
        if(memberJoinInfo) {
            memberJoinInfo = JSON.parse(memberJoinInfo);
            this.memberJoinInfo = memberJoinInfo;
            if(this.memberJoinInfo.dataInfo.uid) {
                this.uid = this.memberJoinInfo.dataInfo.uid;
                this.succUid = true;
                this.uidResult = true;
                this.upass = this.memberJoinInfo.dataInfo.upass;
                this.reupass = this.upass;
                this.reupassValid = true;
                this.upassValid = true;
                this.name = this.memberJoinInfo.dataInfo.name;

            }
        } else {
            this.$router.back();
        }
    },
    computed: {
        uidErrors() {
            const errors = []

            if (!this.$v.uid.$dirty) return errors
            this.uidResult = false;
            this.uidResultClass = '';
            !this.$v.uid.required && errors.push('아이디(이메일)를 입력하세요')
            !this.$v.uid.email && errors.push('잘못된 이메일입니다')
            if (this.$v.uid.required && this.$v.uid.email) {
                this.uidResult = true;
                this.succUid = true;
            } else {
                this.succUid = false;
            }
            return errors
        },
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
    methods: {
        next() {
            this.$v.$touch()
            if(this.nameErrors.length>0) {
                return;
            }
            if(this.succUid && this.reupassValid && this.upassValid && this.name) {
                this.memberJoinInfo.dataInfo.uid = this.uid;
                this.memberJoinInfo.dataInfo.upass = this.upass;
                this.memberJoinInfo.dataInfo.name = this.name;
                sessionStorage.setItem('memberJoinInfo',JSON.stringify(this.memberJoinInfo));
                this.$router.push('/vmember/join/step2')
            }
        }
    },
    mounted() {

    },

}
</script>
<style lang="scss" scoped="true">
@import "../../../assets/style/signup2.css";
.btn-register {
    background: #000000 !important;
    width:calc(100vw - 40px);
    position: relative;
    margin-top:40px;

}
.uid-result {
    margin-top:-25px;
    padding-left:10px;
    font-size:12px;

    &.warn {
     color:#ff1818;
    }
}
</style>