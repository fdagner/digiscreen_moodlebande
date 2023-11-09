<template>
	<JsPanel class="panneau" :visible="!chargement" :options="options">
		<div class="conteneur-gauche" />
		<div class="conteneur panneau-nuage">
			<div class="contenu" v-if="mode === 'edition'">
				<div class="colonne gauche">
					<label class="mot">{{ $t('mots') }}</label>
					<label class="taille">{{ $t('taille') }}</label>
					<div class="mots">
						<div class="mot" v-for="(mot, index) in mots" :key="'mot_' + index">
							<input type="search" :value="mot[0]" @input="mots[index][0] = $event.target.value" :maxlength="30">
							<input type="number" :value="mot[1]" @input="mots[index][1] = $event.target.value" :min="1" :max="100">
						</div>
					</div>
					<span class="bouton-secondaire" role="button" tabindex="0" :title="$t('ajouterMot')" @click="ajouterMot"><i class="material-icons">add_circle_outline</i></span>
					<span class="bouton-secondaire" role="button" tabindex="0" :title="$t('ajouterListe')" @click="afficherListe"><i class="material-icons">list_alt</i></span>
				</div>
				<div class="colonne droite">
					<label>{{ $t('apercu') }}</label>
					<div class="nuage">
						<div class="conteneur-chargement-nuage" v-if="chargementNuage">
							<div class="chargement-nuage">
								<div class="spinner"><div /><div /><div /><div /><div /><div /><div /><div /><div /><div /><div /><div /></div>
							</div>
						</div>
						<vue-word-cloud :animation-duration="200" animation-easing="ease-in-out" :animation-overlap="1" color="#00ced1" :font-family="'Baloo Bhaijaan'" :load-font="chargerPolice" :spacing="1/2" :words="nuage" @update:progress="modifierProgression" /> 
					</div>
					<div class="actions">
						<span class="bouton" role="button" tabindex="0" @click="visualiser">{{ $t('apercu') }}</span>
						<span class="bouton" role="button" tabindex="0" @click="generer">{{ $t('valider') }}</span>
					</div>
				</div>
				<Transition name="fondu">
					<div class="liste" v-if="modale">
						<span class="consigne">{{ $t('consigneListeMots') }}</span>
						<textarea @input="liste = $event.target.value" :placeholder="$t('exempleListe')"></textarea>
						<div class="actions">
							<span class="bouton" role="button" tabindex="0" @click="fermerListe">{{ $t('annuler') }}</span>
							<span class="bouton" role="button" tabindex="0" @click="ajouterMots">{{ $t('ajouter') }}</span>
						</div>
					</div>
				</Transition>
			</div>
			<div class="nuage lecture" v-else>
				<div class="conteneur-chargement-nuage" v-if="chargementNuage">
					<div class="chargement-nuage">
						<div class="spinner"><div /><div /><div /><div /><div /><div /><div /><div /><div /><div /><div /><div /></div>
					</div>
				</div>
				<vue-word-cloud :animation-duration="200" animation-easing="ease-in-out" :animation-overlap="1" color="#00ced1" :font-family="'Baloo Bhaijaan'" :load-font="chargerPolice" :spacing="1/2" :words="nuage" @update:progress="modifierProgression" />
			</div>
		</div>
		<div class="conteneur-droite" />
		<div class="conteneur-bas" />
	</JsPanel>
</template>

<script>
import JsPanel from '@/components/jspanel.vue'
import VueWordCloud from 'vuewordcloud'
import Panneau from '@/panneau'
import FontFaceObserver from 'fontfaceobserver'

export default {
	name: 'PNuage',
	components: {
		JsPanel,
		[VueWordCloud.name]: VueWordCloud
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
			minw: 25,
			minh: 15,
			statut: '',
			dimensions: {},
			position: {},
			donnees: { w: 0, h: 0, x: 0, y: 0 },
			mots: [['', 1], ['', 1], ['', 1], ['', 1], ['', 1], ['', 1], ['', 1], ['', 1], ['', 1], ['', 1]],
			nuage: [],
			modale: false,
			liste: '',
			chargementNuage: false,
			progression: ''
		}
	},
	watch: {
		export: function (valeur) {
			if (valeur === true) {
				this.position = { x: this.x, y: this.y }
				this.$emit('export', { id: this.id, titre: this.titre, mode: this.mode, statut: this.statut, dimensions: this.dimensions, position: this.position, contenu: { mots: this.mots, nuage: this.nuage }, w: this.w, h: this.h, x: this.x, y: this.y })
			}
		},
		progression: function (progression) {
			if (this.nuage.length > 0 && (progression === '' || progression === null)) {
				this.chargementNuage = true
				setTimeout(function () {
					this.chargementNuage = false
				}.bind(this), 200)
			} else {
				setTimeout(function () {
					this.chargementNuage = false
				}.bind(this), 200)
			}
		}
	},
	created () {
		this.definirCaracteristiques('nuageMots')
		if (this.panneau.contenu !== '') {
			this.mots = this.panneau.contenu.mots
			this.nuage = this.panneau.contenu.nuage
			if (!Array.isArray(this.nuage)) {
				this.nuage = []
				this.visualiser()
			}
		}
		this.genererOptions('nuage')
	},
	mounted () {
		this.initialiser()
		this.positionner()
		this.chargement = false
		if (this.mode === 'edition' && this.statut !== 'min') {
			this.$nextTick(function () {
				document.querySelector('#' + this.id + ' input').focus()
			}.bind(this))
		} else if (this.mode === 'lecture') {
			this.redimensionnement = true
		}
	},
	methods: {
		generer () {
			const mots = this.mots.filter(function (item) {
				return item[0] !== ''
			})
			if (mots.length > this.nuage.length) {
				this.visualiser()
			}
			this.mode = 'lecture'
			this.redimensionnement = true
			if (this.donnees.w > 0 && this.donnees.h > 0) {
				this.w = this.donnees.w
				this.h = this.donnees.h
			} else {
				this.w = 40
				this.h = 30
			}
			if (this.donnees.x > 0 && this.donnees.y > 0) {
				this.x = this.donnees.x
				this.y = this.donnees.y
			}
			this.positionner()
		},
		visualiser () {
			this.$nextTick(function () {
				const mots = this.mots.filter(function (item) {
					return item[0] !== ''
				})
				const fontes = ['Abril Fatface', 'Baloo Bhaijaan']
				const fonte = fontes[Math.floor(Math.random() * fontes.length)]
				const couleurs = ['#ffd077', '#3bc4c7', '#3a9eea', '#ff4e69', '#461e47']
				if (mots.length > 0) {
					const nuage = []
					mots.forEach(function (mot) {
						const couleur = couleurs[Math.floor(Math.random() * couleurs.length)]
						nuage.push({ text: mot[0], weight: mot[1], number: 1, rotation: 0, fontFamily: fonte, color: couleur})
					})
					this.nuage = nuage
				}
			}.bind(this))
		},
		editer () {
			this.mode = 'edition'
			this.redimensionnement = false
			this.donnees.w = this.w
			this.donnees.h = this.h
			this.donnees.x = this.x
			this.donnees.y = this.y
			this.w = 80
			this.h = 59.5
			this.positionner()
		},
		modifierProgression (progression) {
			this.progression = progression
		},
		chargerPolice (police, style, poids, texte) {
			return (new FontFaceObserver(police, { style: style, weight: poids })).load(texte)
		},
		ajouterMot () {
			this.mots.push(['', 1])
			this.$nextTick(function () {
				const element = document.querySelector('#' + this.id + ' .mots')
				element.scrollTop = element.scrollHeight
				element.lastChild.querySelector('input').focus()
			})
		},
		ajouterMots () {
			const liste = this.liste.split(',')
			if (liste.length > 0 && liste[0] !== '') {
				liste.forEach(function (mot) {
					if (mot.trim() !== '') {
						const mots = this.mots.filter(function (item) {
							return item[0] !== ''
						})
						mots.push([mot, 1])
						this.mots = mots
						if (this.mots.length < 11) {
							const total = 10 - this.mots.length
							for (let i = 0; i < total; i++) {
								this.mots.push(['', 1])
							}
						}
						this.$nextTick(function () {
							const element = document.querySelector('#' + this.id + ' .mots')
							element.scrollTop = element.scrollHeight
						}.bind(this))
					}
				}.bind(this))
				this.liste = ''
				this.modale = false
			}
		},
		afficherListe () {
			this.modale = true
		},
		fermerListe () {
			this.modale = false
		},
		zoomer () {
			if (this.zoom < 15) {
				this.zoom = this.zoom + 0.1
			}
		},
		dezoomer () {
			if (this.zoom > 0.5) {
				this.zoom = this.zoom - 0.1
			}
		},
		recadrer () {
			this.zoom = 1
		},
		modifierZoom (event) {
			this.zoom = event.detail.scale
		}
	}
}
</script>

<style>
.panneau .panneau-nuage {
	overflow: hidden!important;
}

.panneau .conteneur .colonne.gauche {
	width: 25%;
    display: inline-flex;
    flex-wrap: wrap;
}

.panneau .conteneur .colonne.droite {
	width: 75%;
    display: inline-flex;
    flex-wrap: wrap;
}

.panneau .conteneur div.mot {
    display: flex;
	margin-bottom: 0.5rem;
}

.panneau .conteneur div.mot:last-child {
	margin-bottom: 0;
}

.panneau .conteneur .mot input[type="search"] {
	padding: 0.7rem;
}

.panneau .conteneur .mot input[type="number"] {
    width: 6rem;
    margin-left: 0.5rem;
	padding: 0.7rem;
}

.panneau .conteneur .colonne.gauche label.mot,
.panneau .conteneur .colonne.gauche label.taille {
	display: inline-block;
	width: auto;
}

.panneau .conteneur .colonne.gauche label.mot {
	width: calc(100% - 7rem);
}

.panneau .conteneur .colonne.gauche label.taille {
	width: 7rem;
}

.panneau .conteneur .colonne.gauche .mots {
	height: 44.5rem;
	overflow: auto;
}

.panneau .conteneur .colonne.gauche .bouton-secondaire {
	width: 50%;
	text-align: center;
	margin-top: 1rem;
}

.panneau .conteneur .colonne.droite .nuage {
	position: relative;
	width: calc(100% - 1rem);
	margin-left: 1rem;
    height: 44.5rem;
	border: 1px solid #ddd;
}

.panneau .conteneur .liste .actions,
.panneau .conteneur .colonne.droite .actions {
	width: 100%;
}

.panneau .conteneur .colonne.droite .bouton.inactif:hover,
.panneau .conteneur .colonne.droite .bouton.inactif {
	color: #fff;
	background: #ccc;
	cursor: default;
}

.panneau .liste {
	position: absolute;
	display: flex;
	flex-wrap: wrap;
	left: 2rem;
    bottom: 3rem;
    background: #eee;
    width: 40rem;
    padding: 2rem;
    border-radius: 1rem;
	box-shadow: 0 1.4rem 2.8rem rgba(0, 0, 0, 0.25), 0 1rem 1rem rgba(0, 0, 0, 0.22);
}

.panneau .liste textarea {
	max-height: 18rem;
	height: 18rem;
}

.panneau .panneau-nuage .nuage.lecture {
	position: relative;
	width: 100%;
	height: 100%;
}

.panneau .panneau-nuage .conteneur-chargement-nuage {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	width: 100%;
	height: 100%;
	background: rgba(255, 255, 255, 0.75);
	z-index: 1000;
}

.panneau .panneau-nuage .chargement-nuage {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100%;
}

.panneau .panneau-nuage .spinner {
	display: inline-block;
	position: relative;
	width: 80px;
	height: 80px;
}

.panneau .panneau-nuage .spinner div {
	transform-origin: 40px 40px;
	animation: fonduSortant 1.2s linear infinite;
}

.panneau .panneau-nuage .spinner div:after {
	content: '';
	display: block;
	position: absolute;
	top: 3px;
	left: 37px;
	width: 5px;
    height: 25px;
	border-radius: 20%;
	background: #00ced1;
}

.panneau .panneau-nuage .spinner div:nth-child(1) {
	transform: rotate(0deg);
	animation-delay: -1.1s;
}

.panneau .panneau-nuage .spinner div:nth-child(2) {
	transform: rotate(30deg);
	animation-delay: -1s;
}

.panneau .panneau-nuage .spinner div:nth-child(3) {
	transform: rotate(60deg);
	animation-delay: -0.9s;
}

.panneau .panneau-nuage .spinner div:nth-child(4) {
	transform: rotate(90deg);
	animation-delay: -0.8s;
}

.panneau .panneau-nuage .spinner div:nth-child(5) {
	transform: rotate(120deg);
	animation-delay: -0.7s;
}

.panneau .panneau-nuage .spinner div:nth-child(6) {
	transform: rotate(150deg);
	animation-delay: -0.6s;
}

.panneau .panneau-nuage .spinner div:nth-child(7) {
	transform: rotate(180deg);
	animation-delay: -0.5s;
}

.panneau .panneau-nuage .spinner div:nth-child(8) {
	transform: rotate(210deg);
	animation-delay: -0.4s;
}

.panneau .panneau-nuage .spinner div:nth-child(9) {
	transform: rotate(240deg);
	animation-delay: -0.3s;
}

.panneau .panneau-nuage .spinner div:nth-child(10) {
	transform: rotate(270deg);
	animation-delay: -0.2s;
}

.panneau .panneau-nuage .spinner div:nth-child(11) {
	transform: rotate(300deg);
	animation-delay: -0.1s;
}

.panneau .panneau-nuage .spinner div:nth-child(12) {
	transform: rotate(330deg);
	animation-delay: 0s;
}
</style>
