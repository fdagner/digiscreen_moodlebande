<template>
	<JsPanel class="panneau" :visible="!chargement" :options="options">
		<div class="conteneur-gauche" />
		<div class="conteneur panneau-audio">
			<div class="contenu" v-if="mode === 'edition' && !chargementAudio">
				<label>{{ $t('apparence') }}</label>
				<div class="choix">
					<span class="lecteur-audio">
						<input type="radio" :id="'lecteur_' + id" :name="'type_' + id" value="lecteur" :checked="type === 'lecteur'" @change="type = $event.target.value">
						<label :for="'lecteur_' + id">{{ $t('lecteur') }}</label>
					</span>
					<span class="bouton-audio">
						<input type="radio" :id="'bouton_' + id" :name="'type_' + id" value="bouton" :checked="type === 'bouton'" @change="type = $event.target.value">
						<label :for="'bouton_' + id">{{ $t('bouton') }}</label>
					</span>
				</div>
				<label>{{ $t('lienFichierAudio') }}</label>
				<div class="valider">
					<input type="search" :value="audio" @input="audio = $event.target.value" @keydown.enter="valider">
					<span role="button" tabindex="0" :title="$t('valider')" class="bouton-secondaire" @click="valider"><i class="material-icons">search</i></span>
				</div>
				<div class="separateur"><span>{{ $t('ou') }}</span></div>
				<label>{{ $t('fichierAppareil') }}</label>
				<label class="bouton" role="button" tabindex="0" :for="'selectionner-audio-' + id">{{ $t('selectionnerAudio') }}</label>
				<input :id="'selectionner-audio-' + id" type="file" @change="televerserAudio" style="display: none" accept=".mp3, .wav, .m4a, .ogg">
			</div>
			<div class="contenu" v-else-if="mode === 'edition' && chargementAudio">
				<div class="conteneur-chargement">
					<div class="chargement" />
				</div>
			</div>
			<div class="contenu" v-else-if="mode === 'vitesse'">
				<audio controls :src="audio"></audio>
				<label>{{ $t('vitesseLecture') }}</label>
				<div class="vitesse">
					<input type="range" :min="0.5" :max="2" :value="vitesse" :step="0.1" @change="modifierVitesse">
					<span class="valeur">{{ vitesse }}</span>
				</div>
				<span class="bouton" role="button" tabindex="0" @click="generer">{{ $t('valider') }}</span>
			</div>
			<div class="contenu lecture-audio" v-else>
				<audio controls :class="{'masque': type === 'bouton'}" :src="audio"></audio>
				<span class="bouton audio" role="button" tabindex="0" @click="lireAudio" v-if="type === 'bouton'">
					<i class="material-icons" v-if="!lecture">play_arrow</i>
					<i class="material-icons" v-else>pause</i>
				</span>
				<span class="bouton-secondaire" role="button" tabindex="0" :title="$t('ajouterListe')" @click="relireAudio" v-if="type === 'bouton'"><i class="material-icons">replay</i></span>
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
	name: 'PAudio',
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
			minw: 21,
			minh: 12,
			statut: '',
			dimensions: {},
			position: {},
			donnees: { x: 0, y: 0 },
			audio: '',
			dataURL: '',
			type: 'lecteur',
			vitesse: 1,
			lecture: false,
			chargementAudio: false
		}
	},
	watch: {
		export: function (valeur) {
			if (valeur === true) {
				this.position = { x: this.x, y: this.y }
				this.$emit('export', { id: this.id, titre: this.titre, mode: this.mode, statut: this.statut, dimensions: this.dimensions, position: this.position, contenu: { audio: this.audio, dataURL: this.dataURL, type: this.type, vitesse: this.vitesse }, w: this.w, h: this.h, x: this.x, y: this.y })
			}
		}
	},
	created () {
		this.definirCaracteristiques('audio')
		if (this.panneau.contenu !== '') {
			if (this.panneau.contenu.hasOwnProperty('dataURL')) {
				this.dataURL = this.panneau.contenu.dataURL
			}
			if (this.dataURL !== '') {
				const blob = this.convertirDataURL(this.dataURL)
				this.audio = window.URL.createObjectURL(blob)
			} else {
				this.audio = this.panneau.contenu.audio
			}
			if (this.panneau.contenu.hasOwnProperty('type')) {
				this.type = this.panneau.contenu.type
			}
			this.vitesse = this.panneau.contenu.vitesse
		}
		this.genererOptions('audio')
	},
	mounted () {
		this.initialiser()
		this.positionner()
		this.chargement = false
		if (this.mode === 'edition' && this.statut !== 'min' && this.audio === '') {
			this.$nextTick(function () {
				document.querySelector('#' + this.id + ' input[type="search"]').focus()
			}.bind(this))
		} else if (this.mode === 'lecture') {
			this.$nextTick(function () {
				const audio = document.querySelector('#' + this.id + ' audio')
				audio.playbackRate = this.vitesse
				audio.preservesPitch = true
			}.bind(this))
		}
	},
	methods: {
		valider () {
			if (this.verifierURL(this.audio) === true) {
				this.mode = 'vitesse'
				this.w = 40
				this.h = 24
				this.positionner()
			}
		},
		generer () {
			this.mode = 'lecture'
			if (this.type === 'lecteur') {
				this.w = 40
				this.h = 12
			} else {
				this.w = 21
				this.h = 14
			}
			if (this.donnees.x > 0 && this.donnees.y > 0) {
				this.x = this.donnees.x
				this.y = this.donnees.y
			}
			this.positionner()
			this.$nextTick(function () {
				const audio = document.querySelector('#' + this.id + ' audio')
				audio.playbackRate = this.vitesse
				audio.preservesPitch = true
				if (this.type === 'bouton') {
					audio.addEventListener('ended', function () {
						this.lecture = false
					}.bind(this))
				}
			}.bind(this))
		},
		editer () {
			this.mode = 'vitesse'
			this.lecture = false
			this.donnees.x = this.x
			this.donnees.y = this.y
			this.w = 40
			this.h = 24
			this.positionner()
		},
		modifierVitesse (event) {
			const vitesse = event.target.value
			document.querySelector('#' + this.id + ' audio').playbackRate = vitesse
			this.vitesse = vitesse
		},
		televerserAudio (event) {
			const fichier = event.target.files[0]
			if (fichier) {
				this.chargementAudio = true
				const reader = new FileReader()
				reader.readAsDataURL(fichier)
				reader.onloadend = function (e) {
					this.chargementAudio = false
					this.dataURL = e.target.result
					this.audio = window.URL.createObjectURL(fichier)
					this.mode = 'vitesse'
					this.w = 40
					this.h = 24
					this.positionner()
				}.bind(this)
			}
		},
		lireAudio () {
			const audio = document.querySelector('#' + this.id + ' audio')
			if (this.lecture === false) {
				audio.play()
				this.lecture = true
			} else {
				audio.pause()
				this.lecture = false
			}
		},
		relireAudio () {
			const audio = document.querySelector('#' + this.id + ' audio')
			audio.pause()
			audio.currentTime = 0
			audio.play()
			this.lecture = true
		}
	}
}
</script>

<style>
.panneau .panneau-audio audio {
	width: 100%;
	outline: none;
}

.panneau .panneau-audio audio.masque {
	display: none;
}

.panneau .panneau-audio audio + label {
	margin-top: 2rem;
}

.panneau .panneau-audio .valider {
	display: flex;
}

.panneau .panneau-audio .valider .bouton-secondaire {
    width: auto!important;
    margin-left: 0.5rem;
    height: 4rem!important;
}

.panneau .panneau-audio .conteneur-chargement {
	font-size: 0;
	line-height: 1;
	text-align: center;
}

.panneau .panneau-audio .conteneur-chargement {
	font-size: 0;
	line-height: 1;
	text-align: center;
}

.panneau .panneau-audio .chargement {
	display: inline-block;
	border: 7px solid #ddd;
	border-top: 7px solid #00ced1;
	border-radius: 50%;
	width: 45px;
	height: 45px;
	animation: rotation 0.7s linear infinite;
}

.panneau .panneau-audio .separateur {
    position: relative;
    margin: 2rem 25% 2rem;
    text-align: center;
    width: 50%;
}

.panneau .panneau-audio .separateur::before {
    position: absolute;
    top: 50%;
    display: block;
    content: '';
    width: 100%;
    height: 1px;
    background-color: #ddd;
}

.panneau .panneau-audio .separateur span {
    position: relative;
    margin: 0;
    font-size: 1.5rem;
    z-index: 2;
    display: inline-block;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    vertical-align: middle;
    background-color: #fff;
}

.panneau .panneau-audio label.bouton {
	width: auto!important;
    display: inline-block!important;
	margin-top: 0;
	margin-bottom: 0!important;
}

.panneau .panneau-audio .vitesse + .bouton {
	margin-top: 0;
}

.panneau .panneau-audio .choix {
	margin-bottom: 2rem;
}

.panneau .panneau-audio .choix label {
	display: inline-block;
	width: auto;
	font-size: 1.6rem;
	font-weight: 400;
    margin-left: 1rem;
	margin-bottom: 0;
}

.panneau .panneau-audio .lecteur-audio {
	margin-right: 2.5rem;
}

.panneau .panneau-audio .contenu.lecture-audio {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.panneau .panneau-audio .contenu.lecture-audio .bouton-secondaire {
	width: 4rem;
}

.panneau .panneau-audio .bouton.audio {
	height: 6.4rem;
	line-height: 6.4rem;
	padding: 0 3rem;
	margin-top: 0;
}

.panneau .panneau-audio .bouton.audio i {
	font-size: 4.8rem;
}
</style>
