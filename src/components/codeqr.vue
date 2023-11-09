<template>
	<JsPanel class="panneau" :visible="!chargement" :options="options">
		<div class="conteneur-gauche" />
		<div class="conteneur panneau-codeqr">
			<div class="contenu">
				<label v-if="mode === 'edition'">{{ $t('lienOuTexte') }}</label>
				<input type="search" :maxlength="255" :value="texte" @input="texte = $event.target.value" v-if="mode === 'edition'">
				<input type="text" class="domaine" :value="lien" disabled v-else-if="mode === 'lecture' && lien !== ''">
				<div :id="'qr_' + id" class="codeqr" :class="{'edition': mode === 'edition'}" />
				<span class="bouton" role="button" tabindex="0" @click="generer" v-if="mode === 'edition'">{{ $t('valider') }}</span>
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
	name: 'PCodeQR',
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
			mode: 'edition',
			deplacement: false,
			redimensionnement: false,
			titre: '',
			id: '',
			w: 0,
			h: 0,
			x: 0,
			y: 0,
			minw: 30,
			minh: 32,
			statut: '',
			dimensions: {},
			position: {},
			donnees: { x: 0, y: 0 },
			codeqr: '',
			texte: 'https://ladigitale.dev',
			lien: ''
		}
	},
	watch: {
		export: function (valeur) {
			if (valeur === true) {
				this.position = { x: this.x, y: this.y }
				this.$emit('export', { id: this.id, titre: this.titre, mode: this.mode, statut: this.statut, dimensions: this.dimensions, position: this.position, contenu: this.texte, w: this.w, h: this.h, x: this.x, y: this.y })
			}
		},
		deplacement: function (valeur) {
			if (valeur === false && this.mode === 'lecture') {
				const rect = document.querySelector('#' + this.id + ' .codeqr').getBoundingClientRect()
				this.codeqr.width = rect.width
				this.codeqr.height = rect.width
			}
		}
	},
	created () {
		this.definirCaracteristiques('codeqr')
		if (this.panneau.contenu !== '') {
			this.texte = this.panneau.contenu
			if (this.verifierURL(this.texte) === true) {
				this.lien = this.texte.replace('http://', '').replace('https://', '')
			}
		}
		this.genererOptions('codeqr')
	},
	mounted () {
		this.initialiser()
		this.positionner()
		this.chargement = false
		if (this.mode === 'edition' && this.statut !== 'min') {
			this.$nextTick(function () {
				document.querySelector('#' + this.id + ' input').focus()
				document.querySelector('#' + this.id + ' input').select()
			}.bind(this))
		}
		this.$nextTick(function () {
			const texte = this.texte
			// eslint-disable-next-line
			this.codeqr = new QRCode('qr_' + this.id, {
				text: texte,
				width: this.convertirRem(100),
				height: this.convertirRem(100),
				colorDark: '#000000',
				colorLight: '#ffffff',
				// eslint-disable-next-line
				correctLevel : QRCode.CorrectLevel.H
			})
		}.bind(this))
	},
	methods: {
		generer () {
			if (this.texte !== '') {
				this.mode = 'lecture'
				this.codeqr.makeCode(this.texte)
				if (this.verifierURL(this.texte) === true) {
					this.lien = this.texte.replace('http://', '').replace('https://', '')
					if (this.donnees.w > 0 && this.donnees.h > 0) {
						this.w = this.donnees.w
						this.h = this.donnees.h
					} else {
						this.w = 30
						this.h = 38
					}
				} else if (this.verifierURL(this.texte) === false && this.donnees.w > 0 && this.donnees.h > 0) {
					this.w = this.donnees.w
					this.h = this.donnees.h
				} else if (this.verifierURL(this.texte) === false) {
					this.w = 30
					this.h = 32
				}
				if (this.donnees.x > 0 && this.donnees.y > 0) {
					this.x = this.donnees.x
					this.y = this.donnees.y
				}
				this.positionner()
			}
		},
		editer () {
			this.mode = 'edition'
			this.lien = ''
			this.donnees.w = this.w
			this.donnees.h = this.h
			this.donnees.x = this.x
			this.donnees.y = this.y
			this.w = 36
			this.h = 46
			this.positionner()
		}
	}
}
</script>

<style>
.panneau .conteneur .codeqr {
	margin: 0 auto;
	user-select: none;
}

.panneau .conteneur input + .codeqr {
	margin: 2rem auto 0;
}

.panneau .conteneur .codeqr img {
	display: inline-block!important;
	max-width: 100%;
}

.panneau .conteneur .codeqr.edition img {
	max-height: 25rem!important;
}

.panneau .conteneur input.domaine {
	text-align: center;
	background: #fff;
}
</style>
