<template>
    <div class="page-contents">

            <div class="px-5 py-13" v-if="device=='web' && !snsType">
                <div class="text-lg mb-2 font-semibold">비밀번호</div>
                <div class="font-bloack">
                    영문 또는 숫자와 특수문자의 조합
                    <br>
                    6자리 이상 15자리 이하
                </div>
                <div style="height:20px;"></div>
                <!--div class="text-xs mt-1">(특수문자는 !@#$%^&amp;*만 가능)</div-->
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
                <v-text-field
                    type="password"
                    outlined
                    required
                    :error-messages="nowupassErrors"
                    @input="$v.nowupass.$touch()"
                    @blur="$v.nowupass.$touch()"
                    v-model="nowupass"
                    label="현재 비밀번호"
                    placeholder="현재 비밀번호를 입력해주세요"
                />
                <v-btn depressed
                       @click="validatePass()"
                       :disabled="passDisabled"
                       style="border-radius:5px;background-color:#000;color:#fff;font-size:15px;width:100%;height:50px;margin:auto !important;"
                       type="button">비밀번호 변경
                </v-btn>
            </div>
            <div :class="'px-5 '+deviceClass">
                <div v-if="device=='web'">
                    <div class="text-lg mb-2 font-semibold">기본정보</div>
                    <div style="height:20px;"></div>
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
                <div style="margin-bottom:20px;">- 최대 8자까지 가능</div>

                <v-text-field v-if="snsType"
                              outlined
                              :error-messages="emailErrors"
                              @input="$v.email.$touch()"
                              @blur="$v.email.$touch()"
                              v-model="email"
                              label="이메일"
                              placeholder="이메일을 입력해주세요"
                />
                <div class="relative">
                    <v-text-field
                        outlined
                        :error-messages="pcsErrors"
                        @input="$v.pcs.$touch()"
                        @blur="$v.pcs.$touch()"
                        v-model="pcs"
                        label="휴대폰 번호"
                        placeholder="휴대폰 번호를 입력해주세요"
                    />

                    <div
                        @click="sendSms()"
                        class="text-13 absolute right-4"
                        style="color: #8097e6;top:20px;"
                        v-if="pcsComplete.send"
                    >
                        인증번호 받기
                    </div>
                    <div
                        @click="sendSms()"
                        class="text-13 absolute right-4 "
                        style="color: #8097e6;top:20px;"
                        v-else-if="pcsComplete.resend"
                    >
                        재전송
                    </div>
                </div>
                <div class="flex" v-if="authnumSend" style="margin-top:-1px">
                    <v-text-field
                        outlined
                        :error-messages="authnumErrors"
                        @input="$v.authnum.$touch()"
                        @blur="$v.authnum.$touch()"
                        :suffix="authTime"
                        v-model="authnum"/>

                    <div v-if="authnumComplete" class="flex justify-center items-center ml-3"
                         style="width: 117px;color: #5bc57d;margin-top:-30px;">
                        <img src="../../assets/icons/check-box-circle-green.svg" alt=""/>
                        <div class="text-13 ml-2">인증완료</div>
                    </div>
                    <v-btn v-else outlined depressed @click="authnumValidate()"
                           style="width:117px; color: #8097e6; border-color: #8097e6;height:55px;margin-left:10px;">
                        인증하기
                    </v-btn>

                </div>
                <v-btn depressed v-if="device=='web'"
                       @click="validateNamePcs()"
                       :disabled="disabled"
                       style="border-radius:5px;background-color:#000;color:#fff;font-size:15px;width:100%;height:50px;margin:auto !important;"
                       type="button">회원정보 변경
                </v-btn>
            </div>
            <div class="px-5"  v-if="device=='web'">
                <p class="text-lg mt-14 mb-4 font-semibold">강아지 추가 및 정보</p>
                <div class="flex" style="margin-bottom:30px">
                    <div @click="addImage()" class="border flex items-center justify-center" style="max-width: 80px; height: 80px;border-radius:50%;margin-right:20px;">
                        <img src="../../assets/icons/plus-gray.svg">
                        <input type="file" style="display: none;" ref="img" accept="image/*" @change="imgUpload"/>
                    </div>
                    <div class="border" style="width: 80px; height: 80px;border-radius: 50%;overflow:hidden;" v-if="viewImg">
                        <img :src="viewImg">
                    </div>
                </div>
                <v-text-field
                    outlined
                    required
                    :error-messages="petNameErrors"
                    @input="$v.petName.$touch()"
                    @blur="$v.petName.$touch()"
                    v-model="petName"
                    label="강아지 이름"
                    placeholder="강아지 이름을 입력해주세요"
                />
                <v-text-field
                    outlined
                    required
                    :error-messages="petTypeErrors"
                    @input="$v.petType.$touch()"
                    @blur="$v.petType.$touch()"
                    v-model="petType"
                    label="강아지 견종"
                    placeholder="강아지 견종을 입력해주세요"
                />
                <v-text-field
                    type="date"
                    outlined
                    required
                    :error-messages="petBirthErrors"
                    @input="$v.petBirth.$touch()"
                    @blur="$v.petBirth.$touch()"
                    v-model="petBirth"
                    label="강아지 생년월일"
                    placeholder="강아지 생년월일을 입력해주세요"
                />
                <v-text-field
                    outlined
                    required
                    :error-messages="petWeightErrors"
                    @input="$v.petWeight.$touch()"
                    @blur="$v.petWeight.$touch()"
                    v-model="petWeight"
                    suffix="kg"
                    label="강아지 무게"
                    placeholder="강아지 무게를 입력해주세요"
                />

                <div  style="margin:10px 0 30px 0;">
                    등록해주신 강아지 정보들은 리뷰 작성 시에 리뷰에 노출되며, 추후 맞춤
                    정보 제공 시에 사용됩니다.
                </div>

                <v-btn depressed
                       @click="validatePet()"
                       :disabled="petDisabled"
                       style="border-radius:5px;background-color:#000;color:#fff;font-size:15px;width:100%;height:50px;margin:auto !important;"
                       type="button">강아지 정보 {{ petRegistMsg }}
                </v-btn>
                <div style="height:50px"></div>
            </div>
            <div class="fixed-bottom-button" v-if="device!='web'">
                <v-btn depressed rounded
                       :disabled="disabled"
                       style="background-color: #ffbb53;color:#fff !important;font-size:15px;width:130px;height:50px;margin:auto !important;"
                       @click="validateNamePcs()"
                       type="button">수정
                </v-btn>
            </div>
    </div>
</template>

<script>

import {mapActions} from "vuex";
import AUTH from "../../api/auth";
import apiService from "../../api/apiService";
import {
    API_URL_UPDATE_MYPOSSWORD,
    API_URL_UPDATE_MYINFO,
    API_URL_GET_MYINFO,
    API_URL_UPDATE_PETINFO,
    API_URL_SEND_MEMBER_PCS,
    API_URL_CHECK_MEMBER_AUTHNUM
} from "../../api/urls";
import {validationMixin} from 'vuelidate'
import {required, minLength, maxLength, email, numeric} from 'vuelidate/lib/validators'

export default {
    mixins: [validationMixin],
    validations: {
        upass: {required, minLength: minLength(6), maxLength: maxLength(15)},
        reupass: {required},
        nowupass: {required},
        name: {required,maxLength: maxLength(8)},
        pcs: {numeric},
        email: {email, required},
        authnum: {required},
        petName: {required,maxLength: maxLength(8)},
        petType: {required,maxLength: maxLength(15)},
        petWeight: {required,numeric},
        petBirth: {required},

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
            this.checkPassDisable();
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
            this.checkPassDisable();
            return errors
        },
        nowupassErrors() {
            const errors = []
            if (!this.$v.nowupass.$dirty) return errors
            !this.$v.nowupass.required && errors.push('현재 비밀번호를 입력하세요')
            this.checkPassDisable();
            return errors
        },
        nameErrors() {
            const errors = []
            if (!this.$v.name.$dirty) return errors
            !this.$v.name.required && errors.push('이름을 입력하세요')
            !this.$v.name.maxLength && errors.push('닉네임은 최대8자까지 가능합니다')
            const regex = /^[ㄱ-ㅎ가-힣a-zA-Z0-9._\-&]+$/;
            if(!regex.test(this.name)) {
                errors.push('영문(대/소문자), 한글, 특수문자(.-_&) 포함된 형태만 가능합니다')
            }
            this.checkNameErros = errors;
            this.checkMemberDisable();
            return errors
        },
        authnumErrors() {
            const errors = []
            if (!this.$v.authnum.$dirty) return errors
            !this.$v.authnum.required && errors.push('인증번호를 입력하세요')
            return errors
        },
        pcsErrors(val) {
            const errors = []
            if (!this.$v.pcs.$dirty) return errors
            if (!this.$v.pcs.numeric) {
                errors.push('휴대폰번호는 숫자만 입력하세요')
                this.pcsComplete = {
                    send: false,
                    resend: false,
                }
            } else {
                if (val) {
                    if (val == this.orgPcs) {
                        this.pcsComplete = {
                            send: false,
                            resend: false,
                        }
                    } else {
                        this.pcsComplete = {
                            send: true,
                            resend: false,
                        }
                    }
                } else {
                    this.pcsComplete = {
                        send: false,
                        resend: false,
                    }
                }
            }
            this.authnumComplete = false;

            return errors
        },
        emailErrors() {
            const errors = []
            if (!this.$v.email.$dirty) return errors
            !this.$v.email.required && errors.push('이메일을 입력하세요')
            !this.$v.email.email && errors.push('잘못된 이메일입니다')
            this.checkEmailErros = errors;
            this.checkMemberDisable();
            return errors
        },
        petNameErrors() {
            const errors = []
            if (!this.$v.petName.$dirty) return errors
            !this.$v.petName.required && errors.push('강아지 이름를 입력하세요')
            !this.$v.petName.maxLength && errors.push('강아지 이름은 최대8자까지 가능합니다')
            if(this.petName) {
                const regex = /^[ㄱ-ㅎ가-힣a-zA-Z]+$/;
                if(!regex.test(this.petName)) {
                    errors.push('영문 과 한글만 가능합니다')
                }
            }
            if(errors.length>0) {
                this.checkPetNameError = true;
            } else {
                this.checkPetNameError = false;
            }

            this.checkPetDisable();
            return errors
        },
        petTypeErrors() {
            const errors = []
            if (!this.$v.petType.$dirty) return errors
            !this.$v.petType.required && errors.push('강아지 견종을 입력하세요')
            !this.$v.petType.maxLength && errors.push('강아지 견종은 최대15자까지 가능합니다')
            if(this.petType) {
                const regex = /^[ㄱ-ㅎ가-힣a-zA-Z]+$/;
                if(!regex.test(this.petType)) {
                    errors.push('영문 과 한글만 가능합니다')
                }
            }
            if(errors.length>0) {
                this.checkPetTypeError = true;
            } else {
                this.checkPetTypeError = false;
            }
            this.checkPetDisable();
            return errors
        },
        petWeightErrors() {
            const errors = []
            if (!this.$v.petWeight.$dirty) return errors
            !this.$v.petWeight.required && errors.push('강아지 무게를 입력하세요')
            !this.$v.petWeight.numeric && errors.push('강아지 무게는 숫자로 입력하세요')
            this.checkPetDisable();
            return errors
        },
        petBirthErrors() {
            const errors = []
            if (!this.$v.petBirth.$dirty) return errors
            !this.$v.petBirth.required && errors.push('강아지 생년월일을 입력하세요')
            this.checkPetDisable();
            return errors
        },
    },
    watch: {},
    data() {
        return {
            deviceClass: '',
            pcs: '',
            name: '',
            upass: '',
            reupass: '',
            nowupass: '',
            authnum: '',
            authnumSend: false,
            disabled: false,
            orgPcs: '',
            email: '',
            pcsComplete: {
                send: false,
                resend: false,
            },
            memberInfo: {},
            device: '',
            snsType: '',
            passDisabled: true,
            upassValid: false,
            reupassValid: false,
            succEmail: false,
            emailResultMessage: '',
            emailResult: false,
            emailResultClass: '',
            authnumComplete: false,
            petId:'',
            petName:'',
            checkPetNameError:false,
            petType:'',
            checkPetTypeError:false,
            petWeight:'',
            petBirth:'',
            authTime:'',
            imgData:{},
            viewImg:'',
            petDisabled:true,
            checkEmailErros:[],
            checkNameErros:[],
            petRegistMsg:'추가',
        };
    },
    created() {
        this.setClass('sub')
        this.setTitle('회원정보 수정');
        this.setBackUrl('');
        let memberInfo = AUTH.getSession();
        if (!memberInfo) {
            this.$router.push('/');
            return;
        }
        this.memberInfo = memberInfo;
        this.name = memberInfo.name;
        this.snsType = (memberInfo.snsType) ? memberInfo.snsType : '';
        if (this.snsType) {
            const emails = this.memberInfo.mail.split('@');
            if(emails[1]!='anonymous.com') {
                this.email = this.memberInfo.mail;
            }
            if(!this.email) {
                this.disabled = true;
            }
        }
        if(memberInfo.pcs) {
            this.orgPcs = memberInfo.pcs;
            this.pcs = memberInfo.pcs;
        }
        this.device = AUTH.device;
        if (this.device != 'web') {
            this.deviceClass = 'py-15';
        } else {
            this.getData();
        }

    },
    methods: {
        ...mapActions('mobile', ["setClass", "setTitle", "setBackUrl"]),
        getData() {
            const frm = new FormData();
            apiService.post(API_URL_GET_MYINFO, frm, (res) => {
                if (res.data.result == 'success') {
                    if(!res.data.info.isError && res.data.info.list) {
                        const petInfo = res.data.info.list[0];

                        this.petId = petInfo.petId;
                        if(this.petId) {
                            this.petRegistMsg = '변경';
                        }
                        this.petName = petInfo.name;
                        this.petType = petInfo.breed;
                        this.petWeight = petInfo.weight;
                        this.petBirth = petInfo.birthDate;
                        if(petInfo.image)this.viewImg = petInfo.image;

                        if(this.petName && this.petType && this.petWeight && this.petBirth) {
                            this.petDisabled = false;
                        }


                    }

                }


            });
        },
        checkPassDisable() {
            if (this.upassValid && this.reupassValid && this.$v.nowupass.required) {
                this.passDisabled = false;
            } else this.passDisabled = true;
        },
        checkMemberDisable() {
            let flag = true;
            if (this.snsType) {
                if (this.checkEmailErros.length>0) flag = false;
            }
            if (this.checkNameErros.length<1 && flag) this.disabled = false;
            else this.disabled = true;
        },
        checkPetDisable() {
            if(this.$v.petWeight.numeric && this.$v.petWeight.required  && this.$v.petBirth.required) {
                if(this.checkPetNameError) {
                    this.petDisabled = true;
                    return;
                }
                if(this.checkPetTypeError) {
                    this.petDisabled = true;
                    return;
                }
                this.petDisabled = false;

            }  else this.petDisabled = true;
        },
        validatePass() {
            if(this.reupassValid && this.upassValid && this.nowupass) {
                const frm = new FormData();
                frm.append('upass', this.upass);
                frm.append('nowupass', this.nowupass);
                this.$eventBus.$emit('overlay', 'open');
                apiService.post(API_URL_UPDATE_MYPOSSWORD, frm, (res) => {
                    this.$eventBus.$emit('overlay', 'hide');
                    let params = {};
                    if (res.data == 'succ') {
                        params.message = '비밀번호를 수정 하였습니다';

                    } else if (res.data == 'fail') {
                            params.message = '잘못된 현재 비밀번호입니다';

                    } else {
                        params.message = '잘못된 접근 입니다';
                    }
                    this.$eventBus.$emit('modalOpen', params);

                });
            }
        },
        validateNamePcs() {
            if(this.pcs) {
                if(this.pcsErrors.length>0) {
                    return;
                }
                if(this.orgPcs != this.pcs) {
                    if(!this.authnumComplete) {
                        let alp = {message:'인증을 완료해주세요'}
                        this.$eventBus.$emit('modalOpen', alp);
                        return;
                    }
                }
            }


            const frm = new FormData();
            frm.append('name', this.name);
            if(this.snsType) {
                frm.append('email', this.email);
            }
            if(this.pcs)frm.append('pcs', this.pcs);
            this.$eventBus.$emit('overlay', 'open');
            apiService.post(API_URL_UPDATE_MYINFO, frm, (res) => {
                this.$eventBus.$emit('overlay', 'hide');
                let params = {};
                if (res.data == 'success') {
                    this.memberInfo.name = this.name;
                    this.memberInfo.pcs = this.pcs;
                    if(this.snsType) {
                        this.memberInfo.mail = this.email;
                    }
                    AUTH.updateSession(this.memberInfo);
                    params.message = '회원정보를 수정 하였습니다';
                    //params.doAction = () => {
                      //  this.$router.back();
                    //}

                } else {
                    params.message = '중복된 휴대폰 번호 입니다';
                }
                this.$eventBus.$emit('modalOpen', params);

            });
        },
        validatePet() {

            const frm = new FormData();
            if(this.petId) {
                frm.append('petId', this.petId);
            }

            frm.append('petName', this.petName);
            frm.append('petType', this.petType);
            frm.append('petWeight', this.petWeight);
            frm.append('petBirth', this.petBirth);
            if(this.imgData.file) {
                frm.append('image', this.imgData.file);
            }

            this.$eventBus.$emit('overlay', 'open');
            apiService.postFile(API_URL_UPDATE_PETINFO, frm, (res) => {
                this.$eventBus.$emit('overlay', 'hide');
                let params = {};

                if (res.data.result == 'succ') {
                    params.message = '강아지 정보를 '+this.petRegistMsg+' 하였습니다';
                    if(!this.petId) {
                        this.petRegistMsg = '변경';
                        this.petId = res.data.data.petId;
                    }
                } else {
                    params.message = '강아지 정보 '+this.petRegistMsg+'에 실패 하였습니다';
                }
                this.$eventBus.$emit('modalOpen', params);

            });
        },
        addImage() {
            this.$refs.img.click();
        },
        imgUpload() {
            /*
            if (this.imgList.length >= 5) {
                let params = {
                    message: '이미지는 최대 2개까지 가능합니다',
                };
                this.$eventBus.$emit('modalOpen', params);
                return;
            }
            */
            const imgObj = this.$refs.img.files;
            let img = imgObj.length > 0 ? imgObj[0] : null;
            this.imgData = {isfile: '', file: img, url: URL.createObjectURL(img)}
            this.viewImg = URL.createObjectURL(img);
            //this.imgList.push(imgData);
        },
        imgRemove(index) {
            //this.imgList.splice(index, 1)
        },
        validate() {
            const frm = new FormData();
            frm.append('name', this.name);
            frm.append('pcs', this.pcs);
            this.$eventBus.$emit('overlay', 'open');
            apiService.post(API_URL_UPDATE_MYINFO, frm, (res) => {
                this.$eventBus.$emit('overlay', 'hide');
                let params = {};
                if (res.data == 'success') {
                    this.memberInfo.name = this.name;
                    this.memberInfo.pcs = this.pcs;

                    AUTH.updateSession(this.memberInfo);
                    params.message = '회원정보를 수정 하였습니다';
                    params.doAction = () => {
                        this.$router.back();
                    }


                } else {
                    params.message = '잘못된 접근 입니다';
                }
                this.$eventBus.$emit('modalOpen', params);

            });
        },
        sendSms() {
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
                    this.pcsComplete.send = false;
                    this.pcsComplete.resend = true;
                    this.authnumSend = true;
                    this.setTime(res.data.data);

                    params.message = '휴대폰으로 인증번호를 발송하였습니다'



                } else {
                    params.message = '인증번호 발송에 실패 하였습니다'
                }
                this.$eventBus.$emit('modalOpen', params);
            });
        },
        setTime(time) {
            let nowTime = 180;
            let timeInterval = setInterval(()=>{
                nowTime--;
                if(nowTime<1) {
                    this.pcsComplete.send = true;
                    this.pcsComplete.resend = false;
                    this.authnumSend = false;
                    this.authnum = '';
                    clearInterval(timeInterval);
                    return;
                }
                let min = nowTime/60;
                let sec = nowTime%60;
                sec = (sec<10)?'0'+sec:sec;
                this.authTime = Math.floor(min)+':'+sec;

            },1000);
        },
        authnumValidate() {
            const frm = new FormData();
            frm.append('authnum', this.authnum);
            frm.append('pcs', this.pcs);
            this.$eventBus.$emit('overlay', 'open');
            apiService.post(API_URL_CHECK_MEMBER_AUTHNUM, frm, (res) => {
                this.$eventBus.$emit('overlay', 'hide');
                let params = {};
                if (res.data.result == 'success') {
                    this.authnumComplete = true;
                    params.message = '인증번호를 확인하였습니다';

                } else {
                    this.authnumComplete = false;
                    params.message = '잘못된 인증번호 입니다';
                }
                this.$eventBus.$emit('modalOpen', params);

            });

        }

    }

}
</script>
<style lang="scss" scoped="true">
.fixed-bottom-button {
    width: 100%;
    margin-top:100px;
    text-align: center;
}

.font-bloack {
    color: #000;
}
</style>
