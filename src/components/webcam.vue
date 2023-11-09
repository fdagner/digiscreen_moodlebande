<template>
	<JsPanel class="panneau" :visible="!chargement" :options="options">
		<div class="conteneur-gauche" />
		<div class="conteneur panneau-webcam">
			<div class="contenu" v-if="mode === 'edition'">
				<label>{{ $t('webcam') }}</label>
				<div class="webcam">
					<select @change="webcam = $event.target.value">
						<option :selected="webcam === ''" value="">--</option>
						<option v-for="(item, index) in webcams" :selected="webcam === definirWebcam(item)" :value="definirWebcam(item)" :key="'webcam_' + index">{{ definirWebcam(item) }}</option>
					</select>
				</div>
				<div class="actions">
					<span class="bouton" role="button" tabindex="0" @click="generer">{{ $t('valider') }}</span>
				</div>
			</div>
			<div class="contenu" v-else>
				<video :id="'video-' + id" controls autoplay />
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
	name: 'PWebcam',
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
			ws: 0,
			hs: 0,
			x: 0,
			y: 0,
			minw: 40,
			minh: 16,
			statut: '',
			dimensions: {},
			position: {},
			donnees: { w: 0, h: 0, x: 0, y: 0 },
			webcams: [],
			webcam: ''
		}
	},
	watch: {
		export: function (valeur) {
			if (valeur === true) {
				this.position = { x: this.x, y: this.y }
				this.$emit('export', { id: this.id, titre: this.titre, mode: this.mode, statut: this.statut, dimensions: this.dimensions, position: this.position, contenu: { webcam: this.webcam }, w: this.w, h: this.h, x: this.x, y: this.y })
			}
		}
	},
	created () {
		this.definirCaracteristiques('webcam')
		if (this.panneau.contenu !== '') {
			this.webcam = this.panneau.contenu.webcam
		}
		if (this.mode === 'lecture') {
			this.redimensionnement = true
		}
		this.genererOptions('webcam')
	},
	mounted () {
		this.initialiser()
		this.positionner()
		this.chargement = false
		if (!navigator.mediaDevices || !navigator.mediaDevices?.enumerateDevices) {
			alert(this.$t('navigateurNonSupporte'))
		} else {
			navigator.mediaDevices.enumerateDevices().then(function (devices) {
				for (const device of devices) {
					if (device.kind === 'videoinput') {
						this.webcams.push(device)
					}
				}
			}.bind(this))
		}
		if (this.webcam !== '') {
			let webcamExiste = false
			this.webcams.forEach(function (webcam) {
				if (webcam.label === this.webcam || webcam.deviceId === this.webcam) {
					webcamExiste = true
				}
			}.bind(this))
			if (webcamExiste === false) {
				this.webcam = ''
				this.editer()
			}
		}
	},
	methods: {
		generer () {
			if (this.webcam !== '') {
				if (!navigator.mediaDevices?.getUserMedia) {
					alert(this.$t('navigateurNonSupporte'))
					return false
				} else {
					navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(function (flux) {
						this.$nextTick(function () {
							document.querySelector('#video-' + this.id).srcObject = flux
						}.bind(this))
					}.bind(this))
				}
			} else {
				alert(this.$t('aucuneEntreeVideo'))
				return false
			}
			this.mode = 'lecture'
			this.redimensionnement = true
			if (this.donnees.w > 0 && this.donnees.h > 0) {
				this.w = this.donnees.w
				this.h = this.donnees.h
			} else {
				this.w = 48
				this.h = 41
			}
			if (this.donnees.x > 0 && this.donnees.y > 0) {
				this.x = this.donnees.x
				this.y = this.donnees.y
			}
			this.positionner()
		},
		editer () {
			this.mode = 'edition'
			this.redimensionnement = false
			this.donnees.w = this.w
			this.donnees.h = this.h
			this.donnees.x = this.x
			this.donnees.y = this.y
			this.w = 40
			this.h = 16
			this.positionner()
		},
		definirWebcam (webcam) {
			if (webcam.label !== '') {
				return webcam.label
			} else {
				return webcam.deviceId
			}
		}
	}
}
</script>

<style>
.panneau .panneau-webcam .contenu {
	width: 100%;
	height: 100%;
	font-size: 0;
}

.panneau .panneau-webcam video {
	width: auto;
	height: 100%;
	max-width: 100%;
}
</style>
