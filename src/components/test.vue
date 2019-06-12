<template>
	<div>

		<div>
			<router-link to="/">Home</router-link>
		</div>

		<div>创始人：{{founder}}</div>
	</div>
</template>
<script>
	export default {
		asyncData(obj) {
			let store = obj.store;
			let router = obj.router;
			let rootVm = obj.rootVm;
			let arg = {
				rootVm
			};

			// 触发 action 后，会返回 Promise
			return store.dispatch('test/getInitData', arg)
		},
		data() {
			return {}
		},
		computed: {
			founder() {
				return this.$store.state.test.founder
			}
		}

	}
</script>