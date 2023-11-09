<template>
	<JsPanel class="panneau" :visible="!chargement" :options="options">
		<div class="conteneur-gauche" />
		<div class="conteneur panneau-calendrier">
			<div class="contenu">
				<div :id="'calendrier_' + id" />
			</div>
		</div>
		<div class="conteneur-droite" />
		<div class="conteneur-bas" />
	</JsPanel>
</template>

<script>
import JsPanel from '@/components/jspanel.vue'
import VanillaCalendar from '@uvarov.frontend/vanilla-calendar'
import Panneau from '@/panneau'

export default {
	name: 'PCalendrier',
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
			minw: 40,
			minh: 34,
			statut: '',
			dimensions: {},
			position: {}
		}
	},
	watch: {
		export: function (valeur) {
			if (valeur === true) {
				this.position = { x: this.x, y: this.y }
				this.$emit('export', { id: this.id, titre: this.titre, statut: this.statut, dimensions: this.dimensions, position: this.position, contenu: '', w: this.w, h: this.h, x: this.x, y: this.y })
			}
		}
	},
	created () {
		this.definirCaracteristiques('calendrier')
		this.genererOptions('calendrier')
	},
	mounted () {
		this.initialiser()
		this.positionner()
		this.chargement = false
		this.$nextTick(function () {
			const options = {
				settings: {
					lang: this.$parent.langue,
					visibility: {
						weekNumbers: true,
						theme: 'light'
					}
				}
			}
			const calendrier = new VanillaCalendar('#calendrier_' + this.id, options)
			calendrier.init()
		}.bind(this))
	}
}
</script>

<style>
.panneau .panneau-calendrier {
	overflow: hidden!important;
}

.panneau .panneau-calendrier .vc-container {
	border: none;
	color: #001d1d;
}
</style>
