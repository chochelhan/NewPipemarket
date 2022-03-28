<template>
    <div class="login-page-containter">

            <div class="wrap-login-section">
                <div class="flex flex-row justify-end">
                    <img @click="goBack()" class="iconClose" src="../../assets/images/close@3x.png"/>
                </div>
                <p class="login-title">로그인</p>
                <form novalidate @submit.prevent="validate">
                    <div class="w-full">
                        <v-text-field style="border-radius:5px;"
                                      v-model="uid"
                                      :error-messages="uidErrors"
                                      outlined
                                      label="이메일"
                                      @input="$v.uid.$touch()"
                                      @blur="$v.uid.$touch()"
                                      placeholder="이메일을 입력해주세요"/>
                        <v-text-field type="password" style="border-radius:5px;"
                                      outlined
                                      label="비밀번호"
                                      :error-messages="upassErrors"
                                      @input="$v.upass.$touch()"
                                      @blur="$v.upass.$touch()"
                                      v-model="upass"
                                      placeholder="비밀번호를 입력해주세요"/>
                    </div>
                    <div class="w-full flex flex-row wrap-checkbox justify-between my-1 px-2"
                         style="margin-top:-20px;padding-bottom:15px;">
                        <div class="flex flex-row items-center">
                            <div>
                                <label class="inline-flex items-center" @click="setAutoLogin()">
                                    <div v-if="!autoLoginClass"
                                         style="width: 17px;height: 17px;border: 1.5px #b5b5b5 solid;border-radius: 3px;">

                                    </div>
                                    <img
                                        v-else
                                        src="../../assets/icons/check-box-on.svg"
                                        alt=""
                                    />
                                    <span class="ml-2 font-extralight" style="color: #777">자동 로그인</span>
                                </label>
                            </div>
                            <div style="padding-left:10px;">
                                <label class="inline-flex items-center" @click="setIdSave()">
                                    <div v-if="!idSave"
                                         style="width: 17px;height: 17px;border: 1.5px #b5b5b5 solid;border-radius: 3px;">

                                    </div>
                                    <img
                                        v-else
                                        src="../../assets/icons/check-box-on.svg"
                                        alt=""
                                    />
                                    <span class="ml-2 font-extralight" style="color: #777">아이디 저장</span>
                                </label>
                            </div>
                        </div>
                        <div class="forgot-password" @click="findPw()">비밀번호 찾기</div>
                    </div>

                    <v-btn type="submit" style="background: #000;color:#fff;height:47px;border-radius: 5px;"
                           class="w-full">
                        로그인
                    </v-btn>
                </form>

                <div class="signup-text text-basic">간편 로그인 및 회원가입</div>

                <div class="w-full flex flex-row wrap-social justify-between">
                    <div class="flex flex-col items-center" @click="snsJoin('ka')">
                        <img class="social-icon" src="../../assets/images/kakao.png"/>
                        <div>카카오톡으로 시작</div>
                    </div>
                    <div class="flex flex-col items-center" @click="snsJoin('nv')">
                        <img class="social-icon" src="../../assets/images/naver.png"/>
                        <div>네이버로 시작</div>
                    </div>
                    <div class="flex flex-col items-center" @click="snsJoin('fb')">
                        <img class="social-icon" src="../../assets/images/Facebook.png"/>
                        <div>페이스북으로 시작</div>
                    </div>
                </div>
            </div>

            <div
                class="w-full guest-section flex flex-col items-center justify-center"
            >
                <div class="guest-title">피리마켓이 처음이신가요?</div>
                <div style="text-align: center;">회원가입하고 플러스친구 추가하면 5000원 쿠폰 지급!</div>
                <v-btn class="join-as-member text-white" style="background: #ffbb53;color:#fff;height:42px;" rounded
                       depressed type="button" @click="goPage('/vmember/join')">
                    회원가입
                </v-btn>
            </div>

            <div class="w-full guest-form">
                <div class="guest-form-title">비회원 주문조회</div>
                <input
                    class="border w-full rounded input-order"
                    style="border:solid 1px #ddd;"
                    type="text"
                    v-model="nomemberOid"
                    placeholder="주문번호"
                />

                <v-btn @click="goNomemberOrder()" depressed :disabled="nomemberDisabled"
                       style="background:#000;color:#fff;height:47px;border-radius: 5px;" class="submit-form w-full"
                       type="button">주문조회
                </v-btn>
            </div>

        </div>
</template>


<script>

import {mapActions} from "vuex";
import AUTH from '../../api/auth'
import {validationMixin} from 'vuelidate'
import {required} from 'vuelidate/lib/validators'
import JQ from 'jquery'
import {
    API_URL_INTRO_MEMBER_LOGIN,
    API_URL_MEMBER_LOGIN,
    API_URL_CHECK_NOMEMBER_OID
} from '../../api/urls';
import apiService from '../../api/apiService'

export default {
    mixins: [validationMixin],
    validations: {
        uid: {required},
        upass: {required},
    },
    name: 'Login',
    computed: {
        uidErrors() {
            const errors = []
            if (!this.$v.uid.$dirty) return errors
            !this.$v.uid.required && errors.push('이메일을 입력하세요')
            return errors;
        },
        upassErrors() {
            const errors = []
            if (!this.$v.upass.$dirty) return errors
            !this.$v.upass.required && errors.push('비밀번호를 입력하세요')
            return errors;
        }
    },
    watch: {
        nomemberOid(val) {
            if (val) this.nomemberDisabled = false;
            else this.nomemberDisabled = true;
        }
    },
    data() {
        return {
            uid: '',
            upass: '',
            nomemberOid: '',
            autoLogin: '',
            autoLoginClass: '',
            message: '',
            modalShow: false,
            findPwShow: false,
            nomemberDisabled: true,
            idSave: false,
            snsLogin: {},

        }
    },
    created() {
        this.setClass('none')
        this.setTitle('');
        this.setBackUrl('');
        let memberInfo = AUTH.getSession();
        if (memberInfo) {
            this.$router.push({path: '/'});
            return;
        }
        localStorage.setItem('snsInfo','');
        this.$eventBus.$on('returnSnsInfo', this.returnSnsData);
        this.idSave = (localStorage.getItem('idSave')) ? true : false;
        if (this.idSave && localStorage.getItem('saveUserId')) {
            this.uid = localStorage.getItem('saveUserId');
        }
        this.autoLogin = (localStorage.getItem('autoLogin') == 'yes') ? 'yes' : 'no';
        if (this.autoLogin == 'yes') {
            this.autoLoginClass = 'active';
        }

        this.getData();

    },
    methods: {
        ...mapActions('mobile', ["setClass", "setTitle", "setBackUrl"]),
        ...mapActions('member', ["setUsercode"]),
        getData() {
            const frm = {}
            apiService.get(API_URL_INTRO_MEMBER_LOGIN, frm, (res) => {
                this.snsLogin = res.data;

            })
        },
        validate() {
            this.formSubmit();

        },
        setIdSave() {
            if (this.idSave) this.idSave = false;
            else this.idSave = true;
            localStorage.setItem('idSave', this.idSave)
        },
        setAutoLogin() {
            if (this.autoLogin == 'yes') {
                this.autoLoginClass = '';
                this.autoLogin = 'no';
            } else {
                this.autoLoginClass = 'active';
                this.autoLogin = 'yes';
            }
            localStorage.setItem('autoLogin', this.autoLogin)
        },
        goBack() {
            this.$router.back();
        },
        findPw() {
            this.$router.push('/vmember/findpw')
        },
        goPage(url) {
            this.$router.push(url)
        },
        formSubmit() {
            this.$v.$touch();
            if (!this.$v.$anyError) {
                const frm = new FormData()
                frm.append('userId', this.uid)
                frm.append('userPw', this.upass)
                this.$eventBus.$emit('overlay', 'open');
                apiService.post(API_URL_MEMBER_LOGIN, frm, (res) => {
                    this.$eventBus.$emit('overlay', 'hide');
                    let data = res.data;
                    let params = {}
                    if (data.result == 'success') {
                        AUTH.autoLogin = (localStorage.getItem('autoLogin') == 'yes') ? true : false;
                        localStorage.setItem('saveUserId', this.uid);
                        AUTH.setSession(data.info);
                        params = {
                            message: '로그인 되었습니다',
                            doAction: () => {
                                this.$router.push("/");
                            }
                        };

                    } else {
                        params = {
                            message: '잘못된 아이디 또는 비밀번호입니다',
                        };

                    }
                    this.$eventBus.$emit('modalOpen', params);

                })
            }
        },
        goNomemberOrder() {

            const frm = new FormData()
            frm.append('nomemberOid', this.nomemberOid)
            this.$eventBus.$emit('overlay', 'open');
            apiService.post(API_URL_CHECK_NOMEMBER_OID, frm, (res) => {
                this.$eventBus.$emit('overlay', 'hide');
                let data = res.data;
                let params = {}
                if (data.result == 'succ') {
                    this.$router.push('/vmypage/nomemberOrder/' + data.oid);
                } else {
                    params = {
                        message: '잘못된 주문번호입니다',
                    };
                    this.$eventBus.$emit('modalOpen', params);
                }
            })
        },
        snsJoin(cmd) {
            let url = '';

            switch (cmd) {
                case 'ka':
                    url = this.snsLogin.kakao_login
                    break;
                case 'nv':
                    url = this.snsLogin.naver_login
                    break;
                case 'fb':
                    url = this.snsLogin.facebook_login
                    break;
            }
            window.open(url, 'snsWin', 'width=400,height=500');
        },
        returnSnsData(params) {
            if (params.moveType == 'join') {
                let data = {
                    id: params.response.id,
                    type: params.snsType,
                }
                localStorage.setItem('snsInfo', JSON.stringify(data));
                this.$router.push('/vmember/join/agree');
            } else if (params.moveType == 'login') {
                if (params.userData) {
                    this.snsLoginInfo(params.userData,params.snsType);
                }
            }

        },
        snsLoginInfo(data,snsType) {
            AUTH.autoLogin = (localStorage.getItem('autoLogin') == 'yes') ? true : false;
            data.userInfo.snsType = snsType;
            AUTH.setSession(data);
            let params = {
                message: '로그인 되었습니다',
                doAction: () => {
                    this.$router.push("/");
                }
            };
            this.$eventBus.$emit('modalOpen', params);
        }
    },
    destroyed() {
        this.$eventBus.$off('returnSnsInfo');
    }

}
</script>

<style lang="scss" scoped>
.login-page-containter {
    padding:60px 0;
    background:#fff;
    .iconClose {
        width: 15px;
        height: 15px;
        margin-right: 10px;
    }

    .wrap-login-section {
        padding-left: 15px;
        padding-right: 15px;
    }

    .login-title {
        text-align: center;
        font-size: 20px;
        font-weight: 600;
        margin-bottom: 19px;
    }

    input {
        height: 47px;
        padding-left: 13px;
    }

    .input-name {
        margin-bottom: 11px;
    }

    .checkbox-one {
        margin-right: 20px;
    }

    .forgot-password {
        color: #545454;
        font-weight: 300;
    }

    .wrap-checkbox span {
        font-size: 14px;
    }

    .submit {
        background-color: black;
        border-radius: 5px;
        height: 47px;
        color: #fff;
    }

    .signup-text {
        text-align: center;
        font-size: 16px;
        margin-top: 40px;
        margin-bottom: 22px;
        font-weight: 200;
    }

    .social-icon {
        width: 45px;
        height: 45px;
        border-radius: 50%;
        margin-bottom: 10px;
    }

    .wrap-social {
        font-size: 13px;
        color: #413725;
    }

    .guest-section {
        margin: 44px 0;
        background-color: #fff4dd;
        padding: 43px 5px;
    }

    .guest-title {
        font-size: 20px;
        font-weight: 600;
    }

    .join-as-member {
        background-color: #ffbb53;
        width: 130px;
        height: 42px;
        border-radius: 23px;
        margin-top: 15px;
    }

    .guest-form {
        padding: 0 21px;
    }

    .guest-form-title {
        font-size: 16px;
    }

    .input-order {
        margin: 12px 0;
    }

    .submit-form {
        background-color: #eee;
        color: #999;
        border-radius: 5px;
        height: 47px;
    }


    #testFrame {
        width: calc(100vw);
        height: 400px;
        position: fixed;
        top: 300px;
        background: #fff;
        left: 0;
        z-index: 1001;
    }
}
</style>