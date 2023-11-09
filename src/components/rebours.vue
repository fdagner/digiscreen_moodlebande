<template>
	<JsPanel class="panneau" :visible="!chargement" :options="options">
		<div class="conteneur-gauche" />
		<div class="conteneur panneau-rebours">
			<div class="contenu" v-if="mode === 'edition'">
				<div class="rebours edition">
					<div class="heures" v-if="affichageHeures === 'oui'">
						<label>{{ $t('heures') }}</label>
						<input type="number" :value="heures" :min="0" :max="23" @input="heures = $event.target.value">
					</div>
					<div class="minutes">
						<label>{{ $t('minutes') }}</label>
						<input type="number" :value="minutes" :min="0" @input="minutes = $event.target.value">
					</div>
					<div class="secondes">
						<label>{{ $t('secondes') }}</label>
						<input type="number" :value="secondes" :min="0" :max="59" @input="secondes = $event.target.value">
					</div>
				</div>
				<div class="options">
					<div class="conteneur-affichage-heures">
						<label>{{ $t('afficherHeures') }}</label>
						<div class="affichage-heures" >
							<span class="oui">
								<input type="radio" :id="'heures_oui_' + id" :name="'heures_oui_' + id" value="oui" :checked="affichageHeures === 'oui'" @change="modifierAffichageHeures($event.target.value)">
								<label :for="'heures_oui_' + id">{{ $t('oui') }}</label>
							</span>
							<span class="non">
								<input type="radio" :id="'heures_non_' + id" :name="'heures_oui_' + id" value="non" :checked="affichageHeures === 'non'" @change="modifierAffichageHeures($event.target.value)">
								<label :for="'heures_non_' + id">{{ $t('non') }}</label>
							</span>
						</div>
					</div>
					<div class="conteneur-affichage-cercle">
						<label>{{ $t('afficherDecompteVisuel') }}</label>
						<div class="affichage-cercle" >
							<span class="oui">
								<input type="radio" :id="'cercle_oui_' + id" :name="'cercle_oui_' + id" value="oui" :checked="affichageCercle === 'oui'" @change="modifierAffichageCercle($event.target.value)">
								<label :for="'cercle_oui_' + id">{{ $t('oui') }}</label>
							</span>
							<span class="non">
								<input type="radio" :id="'cercle_non_' + id" :name="'cercle_oui_' + id" value="non" :checked="affichageCercle === 'non'" @change="modifierAffichageCercle($event.target.value)">
								<label :for="'cercle_non_' + id">{{ $t('non') }}</label>
							</span>
						</div>
					</div>
					<div class="conteneur-activation-effets-sonores">
						<label>{{ $t('activerEffetsSonores') }}</label>
						<div class="effets-sonores">
							<span class="oui">
								<input type="radio" :id="'son_oui_' + id" :name="'son_' + id" value="oui" :checked="effetsSonores === 'oui'" @change="effetsSonores = $event.target.value">
								<label :for="'son_oui_' + id">{{ $t('oui') }}</label>
							</span>
							<span class="non">
								<input type="radio" :id="'son_non_' + id" :name="'son_' + id" value="non" :checked="effetsSonores === 'non'" @change="effetsSonores = $event.target.value">
								<label :for="'son_non_' + id">{{ $t('non') }}</label>
							</span>
						</div>
					</div>
				</div>
				<div class="actions">
					<span class="bouton" role="button" tabindex="0" @click="generer">{{ $t('valider') }}</span>
				</div>
			</div>
			<div class="contenu" v-else>
				<div class="rebours" :class="{'avec-cercle': affichageCercle === 'oui', 'sans-cercle': affichageCercle === 'non'}">
					<svg :height="convertirRem(42)" :width="convertirRem(42)" :class="{'actif': mode === 'decompte', 'rouge': tempsEcoule}" :style="{'animation': 'rebours ' + dureeMs + 'ms linear forwards', 'stroke-dasharray': Math.PI * 2 * convertirRem(20.2), 'stroke-dashoffset': Math.PI * 2 * convertirRem(20.2)}" v-if="affichageCercle === 'oui' && affichageHeures === 'oui' && !redimensionnementEnCours">
						<circle :cx="convertirRem(21)" :cy="convertirRem(21)" :r="convertirRem(20.2)" stroke="#00ced1" :stroke-width="convertirRem(1.6)" fill="#f9f9f9" />
					</svg>
					<svg :height="convertirRem(32)" :width="convertirRem(32)" :class="{'actif': mode === 'decompte', 'rouge': tempsEcoule}" :style="{'animation': 'rebours ' + dureeMs + 'ms linear forwards', 'stroke-dasharray': Math.PI * 2 * convertirRem(15.2), 'stroke-dashoffset': Math.PI * 2 * convertirRem(15.2)}" v-else-if="affichageCercle === 'oui' && affichageHeures === 'non' && !redimensionnementEnCours">
						<circle :cx="convertirRem(16)" :cy="convertirRem(16)" :r="convertirRem(15.2)" stroke="#00ced1" :stroke-width="convertirRem(1.6)" fill="#f9f9f9" />
					</svg>
					<div class="decompte">
						<span class="heures" v-if="affichageHeures === 'oui'">{{ texteHeures }}</span>
						<span class="separateur" v-if="affichageHeures === 'oui'">:</span>
						<span class="minutes">{{ texteMinutes }}</span>
						<span class="separateur">:</span>
						<span class="secondes">{{ texteSecondes }}</span>
					</div>
				</div>
				<div class="actions">
					<span class="bouton" role="button" tabindex="0" @click="redemarrer" v-if="!tempsEcoule && (mode === 'decompte' || mode === 'pause')"><i class="material-icons">autorenew</i></span>
					<span class="bouton danger" v-if="tempsEcoule">{{ $t('tempsEcoule') }}</span>
					<span class="bouton redemarrer" role="button" tabindex="0" @click="redemarrer" v-if="tempsEcoule && mode === 'lecture'">{{ $t('redemarrer') }}</span>
					<span class="bouton" role="button" tabindex="0" @click="demarrer(0)" v-else-if="!tempsEcoule && mode === 'lecture'">{{ $t('demarrer') }}</span>
					<span class="bouton" role="button" tabindex="0" @click="pause" v-else-if="!tempsEcoule && mode === 'decompte'"><i class="material-icons">pause</i></span>
					<span class="bouton" role="button" tabindex="0" @click="continuer" v-else-if="!tempsEcoule && mode === 'pause'"><i class="material-icons">play_arrow</i></span>
					<span class="ajouter" role="button" tabindex="0" @click="ajouter()" v-if="!tempsEcoule && (mode === 'decompte' || mode === 'pause')">{{ $t('plus1Min') }}</span>
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
	name: 'PRebours',
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
			minw: 38,
			minh: 22.2,
			statut: '',
			dimensions: {},
			position: {},
			heures: 0,
			minutes: 0,
			secondes: 0,
			texteHeures: '',
			texteMinutes: '',
			texteSecondes: '',
			duree: '',
			dureeMs: 0,
			decompte: '',
			tempsRestant: '',
			tempsEcoule: false,
			affichageHeures: 'non',
			affichageCercle: 'oui',
			effetsSonores: 'oui',
			redimensionnementEnCours: false
		}
	},
	watch: {
		export: function (valeur) {
			if (valeur === true) {
				this.position = { x: this.x, y: this.y }
				this.$emit('export', { id: this.id, titre: this.titre, mode: this.mode, statut: this.statut, dimensions: this.dimensions, position: this.position, contenu: { heures: this.heures, minutes: this.minutes, secondes: this.secondes, affichageHeures: this.affichageHeures, affichageCercle: this.affichageCercle, effetsSonores: this.effetsSonores }, w: this.w, h: this.h, x: this.x, y: this.y })
			}
		}
	},
	created () {
		this.definirCaracteristiques('compteRebours')
		if (this.panneau.contenu !== '') {
			if (this.panneau.contenu.hasOwnProperty('heures')) {
				this.heures = this.panneau.contenu.heures
			}
			this.minutes = this.panneau.contenu.minutes
			this.secondes = this.panneau.contenu.secondes
			if (this.panneau.contenu.hasOwnProperty('affichageHeures')) {
				this.affichageHeures = this.panneau.contenu.affichageHeures
			}
			if (this.panneau.contenu.hasOwnProperty('affichageCercle')) {
				this.affichageCercle = this.panneau.contenu.affichageCercle
			}
			if (this.panneau.contenu.hasOwnProperty('effetsSonores')) {
				this.effetsSonores = this.panneau.contenu.effetsSonores
			}
		}
		if (this.mode === 'lecture' || this.mode === 'decompte') {
			this.generer()
		}
		this.genererOptions('rebours')
	},
	mounted () {
		this.initialiser()
		this.positionner()
		this.chargement = false
		if (this.mode === 'edition' && this.statut !== 'min' && this.minutes === 0 && this.affichageHeures === 'non') {
			this.$nextTick(function () {
				document.querySelector('#' + this.id + ' .minutes input').focus()
			}.bind(this))
		}

		window.addEventListener('resize', function () {
			this.redimensionnementEnCours = true
			setTimeout(function () {
				this.redimensionnementEnCours = false
			}.bind(this), 10)
		}.bind(this), false)
	},
	methods: {
		generer () {
			if (this.heures >= 1 || this.minutes >= 1 || this.secondes >= 1) {
				this.mode = 'lecture'
				if (this.secondes < 10) {
					this.texteSecondes = '0' + this.secondes
				} else {
					this.texteSecondes = this.secondes
				}
				if (this.minutes < 10) {
					this.texteMinutes = '0' + this.minutes
				} else {
					this.texteMinutes = this.minutes
				}
				if (this.heures < 10) {
					this.texteHeures = '0' + this.heures
				} else {
					this.texteHeures = this.heures
				}
				this.dureeMs = (((this.heures * 3600) + (this.minutes * 60) + this.secondes) * 1000) - 1000
				if (this.affichageCercle === 'oui' && this.affichageHeures === 'oui') {
					this.w = 46
					this.h = 55
				} else if (this.affichageCercle === 'oui' && this.affichageHeures === 'non') {
					this.w = 38
					this.h = 45
				} else if (this.affichageCercle === 'non' && this.affichageHeures === 'oui') {
					this.w = 46
					this.h = 22.2
				} else if (this.affichageCercle === 'non' && this.affichageHeures === 'non') {
					this.w = 38
					this.h = 22.2
				}
				this.positionner()
			}
		},
		editer () {
			this.mode = 'edition'
			this.texteHeures = ''
			this.texteMinutes = ''
			this.texteSecondes = ''
			this.duree = ''
			this.dureeMs = 0
			this.tempsRestant = ''
			this.tempsEcoule = false
			if (this.decompte !== '') {
				clearInterval(this.decompte)
				this.decompte = ''
			}
			this.w = 42
			this.h = 32
			this.positionner()
		},
		demarrer (laps) {
			if (laps === 0) {
				const date = Date.parse(new Date())
				this.duree = new Date(date + (((parseInt(this.texteHeures) * 3600) + (parseInt(this.texteMinutes) * 60) + (parseInt(this.texteSecondes) - 1)) * 1000))
			} else {
				this.duree = laps
			}
			this.decompter()
			this.decompte = setInterval(this.decompter, 1000)
			this.mode = 'decompte'
		},
		redemarrer () {
			if (this.decompte !== '') {
				clearInterval(this.decompte)
			}
			this.tempsEcoule = false
			this.mode = 'decompte'
			if (this.secondes < 10) {
				this.texteSecondes = '0' + this.secondes
			} else {
				this.texteSecondes = this.secondes
			}
			if (this.minutes < 10) {
				this.texteMinutes = '0' + this.minutes 
			} else {
				this.texteMinutes = this.minutes 
			}
			if (this.heures < 10) {
				this.texteHeures = '0' + this.heures
			} else {
				this.texteHeures = this.heures
			}
			this.dureeMs = (((this.heures * 3600) + (this.minutes * 60) + this.secondes) * 1000)
			this.$nextTick(function () {
				if (this.affichageCercle === 'oui' && document.querySelector('#' + this.id + ' svg')) {
					document.querySelector('#' + this.id + ' svg').removeAttribute('style')
					setTimeout(function () {
						document.querySelector('#' + this.id + ' svg').style.animation = 'rebours ' + this.dureeMs + 'ms linear forwards'
						if (this.affichageHeures === 'oui') {
							document.querySelector('#' + this.id + ' svg').style.strokeDasharray = Math.PI * 2 * this.convertirRem(20.2)
							document.querySelector('#' + this.id + ' svg').style.strokeDashoffset =  Math.PI * 2 * this.convertirRem(20.2)
						} else {
							document.querySelector('#' + this.id + ' svg').style.strokeDasharray = Math.PI * 2 * this.convertirRem(15.2)
							document.querySelector('#' + this.id + ' svg').style.strokeDashoffset =  Math.PI * 2 * this.convertirRem(15.2)
						}
					}.bind(this), 10)
				}
			}.bind(this))
			setTimeout(function () {
				this.demarrer(0)
			}.bind(this), 1000)
		},
		decompter () {
			const temps = this.calculerTempsRestant(this.duree)
			if (temps.secondes < 10) {
				this.texteSecondes = '0' + temps.secondes
			} else {
				this.texteSecondes = temps.secondes
			}
			if (temps.minutes < 10) {
				this.texteMinutes = '0' + temps.minutes
			} else {
				this.texteMinutes = temps.minutes
			}
			if (temps.heures < 10) {
				this.texteHeures = '0' + temps.heures
			} else {
				this.texteHeures = temps.heures
			}
			if (this.affichageCercle === 'oui' && temps.total <= 10000 && document.querySelector('#' + this.id + ' svg')) {
				document.querySelector('#' + this.id + ' svg').classList.add('rouge')
			}
			if (temps.total <= 10000 && temps.total > 0 && this.effetsSonores === 'oui') {
				this.$parent.audio.src = './static/audio/bip.mp3'
				this.$parent.audio.play()
			}
			if (temps.total <= 0 && this.effetsSonores === 'oui') {
				clearInterval(this.decompte)
				this.tempsEcoule = true
				this.mode = 'lecture'
				this.dureeMs = 0
				this.$parent.audio.src = './static/audio/fin.mp3'
				this.$parent.audio.play()
			}
		},
		pause () {
			clearInterval(this.decompte)
			this.tempsRestant = this.calculerTempsRestant(this.duree).total
			this.mode = 'pause'
			if (this.affichageCercle === 'oui' && this.tempsRestant <= 10000 && document.querySelector('#' + this.id + ' svg')) {
				this.$nextTick(function () {
					document.querySelector('#' + this.id + ' svg').classList.add('rouge')
				}.bind(this))
			}
		},
		continuer () {
			this.duree = new Date(Date.parse(new Date()) + this.tempsRestant)
			this.demarrer(this.duree)
			this.mode = 'decompte'
			if (this.affichageCercle === 'oui' && this.tempsRestant <= 10000 && document.querySelector('#' + this.id + ' svg')) {
				this.$nextTick(function () {
					document.querySelector('#' + this.id + ' svg').classList.add('rouge')
				}.bind(this))
			}
		},
		ajouter () {
			if (this.decompte !== '') {
				clearInterval(this.decompte)
			}
			const temps = this.calculerTempsRestant(this.duree).total
			const tempsRestant = temps + 60000
			if (parseInt(this.texteMinutes) < 59) {
				this.texteMinutes = parseInt(this.texteMinutes) + 1
			} else if (parseInt(this.texteMinutes) === 59 && this.affichageHeures === 'oui') {
				this.texteMinutes = '00'
				this.texteHeures = parseInt(this.texteHeures) + 1
			}
			if (parseInt(this.texteSecondes) < 10) {
				this.texteSecondes = '0' + parseInt(this.texteSecondes)
			} else {
				this.texteSecondes = parseInt(this.texteSecondes)
			}
			if (parseInt(this.texteMinutes) < 10) {
				this.texteMinutes = '0' + parseInt(this.texteMinutes)
			} else {
				this.texteMinutes = parseInt(this.texteMinutes)
			}
			if (parseInt(this.texteHeures) < 10) {
				this.texteHeures = '0' + parseInt(this.texteHeures)
			} else {
				this.texteHeures = parseInt(this.texteHeures)
			}
			this.duree = new Date(Date.parse(new Date()) + tempsRestant)
			this.dureeMs = this.dureeMs + 61000
			if (this.affichageCercle === 'oui' && this.dureeMs > 10000 && document.querySelector('#' + this.id + ' svg')) {
				document.querySelector('#' + this.id + ' svg').classList.remove('rouge')
			}
			this.decompter()
			this.decompte = setInterval(this.decompter, 1000)
		},
		calculerTempsRestant (d) {
			const temps = Date.parse(d) - Date.parse(new Date())
			const secondes = Math.floor((temps / 1000) % 60)
			const minutes = Math.floor((temps / 1000 / 60) % 60)
			const heures = Math.floor((temps / 1000 / 3600) % 60)
			return { total: temps, heures: heures, minutes: minutes, secondes: secondes }
		},
		modifierAffichageHeures (affichage) {
			this.affichageHeures = affichage
		},
		modifierAffichageCercle (affichage) {
			this.affichageCercle = affichage
		}
	}
}
</script>

<style>
.rebours {
	position: relative;
}

.rebours.sans-cercle {
	padding: 2rem;
	border: 2px solid #ddd;
	border-radius: 3em;
}

.rebours .heures,
.rebours .minutes,
.rebours .secondes {
	display: inline-block;
}

.rebours .heures,
.rebours .minutes {
	margin-right: 2rem;
}

.rebours .decompte {
	display: flex;
	justify-content: center;
	width: 100%;
	font-family: 'Orbitron', sans-serif;
	font-size: 5rem;
	letter-spacing: 0.5rem;
	line-height: 1;
	text-align: center;
	user-select: none;
}

.rebours.avec-cercle .decompte {
	position: absolute;
	top: 50%;
	display: flex;
	justify-content: center;
	width: 100%;
	font-family: 'Orbitron', sans-serif;
	font-size: 5rem;
	letter-spacing: 0.5rem;
	line-height: 1;
	margin-top: -2.5rem;
	text-align: center;
	user-select: none;
}

.rebours .decompte span {
	display: inline-block;
	text-indent: 0.5rem;
}

.rebours .decompte .heures,
.rebours .decompte .minutes,
.rebours .decompte .secondes {
	width: 11rem;
	margin: 0;
}

.rebours .decompte.rouge {
	color: #ff7575;
}

.rebours + .actions {
	display: flex;
	justify-content: center;
	align-items: center;
}

.rebours + .actions .ajouter {
	display: inline-block;
	margin-top: 2rem;
	cursor: pointer;
	user-select: none;
}

.rebours + .actions .bouton {
	margin-right: 2rem;
}

.rebours + .actions .bouton:last-child {
	margin-right: 0;
}

.actions .bouton.danger:hover,
.actions .bouton.danger {
	color: #001d1d!important;
	background: #ff7575!important;
	cursor: default;
}

.rebours.edition + .options,
.rebours.edition + .actions {
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 2rem;
}

.rebours.edition + .options {
	flex-wrap: wrap;
}

.rebours.edition + .options .conteneur-affichage-heures {
	margin-right: 2rem;
}

.rebours.edition + .options .conteneur-activation-effets-sonores {
	margin-top: 2rem;
}

.rebours.edition + .actions .bouton {
	margin-top: 0;
}

.rebours.edition + .options .conteneur-affichage-cercle > label,
.rebours.edition + .options .conteneur-affichage-heures > label {
	margin-bottom: 0.5rem;
}

.rebours.edition + .options .affichage-cercle .oui,
.rebours.edition + .options .affichage-heures .oui,
.rebours.edition + .options .effets-sonores .oui {
	margin-right: 2rem;
}

.rebours.edition + .options .affichage-cercle label,
.rebours.edition + .options .affichage-heures label,
.rebours.edition + .options .effets-sonores label {
	display: inline-block;
    width: auto;
	font-size: 1.6rem;
	font-weight: 400;
    margin-left: 1rem;
	margin-bottom: 0;
}

.rebours svg {
	transform: rotate(90deg) scale(-1, 1);
	animation-play-state: paused!important;
}

.rebours svg.actif {
	animation-play-state: running!important;
}

.rebours svg.rouge circle {
	stroke: #ff7575!important;
}

@keyframes rebours {
	to {
		stroke-dashoffset: 0;
	}
}
</style>
