<template>
    <div class="review-page-contents">
        <div class="w-full wrap">
            <div v-html="content"></div>
        </div>

    </div>
</template>

<script>

import {mapActions} from "vuex";
import apiService from "../../api/apiService";
import {
    API_URL_GET_AGREE_INFO
} from "../../api/urls";

export default {
    data() {
        return {
            content:'',
        };
    },
    created() {
        this.setClass('sub')
        if(this.$route.params.type == 'private')this.setTitle('개인정보 처리방침');
        else this.setTitle('이용약관');
        this.setBackUrl('');
        this.getData(this.$route.params.type);

    },
    methods: {
        ...mapActions('mobile', ["setClass", "setTitle", "setBackUrl"]),
        getData(type) {
            const frm = new FormData();
            apiService.post(API_URL_GET_AGREE_INFO, frm, (res) => {
                    if(type=='private') {
                        this.content = res.data.policyData.collection.contents;
                    } else {
                        this.content = res.data.policyData.use.contents;
                    }

            });

        },

    }

}
</script>

<style lang="scss" scoped>
.review-page-contents {
    padding-top:20px;
    background:#fff;
    .review-img {
        padding: 10px 0;

        img {
            width: auto !important;
            min-width: auto !important;
            max-width: 100% !important;
            height: auto !important;
        }
    }

    .wrap {
        padding: 16px 21px;
    }

    .review-item .user-review img {
        width: 40px;
        height: 40x;
        border-radius: 50%;
        margin: 8px;
    }

    .review-item {
        padding-bottom: 34px;
        border-bottom: 1px solid #eee;
    }

    .review-item:last-child {
        padding-bottom: 34px;
        border-bottom: 0px solid #eee;
    }

    .review-item .user-review .info p {
        font-size: 12px;
    }

    .review-item .user-review .info .title {
        font-weight: 600;
    }

    .review-item .user-review .info .content {
        color: #797979;
    }

    .review-item .user-review .time {
        color: #797979;
        font-size: 12px;
    }

    .review-item .product-item {
        padding: 9px;
        border: 1px dashed #ddd;
        border-radius: 5px;
        margin-bottom: 12px;
        margin-top: 5px;
    }

    .review-item .product-item img {
        width: 46px;
        height: 46px;
        margin-right: 9px;
        border-radius: 7px;
    }

    .review-item .wrap-info-product {
        font-size: 12px;
    }

    .post-item-info img {
        width: 100%;
        aspect-ratio: 1/1;
        border-radius: 5px;
        margin-bottom: 14px;
    }

    .post-item-info .tag-product {
        border-radius: 4px;
        border: 1px solid #ddd;
        padding: 2px 7px;
        color: #888;
        display: inline-block;
        margin-bottom: 12px;
        font-size: 12px;
    }

    .wrap-review .star-selected {
        color: rgb(255, 180, 13);
    }

    .wrap-review .star-unselected {
        color: rgb(226, 226, 226);
    }

    .wrap-review {
        margin-top: 14px;
    }

    .profile-img {
        width: 40px;
        height: 40px;
        margin-right: 10px;
        border-radius: 50%;
        overflow: hidden;
        font-size: 17pt;
        text-align: center;
        background: #eee;

        img {
            width: 40px;
            min-height: 40px;
        }

        i {
            margin-top: 10px;
        }
    }

    .bbs-title {
        color: #111;
        font-weight: bold;
    }

    .bbs-msg {
        color: #797979;
    }
}
</style>