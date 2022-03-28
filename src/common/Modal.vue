<template>
    <div>
        <v-dialog
            v-model="dialog"
            width="370"
            style="z-index:100000000000000000"
        >
            <v-card>
                <v-card-title class="headline">
                    {{ title }}
                </v-card-title>
                <v-card-text class="message-box">
                    <div class="message-content" v-html="message"></div>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <div class="button-box">
                        <button
                            v-if="action"
                             @click="hideModal()"
                        >
                            취소
                        </button>
                        <button
                            ref="primayButton"
                            @click="somethingModal()"
                        >
                            확인
                        </button>
                    </div>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<style lang="scss" scoped="true">
.message-box {
    min-height: 160px;

    .message-content {
        padding-top: 30px;
    }
}
</style>
<script>
export default {
    watch: {
        dialog(val) {
            if (!val) {
                if (!this.action) {
                    if (this.doAction && !this.doActive) {
                        this.doAction();
                    }
                } else {
                    if (!this.doActive && !this.cancleActive) {
                        if (this.cancleAction) {
                            this.cancleAction();
                        }
                    }
                }
            }
        }
    },
    data() {
        return {
            dialog: false,
            message: '',
            title: '알림',
            action: false,
            doAction: '',
            cancleAction: '',
            doActive: false,
            cancleActive: false,
        }
    },
    created() {
        this.$eventBus.$on('modalOpen', this.openModal);
    },
    methods: {
        openModal(params) {
            if (params.title) this.title = params.title;
            else this.title = '알림';

            if (params.message) this.message = params.message;
            else if (params.content) this.message = params.content;

            switch (params.type) {
                case 'confirm':
                    this.action = true;
                    if (params.cancleAction) {
                        this.cancleAction = params.cancleAction;
                    } else this.cancleAction = '';
                    break;
                case 'timeout':
                    this.action = false;
                    setTimeout(() => {
                        this.dialog = false;
                    }, 2000);
                    break;
                default:
                    this.action = false;
                    break;

            }

            if (params.doAction) {
                this.doAction = params.doAction;
            } else this.doAction = '';

            this.dialog = true;


        },
        hideModal() {
            this.cancleActive = true;
            if (this.cancleAction) {
                this.cancleAction();
            }
            this.dialog = false;


        },
        somethingModal() {
            this.doActive = true;
            if (this.doAction) {
                this.doAction();
            }
            this.dialog = false;


        }
    },
    updated() {
        if (this.dialog) {
            setTimeout(()=>{
                this.$refs.primayButton.focus();
            },200)

        }

    }
}
</script>
<style lang="scss" scoped="true">
.button-box {
    display:flex;
    margin:0 20px 20px 0;
    button {
        &:last-child {
            margin-left: 30px;
        }
        &:focus {
            outline:none;
        }
    }
}
</style>

