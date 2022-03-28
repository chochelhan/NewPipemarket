
export default ({
	namespaced: true,
	state: {
		cartCnt:0,
		newCartCnt:0,
		listScroll:false,
		listScrollMore:0,
		appUserComplete:false,
	},
	getters: {
		getListScroll: state => {
			return state.listScroll;
		},
		getListScrollMore: state => {
			return state.listScrollMore;
		},
		getCartCnt:state => {
			return state.cartCnt;
		},
		getNewCartCnt:state => {
			return state.newCartCnt;
		},
		getAppUserComplete:state => {
			return state.appUserComplete;
		},
		
	},
	mutations: {
		setListScroll(state,bool) {
			state.listScroll = bool;
		},
		setListScrollMore(state,top) {
			state.listScrollMore = top;
		},
		setCartCnt(state,cnt) {
			state.cartCnt = cnt;
		},
		setNewCartCnt(state,cnt) {
			state.newCartCnt = cnt;
		},
		setAppUserComplete(state,bool) {
			state.appUserComplete = bool;
		}
	},
	actions: {
		setListScroll({commit},bool) {
			commit('setListScroll',bool)
		},
		setListScrollMore({commit},top) {
			commit('setListScrollMore',top)
		},
		setCartCnt({commit},cnt) {
			commit('setCartCnt',cnt)
		},
		setNewCartCnt({commit},cnt) {
			commit('setNewCartCnt',cnt)
		},
		setAppUserComplete({commit},bool) {
			commit('setAppUserComplete',bool)
		}


    }
})
