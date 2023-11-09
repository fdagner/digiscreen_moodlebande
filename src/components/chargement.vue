<template>
	<div id="conteneur-chargement-page" v-if="chargementPage">
		<div id="chargement-page">
			<div class="spinner">
				<div />
				<div />
				<div />
				<div />
				<div />
				<div />
				<div />
				<div />
				<div />
				<div />
				<div />
				<div />
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'Chargement',
	props: {
		chargementPage: Boolean
	}
}
</script>

<style scoped>
#conteneur-chargement-page {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	width: 100%;
	height: 100%;
	background: transparent;
	z-index: 100000;
}

#chargement-page {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100%;
}

.spinner {
	display: inline-block;
	position: relative;
	width: 8rem;
	height: 8rem;
}

.spinner div {
	transform-origin: 4rem 4rem;
	animation: fonduSortant 1.2s linear infinite;
}

.spinner div:after {
	content: '';
	display: block;
	position: absolute;
	top: 0.3rem;
	left: 3.7rem;
	width: 0.5rem;
    height: 2.5rem;
	border-radius: 20%;
	background: #00ced1;
}

.spinner div:nth-child(1) {
	transform: rotate(0deg);
	animation-delay: -1.1s;
}

.spinner div:nth-child(2) {
	transform: rotate(30deg);
	animation-delay: -1s;
}

.spinner div:nth-child(3) {
	transform: rotate(60deg);
	animation-delay: -0.9s;
}

.spinner div:nth-child(4) {
	transform: rotate(90deg);
	animation-delay: -0.8s;
}

.spinner div:nth-child(5) {
	transform: rotate(120deg);
	animation-delay: -0.7s;
}

.spinner div:nth-child(6) {
	transform: rotate(150deg);
	animation-delay: -0.6s;
}

.spinner div:nth-child(7) {
	transform: rotate(180deg);
	animation-delay: -0.5s;
}

.spinner div:nth-child(8) {
	transform: rotate(210deg);
	animation-delay: -0.4s;
}

.spinner div:nth-child(9) {
	transform: rotate(240deg);
	animation-delay: -0.3s;
}

.spinner div:nth-child(10) {
	transform: rotate(270deg);
	animation-delay: -0.2s;
}

.spinner div:nth-child(11) {
	transform: rotate(300deg);
	animation-delay: -0.1s;
}

.spinner div:nth-child(12) {
	transform: rotate(330deg);
	animation-delay: 0s;
}
</style>
