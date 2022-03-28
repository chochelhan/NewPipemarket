<template>
    <div class="page-contents">
        <div ref="wrap" id="daumFrame">
            <img src="//t1.daumcdn.net/postcode/resource/images/close.png" id="btnFoldWrap" style="cursor:pointer;position:absolute;right:0px;top:-1px;z-index:1" @click="foldDaumPostcode" alt="접기 버튼">
        </div>
        <form novalidate @submit.prevent="validate">
        <div style="margin-bottom: 30px;">
            <div class="bg-white px-5 py-8">
                <div class="flex justify-between items-center">
                    <p class="font-semibold text-22">
                       신규 배송 정보를<br />
                        등록해주세요.
                    </p>
                </div>
                <div>
                    <div class="flex items-center mt-4 justify-end" v-if="orderEquals!='not'">
                        <img v-if="equalCheck" src="../../assets/icons/check-box-on.svg" alt="" @click="equalUserCheck()" />
                        <img v-else src="../../assets/icons/check-box-off.svg" alt="" @click="equalUserCheck()" />
                        <div class="ml-2 text-sm" style="padding-top:0px;" @click="equalUserCheck()">주문자와 동일</div>
                    </div>
                    <p class="mt-1 mb-2 text-15">주소 별칭</p>
                    <v-text-field
                        outlined
                        required
                        :error-messages="addrNameErrors"
                        @input="$v.addrName.$touch()"
                        @blur="$v.addrName.$touch()"
                        v-model="addrName"
                        placeholder="주소별칭을 입력해주세요"
                    />
                    <p class="mt-1 mb-2 text-15">받는분</p>
                    <v-text-field
                        outlined
                        required
                        :error-messages="receNameErrors"
                        @input="$v.receName.$touch()"
                        @blur="$v.receName.$touch()"
                        v-model="receName"
                        placeholder="받는분을 입력해주세요"
                    />
                    <p class="mt-1 mb-2 text-15">휴대폰 번호</p>
                    <v-text-field
                        outlined
                        required
                        :error-messages="recePcsErrors"
                        @input="$v.recePcs.$touch()"
                        @blur="$v.recePcs.$touch()"
                        v-model="recePcs"
                        placeholder="휴대폰번호를 입력해주세요"
                    />
                    <p class="mt-1 mb-2 text-15">배송 주소</p>
                    <div class="flex">
                        <v-text-field
                            outlined
                            required
                            :error-messages="postNumErrors"
                            v-model="postNum"
                            readonly
                            placeholder=""
                        />
                        <p class="py-3
                px-4
                text-13
                border
                rounded-md
                whitespace-nowrap
                font-semibold" style="margin-left:10px;color: #8097e6; border-color: #8097e6;max-height:57px;line-height:30px;" @click="openDaumPostcode()">
                            우편번호
                        </p>
                    </div>
                    <div class="flex items-center">
                        <v-text-field
                            outlined
                            v-model="addr1"
                            readonly
                            placeholder="주소를 입력해주세요"
                        />
                    </div>

                    <div class="flex items-center">
                        <v-text-field
                            outlined
                            required
                            :error-messages="addr2Errors"
                            @input="$v.addr2.$touch()"
                            @blur="$v.addr2.$touch()"
                            v-model="addr2"
                            placeholder="상세주소를 입력해주세요"
                        />
                    </div>
                </div>
            </div>
            <div class="py-2 px-3 w-full">
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
import {email, required} from 'vuelidate/lib/validators'
import AUTH from '../../api/auth'
import {
    API_URL_UPDATE_SHIPPING_ADDRESS
} from '../../api/urls';
import apiService from '../../api/apiService'

export default {
    mixins: [validationMixin],
    validations: {
        postNum:{required},
        addrName:{required},
        receName:{required},
        recePcs:{required},
        addr2:{required},

    },
    computed: {
        addrNameErrors() {
            const errors = []
            if (!this.$v.addrName.$dirty) return errors
            !this.$v.addrName.required && errors.push('주소별칭을 입력하세요')
            return errors
        },
        postNumErrors() {
            const errors = []
            if (!this.$v.postNum.$dirty) return errors
            !this.$v.postNum.required && errors.push('우편번호를 입력하세요')
            return errors
        },
        receNameErrors() {
            const errors = []
            if (!this.$v.receName.$dirty) return errors
            !this.$v.receName.required && errors.push('받는분을 입력하세요')
            return errors
        },
        recePcsErrors() {
            const errors = []
            if (!this.$v.recePcs.$dirty) return errors
            !this.$v.recePcs.required && errors.push('휴대폰 번호를 입력하세요')
            return errors
        },
        addr2Errors() {
            const errors = []
            if (!this.$v.addr2.$dirty) return errors
            !this.$v.addr2.required && errors.push('상세주소를 입력하세요')
            return errors
        }
    },
    props:["orderEquals"],
    data() {
        return {
            isLogin: false,
            postNum:'',
            addrName:'',
            receName:'',
            recePcs:'',
            addr1:'',
            addr2:'',
            equalCheck:false,
        };
    },
    created() {
       let memberInfo = AUTH.getSession();
        if(!memberInfo) {
            this.$router.back();
            return;
        }
    },
    methods: {
        validate() {
            this.$v.$touch();
            if (!this.$v.$anyError) {

                const frm = new FormData();
                frm.append('shipping_name',this.addrName);
                frm.append('recipient',this.receName);
                frm.append('pcs',this.recePcs);
                frm.append('zipcode',this.postNum);
                frm.append('address1',this.addr1);
                frm.append( 'address2',this.addr2);
                frm.append( 'mode','insert');
                this.$eventBus.$emit('overlay', 'open');
                apiService.post(API_URL_UPDATE_SHIPPING_ADDRESS, frm, (res) => {
                    this.$eventBus.$emit('overlay', 'hide');
                    if (res.data.result == 'success') {
                        if(res.data.data.default_yn=='Y')sessionStorage.setItem('shippingInfo',JSON.stringify(res.data.data));
                        let params = {
                            message: '주소정보를 저장하였습니다',
                            doAction: () => {
                                this.$router.go(-2);
                            }
                        };

                        this.$eventBus.$emit('modalOpen', params);

                    }
                });

            }
        },
        equalUserCheck() {
            if(this.equalCheck) {
                this.equalCheck = false;
                this.receName = '';
                this.recePcs ='';

            }  else {
                this.equalCheck = true;
                if(sessionStorage.getItem('equalMemberInfo')) {
                    const m = JSON.parse(sessionStorage.getItem('equalMemberInfo'));
                    this.receName = m.name;
                    this.recePcs = m.pcs;
                }

            }
        },
        openDaumPostcode() {
            const elementWrap = this.$refs.wrap
            // 현재 scroll 위치를 저장해놓는다.
            const currentScroll = Math.max(document.body.scrollTop, document.documentElement.scrollTop)
            new window.daum.Postcode({
                oncomplete: (data) => {
                    // 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.
                    console.log(data);
                    // 각 주소의 노출 규칙에 따라 주소를 조합한다.
                    // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
                    let addr = '' // 주소 변수

                    // 사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
                    if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
                        addr = data.roadAddress
                    } else { // 사용자가 지번 주소를 선택했을 경우(J)
                        addr = data.jibunAddress
                    }
                    this.postNum = data.zonecode;
                    // 우편번호와 주소 정보를 해당 필드에 넣는다.
                    // document.getElementById('address').value = addr
                    this.addr1 = addr

                    // iframe을 넣은 element를 안보이게 한다.
                    // (autoClose:false 기능을 이용한다면, 아래 코드를 제거해야 화면에서 사라지지 않는다.)
                    elementWrap.style.display = 'none'

                    // 우편번호 찾기 화면이 보이기 이전으로 scroll 위치를 되돌린다.
                    document.body.scrollTop = currentScroll
                },
                // 우편번호 찾기 화면 크기가 조정되었을때 실행할 코드를 작성하는 부분. iframe을 넣은 element의 높이값을 조정한다.
                onresize: function (size) {
                   // elementWrap.style.height = size.height + 'px'
                },
                width: '100%',
                height: '100%'
            }).embed(elementWrap)
            elementWrap.style.display = 'block'
        },
        foldDaumPostcode () {
            const elementWrap = this.$refs.wrap
            elementWrap.style.display = 'none'
        }

    }

}
</script>

<style lang="scss" scoped>

#daumFrame {
    background:#fff;
    display:none;
    border:2px solid #000;
    width:calc(100vw);
    height:calc(100vh - 95px);
    overflow:auto;
    padding:0;
    position:fixed;
    top:95px;
    z-index:10;

}
@media only all and (min-width: 500px) {

    #daumFrame {
        max-width:500px;
        width:500px;
        top:65px;

    }
}
</style>