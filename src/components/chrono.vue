<template>
	<JsPanel class="panneau" :visible="!chargement" :options="options">
		<div class="conteneur-gauche" />
		<div class="conteneur panneau-chrono">
			<div class="contenu">
				<div class="chrono">
					<span class="heures" v-if="affichageHeures === 'oui'">{{ texteHeures }}</span>
					<span class="separateur" v-if="affichageHeures === 'oui'">:</span>
					<span class="minutes">{{ texteMinutes }}</span>
					<span class="separateur">:</span>
					<span class="secondes">{{ texteSecondes }}</span>
					<span class="separateur" v-if="affichageMillisecondes === 'oui'">.</span>
					<span class="millisecondes" v-if="affichageMillisecondes === 'oui'">{{ texteMillisecondes }}</span>
				</div>
				<div class="options" v-if="mode === 'stop'">
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
					<div class="conteneur-affichage-millisecondes">
						<label>{{ $t('afficherMillisecondes') }}</label>
						<div class="affichage-millisecondes" >
							<span class="oui">
								<input type="radio" :id="'millisecondes_oui_' + id" :name="'millisecondes_oui_' + id" value="oui" :checked="affichageMillisecondes=== 'oui'" @change="modifierAffichageMillisecondes($event.target.value)">
								<label :for="'millisecondes_oui_' + id">{{ $t('oui') }}</label>
							</span>
							<span class="non">
								<input type="radio" :id="'millisecondes_non_' + id" :name="'millisecondes_oui_' + id" value="non" :checked="affichageMillisecondes=== 'non'" @change="modifierAffichageMillisecondes($event.target.value)">
								<label :for="'millisecondes_non_' + id">{{ $t('non') }}</label>
							</span>
						</div>
					</div>
				</div>
				<div class="actions">
					<span class="bouton" role="button" tabindex="0" @click="demarrer" v-if="mode === 'stop'">{{ $t('demarrer') }}</span>
					<span class="bouton" role="button" tabindex="0" @click="demarrer" v-else-if="mode === 'pause'"><i class="material-icons">play_arrow</i></span>
					<span class="bouton" role="button" tabindex="0" @click="pause" v-else-if="mode === 'lecture'"><i class="material-icons">pause</i></span>
					<span class="bouton" role="button" tabindex="0" @click="stop" v-if="mode !== 'stop'"><i class="material-icons">autorenew</i></span>
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
	name: 'PChrono',
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
			mode: 'stop',
			deplacement: false,
			redimensionnement: false,
			titre: '',
			id: '',
			w: 0,
			h: 0,
			x: 0,
			y: 0,
			minw: 48,
			minh: 22.2,
			statut: '',
			dimensions: {},
			position: {},
			chrono: '',
			millisecondesPause: 0,
			millisecondesEcoulees: 0,
			heures: 0,
			minutes: 0,
			secondes: 0,
			millisecondes: 0,
			texteHeures: '00',
			texteMinutes: '00',
			texteSecondes: '00',
			texteMillisecondes: '000',
			affichageHeures: 'non',
			affichageMillisecondes: 'oui'
		}
	},
	watch: {
		export: function (valeur) {
			if (valeur === true) {
				this.position = { x: this.x, y: this.y }
				this.$emit('export', { id: this.id, titre: this.titre, statut: this.statut, dimensions: this.dimensions, position: this.position, contenu: { affichageHeures: this.affichageHeures, affichageMillisecondes: this.affichageMillisecondes }, w: this.w, h: this.h, x: this.x, y: this.y })
			}
		}
	},
	created () {
		this.definirCaracteristiques('chronometre')
		if (this.panneau.contenu !== '') {
			this.affichageHeures = this.panneau.contenu.affichageHeures
			if (this.panneau.contenu.hasOwnProperty('affichageMillisecondes')) {
				this.affichageMillisecondes = this.panneau.contenu.affichageMillisecondes
			}
		}
		this.genererOptions('chrono')
	},
	mounted () {
		this.initialiser()
		this.positionner()
		this.chargement = false
	},
	methods: {
		demarrer () {
			this.chrono = this.arreterTempsMillisecondes(this.chrono)
			const ms = this.demarrerTempsMillisecondes(this.millisecondesPause)
			this.millisecondesPause = 0
			this.chrono = setInterval(function () {
				this.millisecondesEcoulees = this.recupererTempsMillisecondes(ms)
				if (this.millisecondes < 10) {
					this.texteMillisecondes = '00' + this.millisecondes
				} else if (this.millisecondes < 100) {
					this.texteMillisecondes = '0' + this.millisecondes
				} else {
					this.texteMillisecondes = this.millisecondes
				}
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
				this.millisecondes = this.millisecondesEcoulees
				if (this.minutes === 59 && this.secondes === 59 && this.millisecondes > 999) {
					this.secondes = 0
					this.minutes = 0
					this.heures++
				}
				if (this.secondes === 59 && this.millisecondes > 999) {
					this.secondes = 0
					this.minutes++
				}
				if (this.millisecondes > 999) {
					this.millisecondes = 0
					this.secondes++
					this.demarrer()
				}
			}.bind(this), 1)
			this.h = 22.2
			this.positionner()
			if (this.mode !== 'lecture') {
				this.mode = 'lecture'
			}
		},
		pause () {
			this.millisecondesPause = this.millisecondesEcoulees
			this.chrono = this.arreterTempsMillisecondes(this.chrono)
			this.mode = 'pause'
		},
		stop () {
			this.chrono = this.arreterTempsMillisecondes(this.chrono)
			this.minutes = 0
			this.secondes = 0
			this.millisecondes = 0
			this.texteMinutes = '00'
			this.texteSecondes = '00'
			this.texteMillisecondes = '000'
			this.mode = 'stop'
			this.h = 28.4
			this.positionner()
		},
		arreterTempsMillisecondes (chrono) {
			if (chrono) { 
				clearInterval(chrono)
			}
			return chrono
		},
		demarrerTempsMillisecondes (ms) {
			const date = new Date()
			return date.getTime() - ms
		},
		recupererTempsMillisecondes (ms) {
			if (ms > 0) {
				const date = new Date()
				return date.getTime() - ms
			} else {
				return 0
			}
		},
		modifierAffichageHeures (affichage) {
			this.affichageHeures = affichage
			if (affichage === 'oui' && this.affichageMillisecondes === 'oui') {
				this.w = 59
			} else if (affichage === 'non' && this.affichageMillisecondes === 'non') {
				this.w = 37
			} else {
				this.w = 48
			}
			this.positionner()
		},
		modifierAffichageMillisecondes (affichage) {
			this.affichageMillisecondes = affichage
			if (affichage === 'oui' && this.affichageHeures === 'oui') {
				this.w = 59
			} else if (affichage === 'non' && this.affichageHeures === 'non') {
				this.w = 37
			} else {
				this.w = 48
			}
			this.positionner()
		}
	}
}
</script>

<style>
.chrono {
	font-family: 'Orbitron', sans-serif;
	font-size: 5rem;
	letter-spacing: 0.5rem;
	display: flex;
	padding: 2rem;
	border: 2px solid #ddd;
	background: #fff;
	border-radius: 1em;
	justify-content: center;
	text-align: center;
	user-select: none;
}

.chrono span {
	display: inline-block;
	text-indent: 0.5rem;
}

.chrono .heures,
.chrono .minutes,
.chrono .secondes {
	width: 11rem;
}

.chrono .millisecondes {
	width: 16.5rem;
	text-indent: 0.5rem;
}

.panneau .panneau-chrono .options {
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 2rem;
}

.panneau .panneau-chrono .options .conteneur-affichage-heures {
	margin-right: 2rem;
}

.panneau .panneau-chrono .actions {
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 2rem;
}

.panneau .panneau-chrono .actions .bouton {
	margin-top: 0;
}

.panneau .panneau-chrono .conteneur-affichage-millisecondes > label,
.panneau .panneau-chrono .conteneur-affichage-heures > label {
	margin-bottom: 0.5rem;
}

.panneau .panneau-chrono .affichage-millisecondes .oui,
.panneau .panneau-chrono .affichage-heures .oui {
	margin-right: 2rem;
}

.panneau .panneau-chrono .affichage-millisecondes label,
.panneau .panneau-chrono .affichage-heures label {
	display: inline-block;
	width: auto;
	font-size: 1.6rem;
	font-weight: 400;
    margin-left: 1rem;
	margin-bottom: 0;
}
</style>
