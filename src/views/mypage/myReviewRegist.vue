<template>
    <div class="page-contents" style="padding-top:29px;">
        <form novalidate @submit.prevent="validate">
            <div class="flex bg-white flex p-5">
                <div
                    :style="{'background-image':'url('+orderInfo.pimg+')','background-repeat':'no-repeat','background-size':'cover','width':'62px','height':'62px'}"></div>
                <div class="flex flex-col justify-center ml-3">
                    <div class="text-15">{{ orderInfo.pname }}</div>
                    <div class="text-13 font-light" style="color: #6c6c6c">
                        {{ orderInfo.option_text }}, {{ orderInfo.pcnt }}개
                    </div>
                </div>
            </div>
            <div class="py-3 flex justify-center items-center"
                 style="background-color: #8097e6" v-if="!info.bbs_ix">
                <div class="text-white text-13">리뷰쓰고 최대 {{ addPoint }}P 받기</div>
            </div>
            <div class="p-5">
                <p class="font-semibold text-lg">상품은 만족하셨나요?</p>
                <div class="flex mt-6 justify-center">
        <span v-for="(star,index) in starList" @click="setStar(index)">
          <img v-if="star.on"
               src="../../assets/icons/starOn.svg"
               alt=""
               width="35px"
               class="mx-1"
          />
          <img v-else
               src="../../assets/icons/starOff.svg"
               alt=""
               width="35px"
               class="mx-1"
          />
        </span>

                </div>
                <div style="padding-top:35px;">
                    <v-textarea
                        outlined
                        style="height: 180px;border-radius: 10px;"
                        placeholder="상품에 대한 평가를 10자 이상 작성해주세요."
                        v-model="message"
                        :error-messages="messageErrors"
                        @input="$v.message.$touch()"
                        @blur="$v.message.$touch()"
                    >
                    </v-textarea>

                    <div class="flex px-4 py-3 border justify-between items-center mt-3"
                         style="margin:-3px 0 10px 0 !important;border-radius: 10px;border:solid 1px #999;"
                         @click="checkMyDogs">
                        <div class="text-sm" style="color: #797979">{{ selecedDogName }}</div>
                        <img src="../../assets/icons/arrow-down-gray.svg" alt=""/>
                    </div>
                    <div class="text-11 mt-3 font-extralight" style="color: #797979">
                        최대 5장 사진 첨부
                    </div>
                    <div class="flex mt-3" style="flex-wrap: wrap;">
                        <div
                            class="flex items-center justify-center bg-gray-200 mr-3"
                            style="width: 80px;max-width: 80px; height: 80px"
                            @click="uploadFile()">
                            <img src="../../assets/icons/plus.svg" alt=""/>
                            <input type="file" style="display: none;" ref="img" accept="image/*" @change="imgUpload"/>
                        </div>
                        <div style="width: 80px;height: 80px;margin-bottom:10px;" class="mr-3 relative"
                             v-for="(img,index) in imgList">
                            <div style="width: 80px;height: 80px;overflow:hidden;">
                                <img :src="img.url" alt=""/>
                            </div>
                            <img style="z-index:20"
                                 src="../../assets/icons/close-circle.svg"
                                 alt=""
                                 class="absolute -top-2 -right-2"
                                 @click="imgRemove(index)"
                            />
                        </div>
                    </div>

                    <!--div class="flex items-center mt-5" @click="setMarektCheck()">
                        <img src="../../assets/icons/check-box-circle-on.svg" v-if="marketCheck" alt=""/>
                        <img src="../../assets/icons/check-box-circle-off.svg" v-else alt=""/>
                        <div class="ml-2 text-xs">
                            작성된 리뷰는 피리마켓 홍보콘텐츠로 사용될 수 있습니다.
                        </div>
                    </div-->
                </div>
            </div>
            <div class="bg-white py-2 w-full my-2" style="padding: 0 15px">
                <v-btn type="submit" :disabled="disabled"
                       style="background-color:#000;color:#fff !important;width:100%;height:55px;" rounded depressed>
                    등록하기
                </v-btn>
            </div>
        </form>

        <div v-if="dogModalView"
             class="
        fixed
        flex
        items-center
        justify-center
        w-full
        h-full
        top-0
        left-0
        bg-opacity-70 bg-black
        z-50
        px-5
      "
        >
            <form novalidate @submit.prevent="dogValidate">
                <div class="bg-white px-6 py-9 w-full rounded-xl no-outline">
                    <div class="flex justify-between items-center">
                        <div class="text-lg font-semibold">강아지 정보 추가</div>
                        <img src="../../assets/icons/close.svg" @click="dogModalView=false" alt=""/>
                    </div>

                    <div class="mt-6">강아지 이름</div>
                    <input
                        style="border:solid 1px #ddd"
                        type="text"
                        v-model="dogName"
                        class="p-3 mt-3 w-full font-light border rounded-lg"
                    />
                    <div class="error-msg" v-if="dogNameErros.length>0">{{ dogNameErros[0] }}</div>
                    <div class="mt-7">강아지 견종</div>
                    <input
                        type="text"
                        style="border:solid 1px #ddd"
                        v-model="dogTypeName"
                        class="p-3 mt-3 w-full font-light border rounded-lg"
                    />
                    <div class="error-msg" v-if="dogTypeNameErros.length>0">{{ dogTypeNameErros[0] }}</div>
                    <div class="mt-7">강아지 생년월일</div>
                    <div class="mt-2 flex">
                        <div class="w-2/6 border rounded-lg py-3 mr-4">
                            <input
                                type="number"
                                v-model="dogYear"
                                class="text-center text-15 w-full font-light"
                                placeholder="년"
                            />
                        </div>
                        <div class="w-2/6 border rounded-lg py-3 mr-4">
                            <input
                                class="text-center text-15 w-full font-light"
                                placeholder="월"
                                type="number"
                                v-model="dogMonth"

                            />
                        </div>
                        <div class="w-2/6 border rounded-lg py-3">
                            <input
                                class="text-center text-15 w-full font-light"
                                placeholder="일"
                                type="number"
                                v-model="dogDay"

                            />
                        </div>
                    </div>
                    <div class="mt-7">강아지 무게</div>
                    <div class="relative w-full mt-2">
                        <input
                            style="border:solid 1px #ddd"
                            type="number"
                            v-model="dogWeight"
                            class="p-3 w-full font-light border rounded-lg text-right px-9"
                        />
                        <div
                            class="absolute top-0 bottom-0 right-4 m-auto text-15 h-max"
                            style="height: max-content"
                        >
                            kg
                        </div>
                    </div>
                    <div style="text-align: center;margin-top:40px">
                        <v-btn type="submit" rounded depressed
                               style="background-color: #ffbb53;color:#fff;width:130px;height:50px;font-size: 15px;"
                               :disabled="dogDisabled">
                            추가완료
                        </v-btn>
                    </div>
                </div>
            </form>
        </div>

        <div
            style="z-index:30;"

            v-if="dogDialogView"
            class="
        flex flex-col
        justify-end
        fixed
        z-10
        bg-black bg-opacity-70
        top-0
        left-0
        w-full
        h-full">
            <div
                class="purchase-box bg-white relative rounded-t-2xl"
                style="transform: translateY(0);"
            >
                <div class="max-height">
                    <div class="flex justify-between py-5 px-6 border-b items-center" @click="selectDog(index)"
                         v-for="(item,index) in myDogList">
                        <div :class="item.gclass">{{ item.viewName }}</div>
                        <img v-if="item.gclass=='font-semibold'" src="../../assets/icons/check-blue.svg"/>
                    </div>
                </div>
                <div style="text-align:center;padding:18px 0 40px 0;">
                    <v-btn depressed rounded style="width:142px;height:40px;color:#8c8c8c" @click="openDogRegist()">강아지
                        추가
                    </v-btn>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {validationMixin} from 'vuelidate'
import {required, minLength, numeric, maxLength} from 'vuelidate/lib/validators'

import {mapActions} from "vuex";
import AUTH from "../../api/auth";
import apiService from "../../api/apiService";
import {
    IMGHOST,
    API_URL_INSERT_REVIEW,
    API_URL_GET_MYREVIEW_INFO, API_URL_UPDATE_PETINFO
} from "../../api/urls";
import UTIL from "@/api/util";

export default {
    mixins: [validationMixin],
    validations: {
        message: {required, minLength: minLength(10)},
        dogName: {maxLength: maxLength(8)},
        dogTypeName: {maxLength: maxLength(15)},
        dogYear: {numeric},
        dogMonth: {numeric},
        dogDay: {numeric},
        dogWeight: {numeric},
    },
    watch: {
        dogName(val) {
            this.dogNameErros = [];
            !this.$v.dogName.maxLength && this.dogNameErros.push('강아지 이름은 최대8자까지 가능합니다')
            if (this.dogName) {
                const regex = /^[ㄱ-ㅎ가-힣a-zA-Z]+$/;
                if (!regex.test(this.dogName)) {
                    this.dogNameErros.push('영문 과 한글만 가능합니다')
                }
            }
            this.dogValidateCheck()
        },
        dogTypeName(val) {
            this.dogTypeNameErros = [];
            !this.$v.dogTypeName.maxLength && this.dogTypeNameErros.push('강아지 이름은 최대8자까지 가능합니다')
            if (this.dogTypeName) {
                const regex = /^[ㄱ-ㅎ가-힣a-zA-Z]+$/;
                if (!regex.test(this.dogTypeName)) {
                    this.dogTypeNameErros.push('영문 과 한글만 가능합니다')
                }
            }
            this.dogValidateCheck()
        },
        dogYear(val) {
            if (val.length > 4) {
                this.dogYear = val.substring(0, 4);
            }
            this.dogValidateCheck()
        },
        dogMonth(val) {
            if (val.length > 2) {
                this.dogMonth = val.substring(0, 2);
            }
            this.dogValidateCheck()
        },
        dogDay(val) {
            if (val.length > 2) {
                this.dogDay = val.substring(0, 2);
            }
            this.dogValidateCheck()
        },
        dogWeight(val) {
            this.dogValidateCheck()
        },
    },
    computed: {
        messageErrors() {
            const errors = []
            if (!this.$v.message.$dirty) return errors
            if (!this.$v.message.required) {
                errors.push('내용을 입력하세요')
                this.disabled = true;
            } else if (!this.$v.message.minLength) {
                errors.push('내용은 10자이상 입력하세요')
                this.disabled = true;
            } else {
                if (this.star < 1) {
                    this.disabled = true;
                } else {
                    this.disabled = false;
                }
            }
            //if (this.marketCheck) this.disabled = false;
            //else this.disabled = true;
            return errors;
        }
    },
    data() {
        return {
            orderInfo: {},
            oid: '',
            odIx: '',
            message: '',
            starList: [
                {on: false},
                {on: false},
                {on: false},
                {on: false},
                {on: false},
            ],
            dogDialogView: false,
            info: {},
            star: 0,
            disabled: true,
            imgList: [],
            myDogInfo: {},
            myDogList: [],
            selecedDogName: '강아지 정보 추가',
            dogDisabled: true,
            dogName: '',
            dogTypeName: '',
            dogYear: '',
            dogMonth: '',
            dogDay: '',
            dogWeight: '',
            dogModalView: false,
            addPoint: 0,
            marketCheck: true,
            dogTypeNameErros: [],
            dogNameErros: [],

        };
    },
    created() {
        this.setClass('sub')
        this.setTitle('리뷰 작성');
        this.setBackUrl('');
        let memberInfo = AUTH.getSession();
        if (!memberInfo) {
            this.$router.push('/');
            return;
        }
        this.oid = this.$route.params.oid;
        this.odIx = this.$route.params.odIx;
        this.getData();


    },
    methods: {
        ...mapActions('mobile', ["setClass", "setTitle", "setBackUrl"]),
        getData() {
            const frm = new FormData();
            frm.append('oid', this.oid);
            frm.append('odIx', this.odIx);
            apiService.post(API_URL_GET_MYREVIEW_INFO, frm, (res) => {
                if (res.data.result == 'success') {
                    if (res.data.modify) {
                        this.setTitle('리뷰 수정');
                        this.info = res.data.bbsInfo;
                        this.message = this.info.bbs_contents;
                        this.star = this.info.valuation_goods;
                        let k = 1;
                        for (let item of this.starList) {
                            if (k <= this.star) item.on = true;
                            else item.on = false;
                            k++;
                        }
                        for (let k = 1; k <= 5; k++) {
                            let filekey = 'bbs_file_' + k;
                            if (this.info[filekey]) {
                                let imgData = {
                                    orgkey: k,
                                    isfile: this.info[filekey],
                                    file: '',
                                    url: IMGHOST + '/data/mall_data/product_after/' + this.info.bbs_ix + '/' + this.info[filekey]
                                }
                                this.imgList.push(imgData);
                            }

                        }
                        this.disabled = false;

                    }
                    this.orderInfo = res.data.ordInfo;
                    switch (res.data.config.add_mileage_type) {
                        case '1'://  일괄적립
                            this.addPoint = UTIL.numberFormat(res.data.config.mileage_amount);
                            break;
                        case '2'://  구분 적립
                            this.addPoint = UTIL.numberFormat(res.data.config.mileage_amount_p);
                            break;
                        case '3'://  회원 적립

                            break;
                    }
                    if (!res.data.petInfo.isError && res.data.petInfo.list) {
                        for (let item of res.data.petInfo.list) {
                            if (!item.name) continue;
                            item.viewName = UTIL.getDogInfo(item);

                            if (this.info.petId && this.info.petId == item.petId) {
                                item.gclass = 'font-semibold';
                                this.myDogInfo = item;
                                this.selecedDogName = item.viewName
                            } else {
                                item.gclass = '';
                            }

                            this.myDogList.push(item)
                        }
                        if (this.myDogList.length > 0) {
                            if (!this.info.petId) {
                                this.myDogList[0].gclass = 'font-semibold';
                                this.myDogInfo = this.myDogList[0];
                                this.selecedDogName = this.myDogInfo.viewName
                            }
                        }


                    }
                } else {
                    this.$router.push('/')
                }

            });

        },
        setMarektCheck() {
            if (this.marketCheck) this.marketCheck = false;
            else this.marketCheck = true;
            if (this.star < 1) {
                this.disabled = true;
                return;
            } else {
                this.disabled = false;
            }
            if (!this.$v.message.required) {
                this.disabled = true;
                return;
            } else if (!this.$v.message.minLength) {
                this.disabled = true;
                return;
            } else {
                this.disabled = false;
            }
            if (this.marketCheck) this.disabled = false;
            else this.disabled = true;
        },
        selectDog(index) {
            this.myDogInfo = this.myDogList[index];
            for (let item of this.myDogList) {
                if (item.petId == this.myDogInfo.petId) {
                    item.gclass = 'font-semibold';
                } else item.gclass = '';
            }
            this.selecedDogName = this.myDogInfo.viewName
            this.dogDialogView = false;

        },
        goPage(url) {
            this.$router.push(url)
        },
        setStar(index) {
            this.star = index + 1;
            let k = 1;
            for (let item of this.starList) {
                if (k <= this.star) item.on = true;
                else item.on = false;
                k++;
            }
            if (!this.$v.message.required) {
                this.disabled = true;
            } else if (!this.$v.message.minLength) {
                this.disabled = true;
            } else {
                this.disabled = false;
            }
            //if (this.marketCheck) this.disabled = false;
            //else this.disabled = true;
        },
        checkMyDogs() {
            if (this.myDogList.length < 1) {
                this.dogDisabled = true;
                this.dogName = '';
                this.dogTypeName = '';
                this.dogYear = '';
                this.dogMonth = '';
                this.dogDay = '';
                this.dogWeight = '';
                this.dogModalView = true;
                return false;
            } else {
                this.dogDialogView = true;
            }
        },
        openDogRegist() {
            this.dogDisabled = true;
            this.dogName = '';
            this.dogTypeName = '';
            this.dogYear = '';
            this.dogMonth = '';
            this.dogDay = '';
            this.dogWeight = '';

            this.dogModalView = true;
            this.dogDialogView = false;

        },
        validate() {
            this.$v.$touch();
            if (!this.$v.$anyError) {
                if (this.star < 1) {
                    let params = {
                        message: '평점을 입력하세요',
                    };
                    this.$eventBus.$emit('modalOpen', params);
                    return;
                }
                const frm = new FormData();

                if (this.myDogInfo.viewName) {

                    frm.append('petName', this.myDogInfo.name)
                    frm.append('petBirthdate', this.myDogInfo.birthDate)
                    frm.append('petWeight', this.myDogInfo.weight)
                    frm.append('petId', this.myDogInfo.petId)
                }

                frm.append('pid', this.orderInfo.pid)
                frm.append('oid', this.oid)
                frm.append('od_ix', this.odIx)
                frm.append('option_id', this.orderInfo.option_id)
                frm.append('valuation_goods', this.star)
                frm.append('bbs_subject', this.message)
                frm.append('bbs_contents', this.message)
                if (this.info.bbs_ix) {
                    frm.append('bbs_ix', this.info.bbs_ix)
                    if (this.imgList.length > 0) {
                        let k = 1;
                        for (let img of this.imgList) {
                            if (k > 5) break;
                            if (img.file) {
                                frm.append('bbsFile' + k, img.file)

                            } else if (img.isfile) {
                                let keyName = {orgkey: img.orgkey, isfile: img.isfile}
                                frm.append('isBbsFile' + k, JSON.stringify(keyName))
                            }

                            k++;
                        }
                    }
                } else {

                    if (this.imgList.length > 0) {
                        let k = 1;
                        for (let img of this.imgList) {
                            if (k > 5) break;
                            frm.append('bbsFile' + k, img.file)
                            k++;
                        }
                    }
                }
                this.$eventBus.$emit('overlay', 'open');
                apiService.post(API_URL_INSERT_REVIEW, frm, (res) => {
                    this.$eventBus.$emit('overlay', 'hide');
                    if (res.data.result == 'success') {
                        let msg = '리뷰를 등록하였습니다'
                        if (this.info.bbs_ix) {
                            msg = '리뷰를 수정하였습니다'
                        }
                        let params = {
                            message: msg,
                            doAction: () => {
                                this.$router.back();
                            }
                        };
                        this.$eventBus.$emit('modalOpen', params);
                    } else {
                        let params = {}
                        switch (res.data.data) {
                            case 'existsReview':
                                params.message = '이미 작성된 리뷰입니다'
                                break;
                            case 'notExistsOrder':
                                params.message = '글을 쓸 권한이 존재하지 않습니다'
                                break;
                            default:
                                params.message = '잘모된 접근입니다';
                                params.doAction = () => {
                                    this.$router.back();
                                }
                                break;
                        }

                        this.$eventBus.$emit('modalOpen', params);
                    }

                });
            }

        },
        uploadFile() {
            this.$refs.img.click();
        },
        imgUpload() {
            if (this.imgList.length >= 5) {
                let params = {
                    message: '이미지는 최대 5개까지 가능합니다',
                };
                this.$eventBus.$emit('modalOpen', params);
                return;
            }
            const imgObj = this.$refs.img.files;
            let img = imgObj.length > 0 ? imgObj[0] : null;
            let imgData = {isfile: '', file: img, url: URL.createObjectURL(img)}
            this.imgList.push(imgData);
        },
        imgRemove(index) {
            this.imgList.splice(index, 1)
        },
        dogValidateCheck() {
            if (!this.dogName) {
                this.dogDisabled = true;
                return;
            }
            if (this.dogNameErros.length > 0) {
                this.dogDisabled = true;
                return;
            }
            if (!this.dogTypeName) {
                this.dogDisabled = true;
                return;
            }
            if (this.dogTypeNameErros.length > 0) {
                this.dogDisabled = true;
                return;
            }
            if (this.dogYear && parseInt(this.dogYear) > 0) {
                if (!this.$v.dogYear.numeric) {
                    this.dogDisabled = true;
                    return;
                }
                if (this.dogYear.length != 4) {
                    this.dogDisabled = true;
                    return;
                }


            } else {
                this.dogDisabled = true;
                return;
            }

            if (this.dogMonth) {
                if (!this.$v.dogMonth.numeric) {
                    this.dogDisabled = true;
                    return;
                }

            } else {
                this.dogDisabled = true;
                return;
            }
            if (this.dogDay) {
                if (!this.$v.dogDay.numeric) {
                    this.dogDisabled = true;
                    return;
                }
            } else {
                this.dogDisabled = true;
                return;
            }
            if (parseInt(this.dogYear) < 1 || parseInt(this.dogMonth) < 1 || parseInt(this.dogDay) < 1) {
                this.dogDisabled = true;
                return;
            }
            let dogMonth = parseInt(this.dogMonth) - 1;
            const nowDate = new Date()
            const nowDateTime = nowDate.getTime();

            const birthDate = new Date(this.dogYear, dogMonth, this.dogDay, nowDate.getHours(), nowDate.getMinutes(), nowDate.getSeconds());
            const birthDateTime = birthDate.getTime();
            if (parseInt(nowDateTime / 100000) < parseInt(birthDateTime / 100000)) {
                this.dogDisabled = true;
                return;
            }

            if (this.dogWeight) {
                if (!this.$v.dogWeight.numeric) {
                    this.dogDisabled = true;
                    return;
                }
            } else {
                this.dogDisabled = true;
                return;
            }
            this.dogDisabled = false;


        },
        dogValidate() {
            const frm = new FormData();
            let dogMonth = (parseInt(this.dogMonth) < 10) ? '0' + parseInt(this.dogMonth) : parseInt(this.dogMonth);
            let dogDay = (parseInt(this.dogDay) < 10) ? '0' + parseInt(this.dogDay) : parseInt(this.dogDay);
            let dogBirth = this.dogYear + '-' + dogMonth + '-' + dogDay;

            frm.append('petName', this.dogName);
            frm.append('petType', this.dogTypeName);
            frm.append('petBirth', dogBirth);
            frm.append('petWeight', this.dogWeight);

            this.$eventBus.$emit('overlay', 'open');
            apiService.post(API_URL_UPDATE_PETINFO, frm, (res) => {
                this.$eventBus.$emit('overlay', 'hide');
                if (res.data.result == 'succ') {

                    const item = res.data.data;
                    item.viewName = UTIL.getDogInfo(item);
                    item.gclass = '';
                    this.myDogList.push(item)
                    if (this.myDogList.length == 1) {
                        this.myDogList[0].gclass = 'font-semibold';
                        this.myDogInfo = this.myDogList[0];
                        this.selecedDogName = this.myDogInfo.viewName
                    }

                    let params = {
                        message: '강아지 정보를 등록하였습니다',
                        doAction: () => {
                            this.dogModalView = false;
                        }
                    };
                    this.$eventBus.$emit('modalOpen', params);
                } else {
                    let params = {
                        message: '강아지 정보등록에 실패 하였습니다',
                        doAction: () => {
                            this.dogModalView = false;
                        }
                    };
                    this.$eventBus.$emit('modalOpen', params);
                }

            });
        }

    }

}
</script>

<style lang="scss" scoped>
.active-menu {
    color: #8097e6;
}

.no-outline {
    input:focus {
        outline: none;
    }
}

.error-msg {
    color: #f73535;
    font-size: 12px;
    padding: 5px 0 0 5px;
}

.max-height {
    max-height: 500px !important;
    overflow: auto;
}
</style>