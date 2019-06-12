//test.js

export default {
	namespaced: true,
	state() {
		return {
			founder: '010'
		}
	},
	getters: {

	},
	mutations: {
		updateFounder(state, arg, rootState) {
			state.founder = arg;
		}
	},
	actions: {
		getInitData(store, arg) {

			return new Promise((resolve, reject) => {

				arg.rootVm.apiPost('/1-withCredentials.php', {
					data: {}
				}).then((rs) => {

					let token = rs.data.token === "" ? "无" : rs.data.token;
					store.commit('updateFounder', rs.data.founder + '--------cookie_token:' + token + '--------' + new Date().getTime());
					resolve()

				}, (err) => {
					reject();
				})

			})

		},
	},
}