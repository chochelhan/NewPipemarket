const IS_DEBUG = process.env.NODE_ENV !== 'production';

let imghost = 'https://'+location.host;
if(location.host == 'localhost:8080') {
    imghost = 'https://qa.pirimarket.co.kr';
}

export const IMGHOST = imghost;

/**
 * @ 기본설정 정보
 */
export const API_URL_GET_SITE_INFO = '/api/setting/base'
export const API_URL_GET_CART_INFO = '/api/setting/getCartInfo'
export const API_URL_GET_MAIN_INFO = '/api/setting/getMainInfo'
export const API_URL_GET_SPECIAL_LIST = '/api/setting/getSpecialList'
export const API_URL_GET_SPECIAL_INFO = '/api/setting/getSpecialInfo'
export const API_URL_GET_BEST_LIST = '/api/setting/getBestList'
export const API_URL_GET_AGREE_INFO = '/api/setting/getAgreeInfo'

/**
 * @ 회원 정보
 */
export const API_URL_CHECK_MEMBER_EMAIL = '/api/member/userEmailCheck'
export const API_URL_INTRO_MEMBER_LOGIN = '/api/member/getLoginInfo'
export const API_URL_CHECK_MEMBER_UID = '/api/member/userIdCheck'
export const API_URL_INSERT_MEMBER_INFO = '/api/member/joinInputBasic'
export const API_URL_MEMBER_LOGIN = '/api/member/login'
export const API_URL_SEND_MEMBER_PCS = '/api/member/sendPcsByJoin'
export const API_URL_GET_MEMBER_EMAIL_WITHINFO = '/api/member/getEmailWithInfo'
export const API_URL_SEND_FIND_PW = '/api/member/sendFindPw'
export const API_URL_CHECK_FINDPW_AUTHNUM = '/api/member/checkFindPwAuthNum'
export const API_URL_UPDATE_MEMBER_PASSWORD = '/api/member/updateNewPw'
export const API_URL_GET_MEMBER_UCODE = '/api/member/getMemberInfoByUcode'
export const API_URL_UPDATE_MEMBER_APIINFO = '/api/member/updateApiInfo'
export const API_URL_GET_MEMBER_APIINFO = '/api/member/getApiMemberInfo'




/**
 * @ 상품 정보
 */
export const API_URL_GET_GOODS_LIST = '/api/product/getGoodsList'
export const API_URL_GET_GOODS_VIEW = '/api/product/getView'
export const API_URL_GET_QNA_SETTING = '/api/product/qnaRegist'
export const API_URL_INSERT_QNA = '/api/product/insertQna'
export const API_URL_GET_QNA_LIST = '/api/product/getQnaList'
export const API_URL_SET_GOODS_WISH = '/api/product/wish'
export const API_URL_GET_SEARCH = '/api/product/getSearch'
export const API_URL_SET_SEARCH_RESULT = '/api/product/doGoodsSearch'



/**
 * @ 장바구니 정보
 */
export const API_URL_INSERT_CART = '/api/cart/add'
export const API_URL_GET_MY_CART = '/api/cart/getCart'
export const API_URL_UPDATE_CART_AMT = '/api/cart/updateCount'
export const API_URL_DELETE_CART = '/api/cart/deleteCart'
export const API_URL_GET_CART_SUMMARY = '/api/cart/getCartSummary'


/**
 * @ 주문
 */
export const API_URL_GET_SHIPPING_ADDRESS = '/api/order/getShppingAddress'
export const API_URL_UPDATE_SHIPPING_ADDRESS = '/api/order/updateAddressBook'
export const API_URL_UPDATE_SHIPPING_DEFAULT = '/api/order/updateAddressDefault'
export const API_URL_GET_ORDER_INFO = '/api/order/getOrderInput'
export const API_URL_GET_ORDER_COMPLETE = '/api/order/getOrderComplete'

export const API_URL_UPDATE_ORDER_INFO = '/api/order/updateOrderInput'
export const API_URL_INSERT_ORDER_ACTION = '/api/order/paymentAction'
export const API_URL_PAYMENT_BANK_ACTION = '/api/order/paymentBank'
export const API_URL_PAYMENT_PG_ACTION = '/api/order/paymentGateway'
export const API_URL_PAYMENT_FREE_ACTION = '/api/order/paymentFree'
export const API_URL_CHECK_NOMEMBER_OID = '/api/order/checkNomemberOid'




/**
 * @ 마이페이지
 */
export const API_URL_GET_MYPAGE_MAIN = '/api/mypage/getMain'
export const API_URL_GET_MYORDER_LIST = '/api/mypage/getOrderList'
export const API_URL_GET_MYRETURN_LIST = '/api/mypage/getReturnList'

export const API_URL_GET_MYORDER_DETAIL = '/api/mypage/getOrderDetail'
export const API_URL_GET_MYREVIEW_INFO = '/api/mypage/getMyReviewInfo'
export const API_URL_GET_MYREVIEW_LIST = '/api/mypage/getMyReviewList'
export const API_URL_INSERT_REVIEW = '/api/mypage/insertReview'
export const API_URL_UPDATE_MYORDER_STATUS = '/api/mypage/updateOrderStatus'
export const API_URL_GET_MYORDER_POINT = '/api/mypage/myPoints'
export const API_URL_GET_MYORDER_COUPON = '/api/mypage/myCoupons'
export const API_URL_INSERT_MYORDER_COUPON = '/api/mypage/insertCoupon'

export const API_URL_GET_MYORDER_CANCELINFO = '/api/mypage/getCancelInfo'
export const API_URL_GET_MYORDER_CLAIM_DELIVERY = '/api/mypage/claimConfirm'
export const API_URL_UPDATE_MYORDER_CLAIM = '/api/mypage/updateCancelStatus'
export const API_URL_UPDATE_MYORDER_EXCHANGE = '/api/mypage/updateOrderClaim'


export const API_URL_GET_MYORDER_RETURNINFO = '/api/mypage/getReturnInfo'
export const API_URL_GET_MYORDER_EXCHANGEINFO = '/api/mypage/getExchangeInfo'

export const API_URL_UPDATE_MYINFO = '/api/mypage/updateMyinfo'
export const API_URL_GET_MYFAVORTE_LIST = '/api/mypage/myWishList';
export const API_URL_DELETE_MYFAVORITE = '/api/mypage/deleteWish';
export const API_URL_GET_DELIVERY_STATUS= '/api/mypage/getDeleveryTracking'
export const API_URL_GET_MYINFO = '/api/mypage/getMyInfo'
export const API_URL_UPDATE_PETINFO = '/api/mypage/updatePetInfo'
export const API_URL_UPDATE_MYPOSSWORD = '/api/mypage/updateMypassword'
export const API_URL_CHECK_MEMBER_AUTHNUM = '/api/mypage/checkAuthnum'


/**
 * @ 고객센터
 */
export const API_URL_GET_BOARD_LIST = '/api/customer/getBoardList';
export const API_URL_GET_REVIEW_LIST = '/api/customer/getReviewList';
export const API_URL_GET_REVIEW_INFO = '/api/customer/getReviewInfo';
export const API_URL_INSERT_REVIEW_COMMENT = '/api/customer/insertReviewComment';
export const API_URL_UPDATE_REVIEW_LIKE = '/api/customer/updateReviewLike';



export const CONFIG_HEADER_GET = {
    'Authorization': '',
    'device':'',
    'Content-Type': 'application/json;charset=UTF-8'

};

export const CONFIG_HEADER_POST = {
    'Authorization': '',
    'device':'',
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
};

export const CONFIG_HEADER_FILE = {
    'Authorization': '',
    'device':'',
    'Content-Type': 'multipart/form-data;charset=utf-8;'

};


