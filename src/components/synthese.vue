<template>
	<JsPanel class="panneau" :visible="!chargement" :options="options">
		<div class="conteneur-gauche" />
		<div class="conteneur panneau-synthese">
			<div class="contenu" v-if="mode === 'edition'">
				<label>{{ $t('texteSynthetiser') }}</label>
				<div class="synthese"><input type="search" :value="texte" @input="texte = $event.target.value"></div>
				<label>{{ $t('vitesse') }}</label>
				<div class="vitesse">
					<input type="range" :min="0.5" :max="2" :value="vitesse" :step="0.1" @change="vitesse = $event.target.value">
					<span class="valeur">{{ vitesse }}</span>
				</div>
				<label>{{ $t('hauteur') }}</label>
				<div class="hauteur">
					<input type="range" :min="0" :max="2" :value="hauteur" :step="0.1" @change="hauteur = $event.target.value">
					<span class="valeur">{{ hauteur }}</span>
				</div>
				<label>{{ $t('voix') }}</label>
				<div class="voix">
					<input type="text" :list="id + 'liste_voix'" :value="voix" @input="voix = $event.target.value" :disabled="listeVoix.length === 0" />
					<datalist :id="id + 'liste_voix'">
						<option value="">--</option>
						<template v-for="(item, index) in listeVoix">
							<option :value="item.name" v-if="item.default" :key="'voix_' + index">{{ item.name }} ({{ item.lang }}) -- {{ $t('parDefaut') }}</option>
							<option :value="item.name" v-else :key="'voix_' + index">{{ item.name }} ({{ item.lang }})</option>
						</template>
					</datalist>
				</div>
				<div class="actions">
					<span class="bouton" role="button" tabindex="0" @click="parler">{{ $t('ecouter') }}</span>
					<span class="bouton" role="button" tabindex="0" @click="generer">{{ $t('valider') }}</span>
				</div>
			</div>
			<span class="bouton audio" role="button" tabindex="0" @click="parler" v-else><i class="material-icons">play_arrow</i></span>
		</div>
		<div class="conteneur-droite" />
		<div class="conteneur-bas" />
	</JsPanel>
</template>

<script>
import JsPanel from '@/components/jspanel.vue'
import Panneau from '@/panneau'

export default {
	name: 'PSynthese',
	components: {
		JsPanel
	},
	props: {
		panneau: Object,
		pages: Array,
		nav: Boolean,
		export: Boolean,
		evenementClavier: Object,
		listeVoix: Array
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
			minw: 20,
			minh: 14,
			statut: '',
			dimensions: {},
			position: {},
			donnees: { x: 0, y: 0 },
			texte: '',
			vitesse: 1,
			hauteur: 1,
			voix: ''
		}
	},
	watch: {
		export: function (valeur) {
			if (valeur === true) {
				this.position = { x: this.x, y: this.y }
				this.$emit('export', { id: this.id, titre: this.titre, mode: this.mode, statut: this.statut, dimensions: this.dimensions, position: this.position, contenu: { texte: this.texte, vitesse: this.vitesse, hauteur: this.hauteur, voix: this.voix }, w: this.w, h: this.h, x: this.x, y: this.y })
			}
		}
	},
	created () {
		this.definirCaracteristiques('syntheseVocale')
		if (this.panneau.contenu !== '') {
			this.texte = this.panneau.contenu.texte
			this.vitesse = this.panneau.contenu.vitesse
			this.hauteur = this.panneau.contenu.hauteur
			this.voix = this.panneau.contenu.voix
		}
		this.genererOptions('synthese')
	},
	mounted () {
		this.initialiser()
		this.positionner()
		this.chargement = false
		if (this.mode === 'edition' && this.statut !== 'min' && this.texte === '') {
			this.$nextTick(function () {
				document.querySelector('#' + this.id + ' input').focus()
			}.bind(this))
		}
		if (this.mode === 'edition' && this.listeVoix.length === 0) {
			this.voix = '---'
		} else if (this.mode === 'lecture' && (this.listeVoix.length === 0 || this.listeVoix.map(function (e) { return e.name }).includes(this.voix) === false)) {
			this.editer()
		}
	},
	methods: {
		generer () {
			if (this.texte !== '' && this.voix !== '' && this.listeVoix.map(function (e) { return e.name }).includes(this.voix) === true) {
				this.mode = 'lecture'
				this.w = 20
				this.h = 14
				if (this.donnees.x > 0 && this.donnees.y > 0) {
					this.x = this.donnees.x
					this.y = this.donnees.y
				}
				this.positionner()
			}
		},
		editer () {
			this.mode = 'edition'
			this.donnees.x = this.x
			this.donnees.y = this.y
			this.w = 40
			this.h = 41
			this.positionner()
		},
		parler () {
			if (window.speechSynthesis.speaking || this.voix === '') {
				return false
			} else {
				const synthese = new SpeechSynthesisUtterance(this.texte)
				synthese.rate = this.vitesse
				synthese.pitch = this.hauteur
				this.listeVoix.forEach(function (item) {
					if (item.name === this.voix) {
						synthese.voice = item
					}
				}.bind(this))
				window.speechSynthesis.speak(synthese)
			}
		}
	}
}
</script>

<style>
.panneau .conteneur .synthese,
.panneau .conteneur .vitesse,
.panneau .conteneur .hauteur {
	margin-bottom: 2rem;
}

.panneau .conteneur .hauteur .valeur,
.panneau .conteneur .vitesse .valeur {
	width: 3rem;
}

.panneau .conteneur .vitesse,
.panneau .conteneur .hauteur,
.panneau .conteneur .temps .minutes-secondes {
    display: flex;
}

.panneau .conteneur .bouton.audio {
	height: 6.4rem;
	line-height: 6.4rem;
	padding: 0 3rem;
	margin-top: 0;
}

.panneau .conteneur .bouton.audio i {
	font-size: 4.8rem;
}
</style>
