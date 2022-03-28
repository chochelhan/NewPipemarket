<template>
    <div class="page-contents">
        <form novalidate @submit.prevent="validate">
            <div style="margin-bottom: 70px; background-color: #eeeeee">
                <div class="bg-white px-5 py-8">
                    <div class="flex justify-between items-center">
                        <p class="font-semibold text-22">배송지를 선택해주세요.</p>
                    </div>
                    <div>
                        <div
                            class="flex items-center border rounded-2xl w-max px-3 mt-1"
                            style="color: #8097e6; border-color: #8097e6;max-height:30px;margin-bottom:30px;"
                            @click="regist()">
                            <p style="margin-bottom: 4px; margin-right: 5px">+</p>
                            <p style="color:#8097e6;padding-top:14px;" class="text-13">
                                신규 배송지 추가
                            </p>
                        </div>
                        <div :class="'p-5 border border rounded-md mt-3 '+item.gclass" v-for="(item,index) in addrList"
                             @click="setDefault(index)">
                            <div class="flex justify-between items-center">
                                <div class="flex">
                                    <img v-if="item.gclass=='active'" src="../../assets/icons/check-box-circle-on.svg"/>
                                    <img v-else src="../../assets/icons/check-box-circle-off.svg"/>

                                    <p class="font-semibold ml-2" style="position:relative;top:7px;">
                                        {{ item.shipping_name }}</p>
                                </div>
                                <div v-if="item.default_yn=='Y'"
                                     style="background-color: #8097e6;max-height:27px;"
                                     class="px-2 py-1 rounded-md"
                                >
                                    <p class="text-11 text-white">기본 배송지로 설정</p>
                                </div>
                                <div v-else
                                     style="border-color: #aaa;max-height:27px;"
                                     class="px-2 py-1 rounded-md border">
                                    <p class="text-11" style="color: #aaa">기본 배송지로 설정</p>
                                </div>
                            </div>
                            <p class="text-sm mt-3 font-light" style="color: #444">
                                [{{ item.zipcode }}] {{ item.address1 }}, {{ item.address2 }}
                            </p>
                            <p class="text-sm mt-3 font-light" style="color: #999">
                                {{ item.recipient }} / {{ item.mobile }}
                            </p>
                        </div>

                    </div>
                </div>
                <div class="py-2 px-3 fixed bottom-5 w-full button-row" style="background: #fff;">
                    <v-btn depressed rounded color="#ffbb53" style="color:#fff;height:55px;width:100%;"
                           @click="updateDatault()">
                        변경 완료
                    </v-btn>
                </div>
            </div>
        </form>
    </div>
</template>
<script>


import AUTH from '../../api/auth'
import {
    API_URL_GET_SHIPPING_ADDRESS,
    API_URL_UPDATE_SHIPPING_DEFAULT
} from '../../api/urls';
import apiService from '../../api/apiService'

export default {
    props:["oid"],
    data() {
        return {
            isLogin: false,
            memberInfo: {},
            addrList: [],

        };
    },
    created() {
        let memberInfo = AUTH.getSession();
        if (memberInfo) {
            this.isLogin = true;
        }
        this.getData()
    },
    methods: {
        getData() {
            const frm = {}
            if(this.oid) {
                frm.oid = this.oid;
            }
            apiService.get(API_URL_GET_SHIPPING_ADDRESS, frm, (res) => {
                if (res.data.result == 'success') {
                    for (let item of res.data.data.list) {
                        if(this.oid) {
                            item.gclass = '';
                        } else {
                            item.gclass = (item.default_yn == 'Y') ? 'active' : '';
                        }
                        this.addrList.push(item);
                    }


                }
            });
        },
        regist() {
            this.$emit("regist")
        },
        setDefault(index) {
            let item = this.addrList[index];
            for (let data of this.addrList) {
                if (data.ix == item.ix) {
                    if(!this.oid) {
                        data.default_yn = 'Y';
                    }
                    data.gclass = 'active';

                } else {
                    if(!this.oid) {
                        data.default_yn = 'N';
                    }
                    data.gclass = '';
                }
            }

        },
        updateDatault() {
            let ix = '';
            let shippingInfo = {};
            if(this.oid) {
                for (let data of this.addrList) {
                    if (data.gclass == 'active') {
                        ix = data.ix;
                        shippingInfo = data;
                    }
                }
                if(!ix) {
                    let params = {
                        message: '변경할 배송지를 선택하세요',
                    };

                    this.$eventBus.$emit('modalOpen', params);
                    return;
                }
            } else {
                for (let data of this.addrList) {
                    if (data.default_yn == 'Y') {
                        ix = data.ix;
                        shippingInfo = data;
                    }
                }
                if(!ix) {
                    let params = {
                        message: '신규 배송지를 추가하세요',
                    };

                    this.$eventBus.$emit('modalOpen', params);
                    return;
                }
            }

            const frm = new FormData();
            frm.append('ix',ix);
            if(this.oid) {
                frm.append('oid',this.oid);
            }
            this.$eventBus.$emit('overlay', 'open');
            apiService.post(API_URL_UPDATE_SHIPPING_DEFAULT, frm, (res) => {
                this.$eventBus.$emit('overlay', 'hide');
                if (res.data == 'success') {
                    if(!this.oid) {
                        sessionStorage.setItem('shippingInfo', JSON.stringify(shippingInfo));
                        this.$router.back();
                    }  else {
                        let params = {
                            message:'배송지 정보를 변경하였습니다',
                            doAction:()=> {
                                this.$router.back();
                            }
                        }
                        this.$eventBus.$emit('modalOpen', params);
                    }

                }
            });
        }
    }

}
</script>

<style lang="scss" scoped>
.active {
    border: solid 1px #000;
}

@media only all and (min-width: 500px) {

    .button-row {
        max-width:500px;
        width:500px;
    }
}
</style>