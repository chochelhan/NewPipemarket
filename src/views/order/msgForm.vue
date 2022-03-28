<template>
    <div class="page-contents">
            <div class="bg-white px-5 py-8">
                <div class="flex justify-between items-center">
                    <p class="font-semibold text-22">
                        배송 시 요청사항을<br>선택해주세요.
                    </p>
                </div>
                <div class="mt-5">
                    <div class="flex mb-5" v-for="item in deliveryType" @click="setDelivery(item.code)">
                        <img v-if="item.selected=='off'"
                            class="mr-3"
                            src="../../assets/icons/check-box-circle-off.svg"
                            alt=""
                        />
                        <img v-else
                             class="mr-3"
                             src="../../assets/icons/check-box-circle-on.svg"
                             alt=""
                        />
                        <p class="text-15">{{ item.msg }}</p>
                    </div>
                    <div class="flex" v-if="dtype=='d'">
                        <v-text-field
                            outlined
                            maxLength="100"
                            :error-messages="msgErrors"
                            @input="msgTouch()"
                            @blur="msgTouch()"
                            v-model="msg"
                            placeholder="메세지를 입력해주세요"
                        />
                    </div>
                </div>
            </div>
            <div class="py-2 px-3 w-full" style="margin-top:100px;">
                <v-btn type="button" @click="complete()" depressed rounded color="#ffbb53" style="color:#fff;height:55px;width:100%;">
                    완료
                </v-btn>
            </div>
    </div>
</template>
<script>


export default {
    data() {
        return {
            dtype:'a',
            msgErrors:[],
            deliveryType: [
                {code:'a',msg:'경비실에 맡겨주세요.',selected:'on'},
                {code:'b',msg:'문앞에 놓아주세요.',selected:'off'},
                {code:'c',msg:'배송전에 연락주세요.',selected:'off'},
                {code:'d',msg:'직접 입력',selected:'off'},
            ],
            msg:'',
        };
    },
    created() {

    },
    methods: {
        setDelivery(code) {
            this.dtype = code;
            if(code=='d')this.msgErrors = [];
            for(let item of this.deliveryType) {
                if(item.code == code) {
                    item.selected = 'on';

                } else item.selected = 'off';
            }
        },
        msgTouch() {
            this.msgErrors = [];
            if(!this.msg) {
                this.msgErrors.push('메세지를 입력해주세요')
            }
        },
        complete() {
            let msg = '';
            if(this.dtype =='d') {
                if(!this.msg) {
                    this.msgErrors = [];
                    this.msgErrors.push('메세지를 입력해주세요')
                    return;
                }
                msg = this.msg;
            } else {
                for (let item of this.deliveryType) {
                    if (item.code == this.dtype) {
                        msg = item.msg;
                        break;
                    }
                }
            }
            let param = {
                dtype:this.dtype,
                msg:msg,
            }
            sessionStorage.setItem('deliveryMsg',JSON.stringify(param));
            this.$router.back();
        }

    }

}
</script>

<style lang="scss" scoped>
.mr-3 {
    position:relative;
    top:-7px;
}
</style>