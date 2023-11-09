<template>
	<JsPanel class="panneau" :visible="!chargement" :options="options">
		<div class="conteneur-gauche" :class="{'masque': mode === 'lecture'}" />
		<div class="conteneur panneau-iframe" v-if="mode === 'edition' && !chargementIframe">
			<div class="contenu">
				<label>{{ $t('lienContenuLigne') }}</label>
				<input type="search" :value="lien" @input="lien = $event.target.value" @keydown.enter="generer">
				<span class="bouton" role="button" tabindex="0" @click="generer">{{ $t('valider') }}</span>
			</div>
		</div>
		<div class="contenu panneau-iframe chargement" v-else-if="mode === 'edition' && chargementIframe">
			<div class="conteneur-chargement">
				<div class="chargement" />
			</div>
		</div>
		<div class="conteneur panneau-iframe large" v-else>
			<iframe :src="iframe" allowfullscreen></iframe>
		</div>
		<div class="conteneur-droite" :class="{'masque': mode === 'lecture'}" />
		<div class="conteneur-bas" :class="{'masque': mode === 'lecture'}" />
	</JsPanel>
</template>

<script>
import JsPanel from '@/components/jspanel.vue'
import Panneau from '@/panneau'

export default {
	name: 'PIframe',
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
			minh: 22,
			statut: '',
			dimensions: {},
			position: {},
			donnees: { w: 0, h: 0, x: 0, y: 0 },
			lien: '',
			iframe: '',
			chargementIframe: false
		}
	},
	watch: {
		export: function (valeur) {
			if (valeur === true) {
				this.position = { x: this.x, y: this.y }
				this.$emit('export', { id: this.id, titre: this.titre, mode: this.mode, statut: this.statut, dimensions: this.dimensions, position: this.position, contenu: { lien: this.lien, iframe: this.iframe }, w: this.w, h: this.h, x: this.x, y: this.y })
			}
		}
	},
	created () {
		this.definirCaracteristiques('contenuIntegre')
		if (this.panneau.contenu !== '') {
			this.lien = this.panneau.contenu.lien
			this.iframe = this.panneau.contenu.iframe
		}
		if (this.mode === 'lecture') {
			this.redimensionnement = true
		}
		this.genererOptions('iframe')
	},
	mounted () {
		this.initialiser()
		this.positionner()
		this.chargement = false
		if (this.mode === 'edition' && this.statut !== 'min' && this.lien === '') {
			this.$nextTick(function () {
				document.querySelector('#' + this.id + ' input').focus()
			}.bind(this))
		}
	},
	methods: {
		generer () {
			const regex = /<iframe(.+)<\/iframe>/g
			if (regex.test(this.lien) === true) {
				this.lien = this.lien.match(/<iframe [^>]*src="[^"]*"[^>]*>/g).map(x => x.replace(/.*src="([^"]*)".*/, '$1'))[0]
			}
			if (this.verifierURL(this.lien) === true) {
				this.chargementIframe = true
				const xhr = new XMLHttpRequest()
				xhr.onload = function () {
					if (xhr.readyState === xhr.DONE && xhr.status === 200) {
						const donnees = JSON.parse(xhr.responseText)
						if (donnees.hasOwnProperty('error')) {
							this.iframe = this.lien
						} else if (donnees.provider_name.toLowerCase() === 'learningapps.org') {
							donnees.html = donnees.html.replace('http://LearningApps.org', 'https://learningapps.org')
							this.iframe = donnees.html.match(/<iframe [^>]*src="[^"]*"[^>]*>/g).map(x => x.replace(/.*src="([^"]*)".*/, '$1'))[0]
						} else {
							this.iframe = donnees.html.match(/<iframe [^>]*src="[^"]*"[^>]*>/g).map(x => x.replace(/.*src="([^"]*)".*/, '$1'))[0]
						}
						this.mode = 'lecture'
						this.redimensionnement = true
						this.chargementIframe = false
						if (this.donnees.w > 0 && this.donnees.h > 0) {
							this.w = this.donnees.w
							this.h = this.donnees.h
						} else {
							this.w = 50
							this.h = 40
						}
						if (this.donnees.x > 0 && this.donnees.y > 0) {
							this.x = this.donnees.x
							this.y = this.donnees.y
						}
						this.positionner()
					} else {
						this.chargementIframe = false
						this.iframe = this.lien
					}
				}.bind(this)
				xhr.onerror = function () {
					this.chargementIframe = false
					this.iframe = this.lien
				}
				xhr.open('GET', 'https://noembed.com/embed?url=' + this.lien, true)
				xhr.send()
			}
		}
	}
}
</script>

<style>
.panneau .panneau-iframe {
	overflow: auto!important;
}

.panneau .panneau-iframe.large {
	width: 100%!important;
	height: 100%!important;
}

.panneau .panneau-iframe iframe {
	border-bottom-left-radius: 0.7rem;
    border-bottom-right-radius: 0.7rem;
}

.panneau .panneau-iframe.contenu.chargement {
	display: flex;
	justify-content: center;
	align-items: center;
	height: calc(100% - 6rem);
}

.panneau .panneau-iframe .conteneur-chargement {
	font-size: 0;
	line-height: 1;
	text-align: center;
}

.panneau .panneau-iframe .conteneur-chargement .chargement {
	display: inline-block;
	border: 7px solid #ddd;
	border-top: 7px solid #00ced1;
	border-radius: 50%;
	width: 45px;
	height: 45px;
	animation: rotation 0.7s linear infinite;
}
</style>
