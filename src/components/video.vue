<template>
	<JsPanel class="panneau" :visible="!chargement" :options="options">
		<div class="conteneur-gauche" />
		<div class="conteneur panneau-video">
			<div class="contenu" v-if="mode === 'edition' && !chargementVideo">
				<label>{{ $t('lienVideo') }}</label>
				<div class="valider">
					<input type="search" :value="lien" @input="lien = $event.target.value" @keydown.enter="valider">
					<span role="button" tabindex="0" :title="$t('valider')" class="bouton-secondaire" @click="valider"><i class="material-icons">search</i></span>
				</div>
				<div class="separateur"><span>{{ $t('ou') }}</span></div>
				<label>{{ $t('fichierAppareil') }}</label>
				<label class="bouton" role="button" tabindex="0" :for="'selectionner-video-' + id">{{ $t('selectionnerVideo') }}</label>
				<input :id="'selectionner-video-' + id" type="file" @change="televerserVideo" style="display: none" accept=".mp4, .m4v, .ogv">
			</div>
			<div class="contenu" v-else-if="mode === 'edition' && chargementVideo">
				<div class="conteneur-chargement">
					<div class="chargement" />
				</div>
			</div>
			<div class="contenu" v-else-if="mode === 'decoupage'">
				<div class="video">
					<iframe :src="'https://www.youtube-nocookie.com/embed/' + videoId + '?iv_load_policy=3&modestbranding=1&rel=0&showinfo=0&version=3'" allowfullscreen frameborder="0" v-if="debut === 0 && fin === 0" />
					<iframe :src="'https://www.youtube-nocookie.com/embed/' + videoId + '?start=' + debut + '&end=' + fin + '&iv_load_policy=3&modestbranding=1&rel=0&showinfo=0&version=3'" allowfullscreen frameborder="0" v-else-if="debut > 0 && fin > 0" />
					<iframe :src="'https://www.youtube-nocookie.com/embed/' + videoId + '?start=' + debut + '&iv_load_policy=3&modestbranding=1&rel=0&showinfo=0&version=3'" allowfullscreen frameborder="0" v-else-if="debut > 0" />
					<iframe :src="'https://www.youtube-nocookie.com/embed/' + videoId + '?end=' + fin + '&iv_load_policy=3&modestbranding=1&rel=0&showinfo=0&version=3'" allowfullscreen frameborder="0" v-else />
				</div>
				<div class="temps">
					<div class="debut">
						<label>{{ $t('debut') }}</label>
						<div class="minutes-secondes">
							<div class="minutes">
								<label>{{ $t('min') }}</label>
								<input type="number" :value="debutMinutes" :min="0" @input="debutMinutes = $event.target.value">
							</div>
							<div class="secondes">
								<label>{{ $t('sec') }}</label>
								<input type="number" :value="debutSecondes" :min="0" :max="59" @input="debutSecondes = $event.target.value">
							</div>
						</div>
					</div>
					<div class="fin">
						<label>{{ $t('fin') }}</label>
						<div class="minutes-secondes">
							<div class="minutes">
								<label>{{ $t('min') }}</label>
								<input type="number" :value="finMinutes" :min="0" @input="finMinutes = $event.target.value">
							</div>
							<div class="secondes">
								<label>{{ $t('min') }}</label>
								<input type="number" :value="finSecondes" :min="0" :max="59" @input="finSecondes = $event.target.value">
							</div>
						</div>
					</div>
				</div>
				<div class="actions">
					<span class="bouton" role="button" tabindex="0" @click="decouper">{{ $t('apercu') }}</span>
					<span class="bouton" role="button" tabindex="0" @click="generer">{{ $t('valider') }}</span>
				</div>
			</div>
			<template v-else-if="mode === 'lecture' && videoId !== ''">
				<iframe :src="'https://www.youtube-nocookie.com/embed/' + videoId + '?iv_load_policy=3&modestbranding=1&rel=0&showinfo=0&version=3'" allowfullscreen frameborder="0" v-if="debut === 0 && fin === 0" />
				<iframe :src="'https://www.youtube-nocookie.com/embed/' + videoId + '?start=' + debut + '&end=' + fin + '&iv_load_policy=3&modestbranding=1&rel=0&showinfo=0&version=3'" allowfullscreen frameborder="0" v-else-if="debut > 0 && fin > 0" />
				<iframe :src="'https://www.youtube-nocookie.com/embed/' + videoId + '?start=' + debut + '&iv_load_policy=3&modestbranding=1&rel=0&showinfo=0&version=3'" allowfullscreen frameborder="0" v-else-if="debut > 0" />
				<iframe :src="'https://www.youtube-nocookie.com/embed/' + videoId + '?end=' + fin + '&iv_load_policy=3&modestbranding=1&rel=0&showinfo=0&version=3'" allowfullscreen frameborder="0" v-else />
			</template>
			<template v-else-if="mode === 'lecture' && videoId === '' && lien.includes('https://vimeo.com')">
				<iframe :src="'https://player.vimeo.com/video/' + lien.replace('https://vimeo.com/', '')" allowfullscreen frameborder="0" />
			</template>
			<div class="contenu videojs" v-else-if="mode === 'lecture' && videoId === '' && video !== ''">
				<video class="video-js vjs-fill vjs-big-play-centered" controls>
					<source :src="video" :type="type" />
				</video>
			</div>
		</div>
		<div class="conteneur-droite" />
		<div class="conteneur-bas" />
	</JsPanel>
</template>

<script>
import JsPanel from '@/components/jspanel.vue'
import Panneau from '@/panneau'
import videojs from 'video.js'
import fr from 'video.js/dist/lang/fr.json'
import es from 'video.js/dist/lang/es.json'
import it from 'video.js/dist/lang/it.json'
import de from 'video.js/dist/lang/de.json'
import nl from 'video.js/dist/lang/nl.json'
import hr from 'video.js/dist/lang/hr.json'
import en from 'video.js/dist/lang/en.json'

export default {
	name: 'PVideo',
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
			minh: 20,
			statut: '',
			dimensions: {},
			position: {},
			donnees: { w: 0, h: 0, x: 0, y: 0 },
			lecteur: '',
			lien: '',
			video: '',
			dataURL: '',
			type: 'video/mp4',
			googleAPIKey: '',
			videoId: '',
			debutMinutes: '',
			debutSecondes: '',
			finMinutes: '',
			finSecondes: '',
			debut: 0,
			fin: 0,
			chargementVideo: false
		}
	},
	watch: {
		export: function (valeur) {
			if (valeur === true) {
				this.position = { x: this.x, y: this.y }
				this.$emit('export', { id: this.id, titre: this.titre, mode: this.mode, statut: this.statut, dimensions: this.dimensions, position: this.position, contenu: { lien: this.lien, videoId: this.videoId, type: this.type, dataURL: this.dataURL, debutMinutes: this.debutMinutes, debutSecondes: this.debutSecondes, finMinutes: this.finMinutes, finSecondes: this.finSecondes }, w: this.w, h: this.h, x: this.x, y: this.y })
			}
		}
	},
	created () {
		if (import.meta.env.VITE_GOOGLE_API_KEY) {
			this.googleAPIKey = import.meta.env.VITE_GOOGLE_API_KEY
		}
		this.definirCaracteristiques('video')
		if (this.panneau.contenu !== '') {
			if (this.panneau.contenu.hasOwnProperty('dataURL')) {
				this.dataURL = this.panneau.contenu.dataURL
			}
			if (this.dataURL !== '') {
				const blob = this.convertirDataURL(this.dataURL)
				this.video = window.URL.createObjectURL(blob)
			} else if (this.dataURL === '' && this.panneau.contenu.hasOwnProperty('video')) {
				this.lien = this.panneau.contenu.video
			} else {
				this.lien = this.panneau.contenu.lien
			}
			this.videoId = this.panneau.contenu.videoId
			if (this.panneau.contenu.hasOwnProperty('type')) {
				this.type = this.panneau.contenu.type
			}
			this.debutMinutes = this.panneau.contenu.debutMinutes
			this.debutSecondes = this.panneau.contenu.debutSecondes
			this.finMinutes = this.panneau.contenu.finMinutes
			this.finSecondes = this.panneau.contenu.finSecondes
		}
		if (this.mode === 'lecture') {
			if (this.videoId !== '') {
				this.definirTemps()
			}
			this.redimensionnement = true
		} else if (this.mode === 'decoupage') {
			this.editer()
		}
		this.genererOptions('video')
	},
	mounted () {
		this.initialiser()
		this.positionner()
		this.chargement = false
		if (this.mode === 'lecture' && this.video !== '') {
			this.$nextTick(function () {
				this.lecteur = videojs('#' + this.id + ' .video-js', { language: this.$parent.langue, languages: { fr, es, it, de, nl, hr, en }, playbackRates: [0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4] })
			}.bind(this))
		} else if (this.mode === 'edition' && this.statut !== 'min' && this.lien === '') {
			this.$nextTick(function () {
				document.querySelector('#' + this.id + ' input').focus()
			}.bind(this))
		}
	},
	methods: {
		valider () {
			if (this.verifierURL(this.lien) === true) {
				const regexYT = /^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/
				const regexYTId = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
				if (regexYT.test(this.lien) && this.lien.match(regexYTId)) {
					this.videoId = this.lien.match(regexYTId)[2]
					if (this.googleAPIKey !== '') {
						const xhr = new XMLHttpRequest()
						xhr.onload = function () {
							if (xhr.readyState === xhr.DONE && xhr.status === 200 && xhr.response && Object.keys(xhr.response).length > 0) {
								const duree = xhr.response.items[0].contentDetails.duration
								const temps = this.convertirTemps(duree)
								let h = 0
								if (temps.h > 0) {
									h = temps.h * 60
								}
								this.debutMinutes = 0
								this.debutSecondes = 0
								this.finMinutes = temps.m + h
								this.finSecondes = temps.s
							} else {
								this.debutMinutes = 0
								this.debutSecondes = 0
								this.finMinutes = 0
								this.finSecondes = 0
							}
						}.bind(this)
						xhr.open('GET', 'https://www.googleapis.com/youtube/v3/videos?part=contentDetails&key=' + this.googleAPIKey + '&id=' + this.videoId, true)
						xhr.responseType = 'json'
						xhr.send()
					} else {
						this.debutMinutes = 0
						this.debutSecondes = 0
						this.finMinutes = 0
						this.finSecondes = 0
					}
					this.mode = 'decoupage'
					this.w = 40
					this.h = 41
					this.positionner()
				} else {
					this.type = 'video/mp4'
					this.generer()
				}
			}
		},
		decouper () {
			this.definirTemps()
		},
		generer () {
			this.mode = 'lecture'
			this.redimensionnement = true
			if (this.donnees.w > 0 && this.donnees.h > 0) {
				this.w = this.donnees.w
				this.h = this.donnees.h
			} else {
				this.w = 48
				this.h = 31.5
			}
			if (this.donnees.x > 0 && this.donnees.y > 0) {
				this.x = this.donnees.x
				this.y = this.donnees.y
			}
			if (this.videoId !== '') {
				this.definirTemps()
			} else if (this.video !== '') {
				this.$nextTick(function () {
					this.lecteur = videojs('#' + this.id + ' .video-js', { language: this.$parent.langue, languages: { fr, es, it, de, nl, hr, en }, playbackRates: [0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4] }, function onPlayerReady () {
						setTimeout(function () {
							const hauteurLecteur = document.querySelector('#' + this.id + ' .conteneur').scrollHeight
							this.h = Math.ceil(this.convertirPixels(hauteurLecteur)) + 3.5
						}.bind(this), 100)
					}.bind(this))
				}.bind(this))
			}
			this.positionner()
		},
		editer () {
			this.mode = 'decoupage'
			this.redimensionnement = false
			this.donnees.w = this.w
			this.donnees.h = this.h
			this.donnees.x = this.x
			this.donnees.y = this.y
			this.w = 40
			this.h = 41
			this.positionner()
		},
		definirTemps () {
			let debut = 0
			let fin = 0
			if ((this.debutMinutes !== '' || this.debutSecondes !== '') && (this.finMinutes === '' && this.finSecondes === '')) {
				if (this.debutMinutes !== '') {
					debut += parseInt(this.debutMinutes) * 60
				}
				if (this.debutSecondes !== '') {
					debut += parseInt(this.debutSecondes)
				}
			} else if ((this.debutMinutes === '' && this.debutSecondes === '') && (this.finMinutes !== '' || this.finSecondes !== '')) {
				if (this.finMinutes !== '') {
					fin += parseInt(this.finMinutes) * 60
				}
				if (this.finSecondes !== '') {
					fin += parseInt(this.finSecondes)
				}
			} else if ((this.debutMinutes !== '' || this.debutSecondes !== '') && (this.finMinutes !== '' || this.finSecondes !== '')) {
				if (this.debutMinutes !== '') {
					debut += parseInt(this.debutMinutes) * 60
				}
				if (this.debutSecondes !== '') {
					debut += parseInt(this.debutSecondes)
				}
				if (this.finMinutes !== '') {
					fin += parseInt(this.finMinutes) * 60
				}
				if (this.finSecondes !== '') {
					fin += parseInt(this.finSecondes)
				}
			}
			this.debut = debut
			this.fin = fin
		},
		convertirTemps (duree) {
			duree = duree.search(/PT/i) > -1 ? duree.slice(2) : duree
			let h, m, s
			let hIndex = duree.search(/h/i), mIndex = duree.search(/m/i), sIndex = duree.search(/s/i)
			let dContainsH = hIndex > -1, dContainsM = mIndex > -1, dContainsS = sIndex > -1
			h = dContainsH ? duree.slice(0, hIndex) : ''
			m = dContainsM ? duree.slice(dContainsH ? hIndex + 1 : 0, mIndex) : dContainsH ? '0' : '0'
			s = dContainsS ? duree.slice(dContainsM ? mIndex + 1 : hIndex + 1, sIndex) : '0'
			let total = 0
			if (h > 0) {
				total = total + (h * 60 * 60)
			}
			if (m > 0) {
				total = total + (m * 60)
			}
			if (s > 0) {
				total = total + s
			}
			return { h: parseInt(h), m: parseInt(m), s: parseInt(s), total: total }
		},
		televerserVideo (event) {
			const fichier = event.target.files[0]
			if (fichier) {
				this.chargementVideo = true
				const reader = new FileReader()
				reader.readAsDataURL(fichier)
				reader.onloadend = function (e) {
					this.chargementVideo = false
					this.dataURL = e.target.result
					this.video = window.URL.createObjectURL(fichier)
					this.type = fichier.type
					this.generer()
				}.bind(this)
			}
		},
		convertirPixels (valeur) {
			const taille = window.getComputedStyle(document.querySelector('html'), null).getPropertyValue('font-size')
			return valeur / parseFloat(taille)
		}
	}
}
</script>

<style>
.panneau .panneau-video .videojs {
	height: 100%;
}

.panneau .panneau-video .temps {
	margin-top: 2rem;
}

.panneau .panneau-video .debut,
.panneau .panneau-video .fin {
    display: inline-flex;
	justify-content: center;
	width: 50%;
	flex-wrap: wrap;
}

.panneau .panneau-video .temps .minutes-secondes {
    display: flex;
}

.panneau .panneau-video .temps .minutes {
    margin-right: 1rem;
}

.panneau .panneau-video .valider {
	display: flex;
}

.panneau .panneau-video .valider .bouton-secondaire {
    width: auto!important;
    margin-left: 0.5rem;
    height: 4rem!important;
}

.panneau .panneau-video .conteneur-chargement {
	font-size: 0;
	line-height: 1;
	text-align: center;
}

.panneau .panneau-video .conteneur-chargement {
	font-size: 0;
	line-height: 1;
	text-align: center;
}

.panneau .panneau-video .chargement {
	display: inline-block;
	border: 7px solid #ddd;
	border-top: 7px solid #00ced1;
	border-radius: 50%;
	width: 45px;
	height: 45px;
	animation: rotation 0.7s linear infinite;
}

.panneau .panneau-video .separateur {
    position: relative;
    margin: 2rem 25% 2rem;
    text-align: center;
    width: 50%;
}

.panneau .panneau-video .separateur::before {
    position: absolute;
    top: 50%;
    display: block;
    content: '';
    width: 100%;
    height: 1px;
    background-color: #ddd;
}

.panneau .panneau-video .separateur span {
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

.panneau .panneau-video label.bouton {
	width: auto!important;
    display: inline-block!important;
	margin-top: 0;
	margin-bottom: 0!important;
}

.panneau .panneau-video video {
	width: 100%;
	max-width: 100%;
	height: 100%;
	max-height: 100%;
}
</style>
