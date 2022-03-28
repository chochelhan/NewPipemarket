<template>
    <div class="page-contents">
        <div
            style="background-color: #f1f1f1; min-height: calc(100vh)"
            class="p-6 flex-1 relative"
        >
            <div class="flex" style="padding-top:30px;flex-wrap: wrap;">
                <div class="flex items-center justify-center mr-6 radios" v-for="(item,index) in qnaDivs"
                     @click="setDiv(item.ix)">

                    <img v-if="item.checked" src="../../assets/icons/radioChecked.svg" class="mr-2 radio"/>
                    <img v-else src="../../assets/icons/radio.svg" class="mr-2 radio"/>
                    <label>{{ item.div_name }}</label>
                </div>
            </div>
            <div class="mt-5 relative">
                <input
                    v-model="subject"
                    maxlength="15"
                    placeholder="제목을 입력해주세요."
                    class="px-4 py-2 rounded-xl w-full text-sm"
                    style="background: #fff;height:50px;border-radius:10px !important;"
                />
                <div
                    class="absolute top-0 right-4 flex items-center h-full"
                    style="font-size: 12px; color: #999;"
                >
                    {{ subjectLength }}/15
                </div>
            </div>
            <div class="mt-4">
                <textarea
                    v-model="contents"
                    class="w-full px-4 py-2 rounded-xl text-sm"
                    placeholder="문의하실 내용을 입력하세요."
                    style="height: 180px;background: #fff !important;border-radius:10px !important;"
                 ></textarea>
            </div>
            <div class="flex mt-4 cursor-pointer" v-if="setting.write_secret=='Y'" @click="setHidden()">
                <img
                    src="../../assets/icons/check-box-off.svg"
                    alt=""
                    v-if="!isHidden"
                />
                <img
                    src="../../assets/icons/check-box-on.svg"
                    alt=""
                    v-else
                />
                <div class="ml-2 text-sm font-light">비밀글 설정하기</div>
            </div>
            <ul style="font-size: 12px; color: #999999;padding:0;" class="mt-4">
                <li class="flex">
                    <div>・</div>
                    상품과 관련없는 문의는 강제 삭제될 수 있습니다.
                </li>
                <li class="flex">
                    <div>・</div>
                    이메일, 휴대폰번호, 주민등록번호와 같은 개인정보가 노출되지 않도록
                    유의하시기 바랍니다.
                </li>
            </ul>
            <div class="p-6 mt-4 w-full left-0" style="padding-top:60px;">
                <v-btn :disabled="disabled" style="background: #000;color:#fff !important;width:100%;height: 55px;font-size:16px;" depressed
                     @click="qnaSubmit()"  rounded>
                    등록
                </v-btn>
            </div>
        </div>
    </div>
</template>

<script>

import {mapActions} from "vuex";
import AUTH from "../../api/auth";
import apiService from "../../api/apiService";
import {
    API_URL_GET_QNA_SETTING,
    API_URL_INSERT_QNA
} from "../../api/urls";

export default {
    watch: {
        ix(val) {
            this.validateCheck();
        },
        subject(val) {
            if(val) {
                this.subjectLength = val.length;
            } else {
                this.subjectLength = 0;
            }
            this.validateCheck();
        },
        contents(val) {
            this.validateCheck();
        }
    },
    data() {
        return {
            pid: '',
            setting: {},
            qnaDivs: [],
            ix: '',
            disabled: true,
            subjectLength:0,
            subject:'',
            contents:'',
            isHidden:0,
        };
    },
    created() {
        this.setClass('sub')
        this.setTitle('문의하기');
        this.setBackUrl('');
        let memberInfo = AUTH.getSession();
        if (!memberInfo) {
            this.$router.push('/');
            return;
        }
        this.pid = this.$route.params.pid;
        this.getData();


    },
    methods: {
        ...mapActions('mobile', ["setClass", "setTitle", "setBackUrl"]),
        getData() {
            const frm = new FormData();
            frm.append('pid', this.pid)
            apiService.post(API_URL_GET_QNA_SETTING, frm, (res) => {

                this.setting = res.data.productQnaSetting;
                for (let item of res.data.qnaDivs) {
                    if (item.disp == "1") {
                        item.checked = false;
                        this.qnaDivs.push(item)
                    }

                }

            });

        },
        setDiv(ix) {
            for (let item of this.qnaDivs) {
                if (item.ix == ix) {
                    this.ix = ix;
                    item.checked = true;
                } else item.checked = false;
            }
        },
        setHidden() {
            if(this.isHidden)this.isHidden=0;
            else this.isHidden = 1;
        },
        validateCheck() {
            let flag = true;
            if(!this.subject)flag = false;
            if(!this.contents)flag = false;
            if(!this.ix)flag = false;
            if(flag)this.disabled = false;
            else this.disabled = true;
        },
        qnaSubmit() {
            const frm = new FormData();
            frm.append('pid', this.pid)
            frm.append('div', this.ix);
            frm.append('subject', this.subject);
            frm.append('contents', this.contents);
            frm.append('isHidden', this.isHidden);

            this.$eventBus.$emit('overlay', 'open');
            apiService.post(API_URL_INSERT_QNA, frm, (res) => {
                this.$eventBus.$emit('overlay', 'hide');
                let params = {};
                if (res.data == 'success') {
                        params.message = '문의글을 등록하였습니다';
                        params.doAction = () => {
                            this.$router.back();
                        }

                } else {
                    params.message = '잘못된 접근 입니다';

                }
                this.$eventBus.$emit('modalOpen', params);

            });
        }

    }

}
</script>
<style lang="scss" scoped>

</style>

