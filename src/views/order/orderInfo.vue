<template>
    <div class="order-sub-contents">
        <form novalidate @submit.prevent="validate">
        <div style="margin-bottom:10px; background-color: #eeeeee">
            <div class="bg-white px-5 py-8">
                <div class="flex justify-between items-center">
                    <p class="font-semibold text-22">
                        주문자의 기본 정보를<br />
                        입력해주세요.
                    </p>
                </div>
                <div>
                    <p class="mt-2 mb-2 text-15">주문자명</p>
                    <v-text-field
                        outlined
                        required
                        :error-messages="orderNameErrors"
                        @input="$v.orderName.$touch()"
                        @blur="$v.orderName.$touch()"
                        v-model="orderName"
                        placeholder="주문자명을 입력해주세요"
                    />
                    <p class="mt-1 mb-2 text-15">휴대폰 번호</p>
                    <v-text-field
                        outlined
                        required
                        :error-messages="orderPcsErrors"
                        @input="$v.orderPcs.$touch()"
                        @blur="$v.orderPcs.$touch()"
                        v-model="orderPcs"
                        placeholder="휴대폰 번호를 입력해주세요"
                    />
                    <p class="mt-1 mb-2 text-15">이메일 주소(선택)</p>
                    <v-text-field
                        outlined
                        required
                        :error-messages="orderEmailErrors"
                        @input="$v.orderEmail.$touch()"
                        @blur="$v.orderEmail.$touch()"
                        v-model="orderEmail"
                        placeholder="이메일주소를 입력해주세요"
                    />
                </div>
            </div>
            <div class="bg-white px-3 w-full" style="padding-top:80px;">
                <v-btn type="submit" depressed rounded color="#ffbb53" style="color:#fff;height:55px;width:100%;">
                    작성완료
                </v-btn>
            </div>
        </div>
        </form>
    </div>
</template>
<script>

import {validationMixin} from 'vuelidate'
import {email, required,numeric} from 'vuelidate/lib/validators'
import AUTH from '../../api/auth'

export default {
    mixins: [validationMixin],
    validations: {
        orderName:{required},
        orderPcs:{required,numeric},
        orderEmail:{email}
    },
    computed: {
        orderEmailErrors() {
            const errors = []
            if (!this.$v.orderEmail.$dirty) return errors
            !this.$v.orderEmail.email && errors.push('잘못된 형식의 이메일입니다')
            return errors
        },
        orderNameErrors() {
            const errors = []
            if (!this.$v.orderName.$dirty) return errors
            !this.$v.orderName.required && errors.push('주문자명을 입력하세요')
            return errors
        },
        orderPcsErrors() {
            const errors = []
            if (!this.$v.orderPcs.$dirty) return errors
            !this.$v.orderPcs.required && errors.push('휴대폰 번호를 입력하세요')
            !this.$v.orderPcs.numeric && errors.push('휴대폰 번호는 숫자만 입력가능합니다')
            if(this.$v.orderPcs.$model.length!=11) {
                errors.push('휴대폰 번호를 확인하세요')
            } else {
                if(this.$v.orderPcs.$model.substring(0,3) != '010') {
                    errors.push('휴대폰 번호를 확인하세요')
                }
            }
            return errors
        }
    },
    data() {
        return {
            orderName:'',
            orderPcs:'',
            orderEmail:'',
        };
    },
    created() {
        let memberInfo = AUTH.getSession();
        if(sessionStorage.getItem('orderInfo')) {
            let member = JSON.parse(sessionStorage.getItem('orderInfo'));
            this.orderName = member.name;
            this.orderPcs = member.pcs;
            this.orderEmail = member.email;

        } else {
            if (memberInfo) {
                const emails = memberInfo.mail.split('@');
                let email = memberInfo.email;
                if(emails[1]=='anonymous.com') {
                    email = '';
                }
                this.orderName = memberInfo.name;
                this.orderPcs = memberInfo.pcs;
                this.orderEmail = email;
            }
        }

    },
    methods: {
        validate() {
            this.$v.$touch();
            if(this.orderPcsErrors.length>0) {
                return;
            }
            if (!this.$v.$anyError) {

                let orderInfo = {
                    name: this.orderName,
                    pcs: this.orderPcs,
                    email: this.orderEmail
                }
                sessionStorage.setItem('orderInfo',JSON.stringify(orderInfo));
                this.$router.back();
            }
        }

    },

}
</script>

<style lang="scss" scoped>
.order-sub-contents {
    width:calc(100vw);
    background:#fff;

}
</style>