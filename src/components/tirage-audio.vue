<template>
	<JsPanel class="panneau" :visible="!chargement" :options="options">
		<div class="conteneur-gauche" />
		<div class="conteneur panneau-tirage-audio">
			<div class="contenu" v-if="mode === 'edition'">
				<label>{{ $t('texteTirageAudio') }}</label>
				<div class="zone" @dragover.prevent @drop.prevent>
					<input :id="'selectionner-audios-' + id" type="file" multiple accept="audio/*" @change="selectionnerAudios" style="display: none;">
					<label :for="'selectionner-audios-' + id" @drop="glisserAudios">{{ $t('selectionnerAudios') }}</label>
				</div>
				<div class="audios">
					<div class="audio" v-for="(audio, index) in audios" :key="'audio_' + index">
						<span class="item" :class="{'lecture': lecture === audio.id}" role="button" tabindex="0" @click="lireAudio(audio.donnees, audio.id)"><i class="material-icons">play_arrow</i></span>
						<span class="fermer" @click="supprimerAudio(index, audio.id)"><i class="material-icons">highlight_off</i></span>
					</div>
				</div>
				<label>{{ $t('supprimerItemTirage') }}</label>
				<div class="choix">
					<span class="oui">
						<input type="radio" :id="'choix_oui_' + id" :name="'choix_' + id" value="oui" :checked="suppression === 'oui'" @change="suppression = $event.target.value">
						<label :for="'choix_oui_' + id">{{ $t('oui') }}</label>
					</span>
					<span class="non">
						<input type="radio" :id="'choix_non_' + id" :name="'choix_' + id" value="non" :checked="suppression === 'non'" @change="suppression = $event.target.value">
						<label :for="'choix_non_' + id">{{ $t('non') }}</label>
					</span>
				</div>
				<span class="bouton" role="button" tabindex="0" @click="generer">{{ $t('valider') }}</span>
			</div>
			<div class="contenu lecture" v-else>
				<div class="tirage" v-if="tirage !== 'tirage' && !tirageEnCours">
					<span class="item" :class="{'lecture': lecture === tirage.id}" role="button" tabindex="0" @click="lireAudioTirage(tirage.id)"><i class="material-icons">play_arrow</i></span>
					<audio controls :src="audio"></audio>
				</div>
				<div class="tirage" v-else-if="tirage !== 'tirage' && tirageEnCours">
					<div class="point" />
				</div>
				<div class="tirage texte" :class="{'plein-ecran': statut === 'max'}" v-else>
					✨✨✨
				</div>
				<div class="actions">
					<span class="bouton" role="button" tabindex="0" @click="tirer" v-if="items.length > 1">{{ $t('tirer') }}</span>
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
	name: 'PTirageAudio',
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
			minh: 20,
			statut: '',
			dimensions: {},
			position: {},
			donnees: { w: 0, h: 0, x: 0, y: 0 },
			audios: [],
			audio: '',
			lecture: '',
			items: [],
			tirage: '',
			zone: false,
			suppression: 'non',
			tirageEnCours: false
		}
	},
	watch: {
		export: function (valeur) {
			if (valeur === true) {
				this.position = { x: this.x, y: this.y }
				this.$emit('export', { id: this.id, titre: this.titre, mode: this.mode, statut: this.statut, dimensions: this.dimensions, position: this.position, contenu: { audios: this.audios, suppression: this.suppression }, w: this.w, h: this.h, x: this.x, y: this.y })
			}
		}
	},
	created () {
		this.definirCaracteristiques('tirageSortAudio')
		if (this.panneau.contenu !== '') {
			this.audios = this.panneau.contenu.audios
			this.suppression = this.panneau.contenu.suppression
		}
		if (this.mode === 'lecture' && this.audios.length > 0) {
			this.redimensionnement = true
			this.creer()
		}
		this.genererOptions('tirage-audio')
	},
	mounted () {
		this.initialiser()
		this.positionner()
		this.chargement = false
	},
	methods: {
		generer () {
			if (this.audios.length > 1) {
				this.mode = 'lecture'
				this.redimensionnement = true
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
				this.creer()
			}
		},
		creer () {
			let items = JSON.parse(JSON.stringify(this.audios))
			items = items.filter((item, i, ar) => ar.indexOf(item) === i)
			items = this.melanger(items)
			this.items = items
			this.tirage = 'tirage'
		},
		tirer () {
			if (this.suppression === 'oui') {
				this.items.forEach(function (item, index) {
					if (item === this.tirage) {
						this.items.splice(index, 1)
					}
				}.bind(this))
			}
			const tirageEnCours = setInterval(function () {
				let tirage = this.items[Math.floor(Math.random() * this.items.length)]
				this.tirage = tirage
				this.tirageEnCours = true
			}.bind(this), 70)
			setTimeout(function () {
				clearInterval(tirageEnCours)
				this.tirageEnCours = false
				const blob = this.convertirDataURL(this.tirage.donnees)
				const audio = window.URL.createObjectURL(blob)
				this.audio = audio
				this.$nextTick(function () {
					const lecteur = document.querySelector('.tirage audio')
					lecteur.onplay = function () {
						this.lecture = this.tirage.id
					}.bind(this)
					lecteur.onpause = function () {
						this.lecture = ''
					}.bind(this)
					lecteur.onended = function () {
						this.lecture = ''
					}.bind(this)
				}.bind(this))
			}.bind(this), 1500)
		},
		editer () {
			this.mode = 'edition'
			this.redimensionnement = false
			this.donnees.w = this.w
			this.donnees.h = this.h
			this.donnees.x = this.x
			this.donnees.y = this.y
			this.w = 60
			this.h = 40
			this.positionner()
		},
		selectionnerAudios (event) {
			for (let i = 0; i < event.target.files.length; i++) {
				const reader = new FileReader()
				reader.readAsDataURL(event.target.files[i])
				reader.onloadend = function (e) {
					const id = this.genererId()
					this.audios.push({ id: id, donnees: e.target.result })
				}.bind(this)
			}
		},
		glisserAudios (event) {
			for (let i = 0; i < event.dataTransfer.files.length; i++) {
				const reader = new FileReader()
				reader.readAsDataURL(event.dataTransfer.files[i])
				reader.onloadend = function (e) {
					const id = this.genererId()
					this.audios.push({ id: id, donnees: e.target.result })
				}.bind(this)
			}
		},
		lireAudio (donnees, id) {
			if (this.lecture === id && this.audio !== '') {
				this.audio.pause()
				this.audio.currentTime = 0
				this.lecture = ''
			} else {
				const blob = this.convertirDataURL(donnees)
				const audio = window.URL.createObjectURL(blob)
				if (this.audio !== '') {
					this.audio.pause()
					this.audio.currentTime = 0
					this.lecture = ''
				}
				this.audio = new Audio(audio)
				this.audio.play()
				this.lecture = id
				this.audio.onended = function () {
					this.audio = ''
					this.lecture = ''
				}
			}
		},
		lireAudioTirage (id) {
			const lecteur = document.querySelector('.tirage audio')
			if (this.lecture === id) {
				lecteur.pause()
				this.lecture = ''
			} else {
				lecteur.play()
				this.lecture = id
			}
		},
		supprimerAudio (index, id) {
			if (this.audio !== '') {
				this.audio.pause()
				this.audio.currentTime = 0
			}
			if (this.lecture === id) {
				this.lecture = ''
			}
			this.audios.splice(index, 1)
		},
		genererId () {
			let id = ''
			const caracteres = 'abcdefghijklmnopqrstuvwxyz0123456789'
			for ( var i = 0; i < 8; i++ ) {
				id += caracteres.charAt(Math.floor(Math.random() * 36))
			}
			return id
		}
	}
}
</script>

<style>
.panneau .panneau-tirage-audio .contenu.lecture {
	width: 100%;
	height: 100%;
}

.panneau .panneau-tirage-audio .zone {
	height: 7rem;
	border: 2px dashed #00ced1;
	cursor: pointer;
}

.panneau .panneau-tirage-audio .zone label {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100%;
	font-weight: 700;
	font-size: 1.4rem;
	text-transform: uppercase;
	margin-bottom: 0;
}

.panneau .panneau-tirage-audio .audios {
	display: flex;
	justify-content: flex-start;
	align-items: center;
	flex-wrap: wrap;
	padding: 1rem;
}

.panneau .panneau-tirage-audio .audios .audio {
	position: relative;
	margin: 1rem;
	padding: 0.5rem;
	border: 1px solid #ddd;
	cursor: pointer;
	user-select: none;
}

.panneau .panneau-tirage-audio .audios .audio .item {
	font-size: 4.8rem;
	line-height: 1;
}

.panneau .panneau-tirage-audio .audios .audio .item.lecture {
	color: #00ced1;
}

.panneau .panneau-tirage-audio .audios .audio .fermer {
	position: absolute;
	top: -1.1rem;
	right: -1.1rem;
	font-size: 2.2rem;
	color: #777;
	background: #fff;
	border-radius: 50%;
	line-height: 1;
	cursor: pointer;
	user-select: none;
}

.panneau .panneau-tirage-audio .oui {
	margin-right: 2.5rem;
}

.panneau .panneau-tirage-audio .choix label {
	display: inline-block;
	width: auto;
	font-size: 1.6rem;
	font-weight: 400;
    margin-left: 1rem;
	margin-bottom: 0;
}

.panneau .panneau-tirage-audio div.tirage {
    display: flex;
    justify-content: center;
	align-items: center;
	flex-wrap: wrap;
	width: 100%;
	height: calc(100% - 6rem);
	background: #fff;
}

.panneau .panneau-tirage-audio div.tirage.texte {
	display: flex;
    justify-content: center;
	align-items: center;
	font-size: 5rem;
	font-weight: 400;
}

.panneau .panneau-tirage-audio div.tirage.texte.plein-ecran {
	font-size: 7.5rem;
}

.panneau .panneau-tirage-audio div.tirage .item {
	font-size: 14.4rem;
	align-self: center;
	border: 0.7rem solid;
	border-radius: 50%;
	line-height: 1;
	cursor: pointer;
	user-select: none;
}

.panneau .panneau-tirage-audio div.tirage .item.lecture {
	color: #00ced1;
}

.panneau .panneau-tirage-audio div.tirage audio {
	width: 100%;
}

.panneau .panneau-tirage-audio .point {
	position: relative;
	left: -9999px;
	width: 10rem;
	height: 10rem;
	border-radius: 5rem;
	background-color: #00ced1;
	color: #00ced1;
	box-shadow: 9999px 0 0 -15px;
	animation: pulse 0.25s infinite linear;
	animation-delay: 0s;
}

@keyframes pulse {
	0% {
		box-shadow: 9999px 0 0 -15px;
	}
	30% {
		box-shadow: 9999px 0 0 6px;
	}
	60%, 100% {
		box-shadow: 9999px 0 0 -15px;
	}
}
</style>
