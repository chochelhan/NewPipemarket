
export default ({
	namespaced: true,
	state: {
		class:'sub',
		title:'',
		backUrl:'',
	},
	getters: {
		getClass: state => {
			return state.class;
		},
		getTitle:state => {
			return state.title;
		},
		getBackUrl:state => {
			return state.backUrl;
		},
		
	},
	mutations: {
		setClass(state,name) {
			state.class = name;
		},
		setTitle(state,title) {
			state.title = title;
		},
		setBackUrl(state,url) {
			state.backUrl = url;
		},
	},
	actions: {
		setClass({commit},name) {
			commit('setClass',name)
		},
		setTitle({commit},title) {
			commit('setTitle',title)
		},
		setBackUrl({commit},url) {
			commit('setBackUrl',url)
		},
		
	}
})
