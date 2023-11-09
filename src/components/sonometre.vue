<template>
	<JsPanel class="panneau" :visible="!chargement" :options="options">
		<div class="conteneur-gauche" />
		<div class="conteneur panneau-sonometre">
			<div class="contenu">
				<div class="volume">
					<span class="vert" :style="{'width': volume + '%'}" v-if="volume < sensibilite" />
					<span class="rouge" :style="{'width': volume + '%'}" v-else />
				</div>
				<label>{{ $t('sensibilite') }}</label>
				<div class="sensibilite">
					<span @click="modifierSensibilite(98)" :class="{'selectionne': sensibilite === 98 }">1</span>
					<span @click="modifierSensibilite(88)" :class="{'selectionne': sensibilite === 88 }">2</span>
					<span @click="modifierSensibilite(78)" :class="{'selectionne': sensibilite === 78 }">3</span>
					<span @click="modifierSensibilite(68)" :class="{'selectionne': sensibilite === 68 }">4</span>
					<span @click="modifierSensibilite(58)" :class="{'selectionne': sensibilite === 58 }">5</span>
					<span @click="modifierSensibilite(48)" :class="{'selectionne': sensibilite === 48 }">6</span>
					<span @click="modifierSensibilite(38)" :class="{'selectionne': sensibilite === 38 }">7</span>
				</div>
				<div class="actions">
					<span class="bouton" role="button" tabindex="0" @click="demarrer" v-if="verificationVolume === ''">{{ $t('demarrer') }}</span>
					<span class="bouton" role="button" tabindex="0" @click="pause" v-else>{{ $t('pause') }}</span>
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
	name: 'PSonometre',
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
			minh: 24,
			statut: '',
			dimensions: {},
			position: {},
			contexteAudio: '',
			sourceAudio: '',
			analyseur: '',
			volumes: [],
			volume: 0,
			sensibilite: 98,
			verificationVolume: ''
		}
	},
	watch: {
		export: function (valeur) {
			if (valeur === true) {
				this.position = { x: this.x, y: this.y }
				this.$emit('export', { id: this.id, titre: this.titre, statut: this.statut, dimensions: this.dimensions, position: this.position, contenu: '', w: this.w, h: this.h, x: this.x, y: this.y })
			}
		},
		volume: function (valeur) {
			if (valeur >= this.sensibilite) {
				this.$parent.audio.src = './static/audio/cloche.mp3'
				this.$parent.audio.play()
			}
		}
	},
	created () {
		this.definirCaracteristiques('sonometre')
		this.genererOptions('sonometre')
	},
	mounted () {
		this.initialiser()
		this.positionner()
		this.chargement = false
	},
	methods: {
		modifierSensibilite (sensibilite) {
			this.sensibilite = sensibilite
		},
		demarrer () {
			if (this.verificationVolume === '') {
				navigator.mediaDevices.getUserMedia({ audio: true }).then(function (fluxAudio) {
					this.genererFlux(fluxAudio)
					if (this.volumes.length > 0) {
						this.verificationVolume = setInterval(this.dessinerFlux, 100)
					} else {
						alert(this.$t('erreurSonometre'))
					}
				}.bind(this)).catch(function () {
					alert(this.$t('erreurSonometre'))
				}.bind(this))
			}
		},
		pause () {
			if (this.verificationVolume !== '') {
				clearInterval(this.verificationVolume)
				this.verificationVolume = ''
			}
		},
		genererFlux (fluxAudio) {
			this.contexteAudio = new AudioContext()
			this.sourceAudio = this.contexteAudio.createMediaStreamSource(fluxAudio)
			this.analyseur = this.contexteAudio.createAnalyser()
			this.analyseur.fftSize = 512
			this.analyseur.minDecibels = -127
			this.analyseur.maxDecibels = 0
			this.analyseur.smoothingTimeConstant = 0.4
			this.sourceAudio.connect(this.analyseur)
			this.volumes = new Uint8Array(this.analyseur.frequencyBinCount)
		},
		dessinerFlux () {
			this.analyseur.getByteFrequencyData(this.volumes)
			let additionVolume = 0
			for (const volume of this.volumes) {
				additionVolume += volume
			}
			const volumeMoyen = additionVolume / this.volumes.length
			this.volume = (volumeMoyen * 100) / 127
		}
	}
}
</script>

<style>
.panneau .panneau-sonometre .volume {
	border: 1px solid #ddd;
	width: 100%;
	height: 3rem;
	margin-bottom: 2rem;
}

.panneau .panneau-sonometre .volume span {
	display: block;
	max-width: 100%;
	height: 100%;
	transition: width 100ms linear;
}

.panneau .panneau-sonometre .volume span.vert {
	background: #00b894;
}

.panneau .panneau-sonometre .volume span.rouge {
	background: #ff7575;
}

.panneau .panneau-sonometre .sensibilite {
	display: flex;
	justify-content: center;
}

.panneau .panneau-sonometre .sensibilite span {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 3.2rem;
	height: 3.2rem;
	margin-right: 1rem;
	font-size: 1.7rem;
	border-radius: 50%;
	background: #00ced1;
	color: #001d1d;
	cursor: pointer;
}

.panneau .panneau-sonometre .sensibilite span.selectionne {
	background: #444;
	color: #fff;
}

.panneau .panneau-sonometre .sensibilite span:last-child {
	margin-right: 0;
}
</style>
