<template>
	<JsPanel class="panneau" :visible="!chargement" :options="options">
		<div class="conteneur-gauche" />
		<div class="conteneur panneau-modalites">
			<div class="contenu">
				<div class="modalites">
					<span role="button" tabindex="0" @click="modalite = 'silence'" style="background-image: url(./static/img/modalites/silence.png)" />
					<span role="button" tabindex="0" @click="modalite = 'ecoutez'" style="background-image: url(./static/img/modalites/ecoutez.png)" />
					<span role="button" tabindex="0" @click="modalite = 'chuchotez'" style="background-image: url(./static/img/modalites/chuchotez.png)" />
					<span role="button" tabindex="0" @click="modalite = 'parlez'" style="background-image: url(./static/img/modalites/parlez.png)" />
					<span role="button" tabindex="0" @click="modalite = 'communiquez'" style="background-image: url(./static/img/modalites/communiquez.png)" />
				</div>
				<div class="modalite">
					<img :src="'./static/img/modalites/' + modalite + '.png'" :alt="$t(modalite)">
					<div class="legende">{{ $t(modalite) }}</div>
					<div class="source"><a href="https://arasaac.org" target="_blank">{{ $t('sourceImages') }}&nbsp;: ARASAAC. Licence&nbsp;: CC (BY-NC-SA)</a></div>
				</div>
			</div>
		</div>
		<div class="conteneur-droite" />
		<div class="conteneur-bas" />
	</JsPanel>
</template>

<script>
import JsPanel from '@/components/jspanel.vue'
import Panneau from '@/panneau'

export default {
	name: 'PModalites',
	components: {
		JsPanel
	},
	props: {
		panneau: Object,
		pages: Array,
		nav: Boolean,
		export: Boolean,
		evenementClavier: Object
	},
	extends: Panneau,
	data () {
		return {
			chargement: true,
			options: {},
			mode: 'lecture',
			deplacement: false,
			redimensionnement: false,
			titre: '',
			id: '',
			w: 0,
			h: 0,
			x: 0,
			y: 0,
			minw: 38,
			minh: 56,
			statut: '',
			dimensions: {},
			position: {},
			donnees: { w: 0, h: 0, x: 0, y: 0 },
			modalite: 'silence'
		}
	},
	watch: {
		export: function (valeur) {
			if (valeur === true) {
				this.position = { x: this.x, y: this.y }
				this.$emit('export', { id: this.id, titre: this.titre, mode: this.mode, statut: this.statut, dimensions: this.dimensions, position: this.position, contenu: { modalite: this.modalite }, w: this.w, h: this.h, x: this.x, y: this.y })
			}
		}
	},
	created () {
		this.definirCaracteristiques('modalites')
		if (this.panneau.contenu !== '') {
			this.modalite = this.panneau.contenu.modalite
		}
		this.genererOptions('modalites')
	},
	mounted () {
		this.initialiser()
		this.positionner()
		this.chargement = false
	}
}
</script>

<style>
.panneau .panneau-modalites .modalites {
	display: flex;
	justify-content: space-between;
	flex-wrap: wrap;
	margin-bottom: 2rem;
}

.panneau .panneau-modalites .modalites span {
	width: 5rem;
	height: 5rem;
	background-size: contain;
	background-origin: center;
	background-repeat: no-repeat;
	cursor: pointer;
	border-radius: 50%;
	border: 1px solid #ddd;
}

.panneau .panneau-modalites .modalites span:hover {
	background-color: #eee;
}

.panneau .panneau-modalites .modalite img {
	max-width: 100%;
	font-size: 0;
}

.panneau .panneau-modalites .modalite .legende {
	font-size: 3rem;
	font-weight: 700;
	margin-top: 1.5rem;
}

.panneau .panneau-modalites .modalite .source {
	font-size: 1rem;
	margin-top: 1.5rem;
}
</style>
