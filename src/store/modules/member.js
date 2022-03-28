
export default ({
	namespaced: true,
	state: {
		usercode:'',

	},
	getters: {
		getUsercode: state => {
			return state.usercode;
		},
	},
	mutations: {
		setUsercode(state,usercode) {
			state.usercode = usercode;
		},
	},
	actions: {
		setUsercode({commit},usercode) {
			commit('setUsercode',usercode)
		},
	
	}
})
