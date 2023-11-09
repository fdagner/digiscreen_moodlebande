<template>
	<JsPanel class="panneau" :visible="!chargement" :options="options">
		<div class="conteneur-gauche" :class="{'masque': mode === 'lecture'}" />
		<div class="conteneur panneau-pendu" v-if="mode === 'edition'">
			<div class="contenu" v-if="!chargementImage">
				<label>{{ $t('motATrouver') }}</label>
				<input type="search" :value="mot" @input="mot = $event.target.value">
				<label>{{ $t('image') }}</label>
				<img class="pendu" :src="image" alt="Pendu">
				<div class="separateur"><span>{{ $t('ou') }}</span></div>
				<label class="bouton" role="button" tabindex="0" :for="'selectionner-image-' + id">{{ $t('selectionnerImage') }}</label>
				<input :id="'selectionner-image-' + id" type="file" @change="televerserImage" style="display: none" accept=".jpg, .jpeg, .png, .gif">
				<label>{{ $t('nombreErreurs') }}</label>
				<input type="number" :value="erreurs" :min="1" :max="20" @input="erreurs = parseInt($event.target.value)">
				<label>{{ $t('caracteres') }}</label>
				<textarea class="caracteres" :value="caracteres" @input="caracteres = $event.target.value"></textarea>
				<span class="bouton" role="button" tabindex="0" @click="generer">{{ $t('valider') }}</span>
			</div>
			<div class="contenu" v-else>
				<div class="conteneur-chargement">
					<div class="chargement" />
				</div>
			</div>
		</div>
		<div class="conteneur panneau-pendu lecture" v-else>
			<div class="contenu">
				<div class="gauche">
					<img :src="image" :style="'opacity:' + opacite" alt="Pendu" />
					<div>
						<label>{{ $t('erreursRestantes') }}</label>
						<span class="erreurs">{{ erreursRestantes }}</span>
					</div>
				</div>
				<div class="droite">
					<div class="mot" :class="{'trouve': motTrouve}">
						<span class="lettre" v-for="(lettre, indexLettre) in lettresTrouvees" :key="'lettre_' + indexLettre">{{ lettre.toUpperCase() }}</span>
					</div>
					<div class="caracteres">
						<span class="caractere" :class="{'inactif': motTrouve || erreursRestantes === 0}" role="button" tabindex="0" v-for="(caractere, indexCaractere) in tableauCaracteres" @click="verifierLettre(caractere)" :key="'caractere_' + indexCaractere">{{ caractere.toUpperCase() }}</span>
					</div>
				</div>
			</div>
		</div>
		<div class="conteneur-droite" :class="{'masque': mode === 'lecture'}" />
		<div class="conteneur-bas" :class="{'masque': mode === 'lecture'}" />
	</JsPanel>
</template>

<script>
import JsPanel from '@/components/jspanel.vue'
import Panneau from '@/panneau'

export default {
	name: 'PPendu',
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
			minw: 40,
			minh: 50,
			statut: '',
			dimensions: {},
			position: {},
			donnees: { w: 0, h: 0, x: 0, y: 0 },
			mot: '',
			lettresTrouvees: [],
			motTrouve: false,
			caracteres: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
			tableauCaracteres: [],
			erreurs: 5,
			erreursRestantes: 5,
			opacite: 0,
			image: './static/img/pendu/pendu.png',
			chargementImage: false
		}
	},
	watch: {
		export: function (valeur) {
			if (valeur === true) {
				this.position = { x: this.x, y: this.y }
				this.$emit('export', { id: this.id, titre: this.titre, mode: this.mode, statut: this.statut, dimensions: this.dimensions, position: this.position, contenu: { mot: this.mot, caracteres: this.caracteres, erreurs: this.erreurs, image: this.image }, w: this.w, h: this.h, x: this.x, y: this.y })
			}
		}
	},
	created () {
		this.definirCaracteristiques('pendu')
		if (this.panneau.contenu !== '') {
			this.mot = this.panneau.contenu.mot
			this.caracteres = this.panneau.contenu.caracteres
			this.erreurs = this.panneau.contenu.erreurs
			this.image = this.panneau.contenu.image
		}
		this.genererOptions('pendu')
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
			this.erreursRestantes = this.erreurs
			for (let i = 0; i < this.mot.length; i++) {
				this.lettresTrouvees.push('_')
			}
			const caracteres = this.caracteres.split('')
			this.tableauCaracteres = caracteres.filter(function (element) {
				return element !== ''
			})
		}
	},
	methods: {
		generer () {
			if (this.mot !== '') {
				this.mode = 'lecture'
				this.redimensionnement = true
				this.erreursRestantes = this.erreurs
				for (let i = 0; i < this.mot.length; i++) {
					this.lettresTrouvees.push('_')
				}
				const caracteres = this.caracteres.split('')
				this.tableauCaracteres = caracteres.filter(function (element) {
					return element !== ''
				})
				if (this.donnees.w > 0 && this.donnees.h > 0) {
					this.w = this.donnees.w
					this.h = this.donnees.h
				} else {
					this.w = 80
					this.h = 50
				}
				if (this.donnees.x > 0 && this.donnees.y > 0) {
					this.x = this.donnees.x
					this.y = this.donnees.y
				}
				this.positionner()
			}
		},
		editer () {
			this.mode = 'edition'
			this.redimensionnement = false
			this.donnees.w = this.w
			this.donnees.h = this.h
			this.donnees.x = this.x
			this.donnees.y = this.y
			this.lettresTrouvees = []
			this.tableauCaracteres = []
			this.opacite = 0
			this.motTrouve = false
			this.w = 40
			this.h = 64
			this.positionner()
		},
		televerserImage (event) {
			const fichier = event.target.files[0]
			if (fichier) {
				this.chargementImage = true
				const reader = new FileReader()
				reader.readAsDataURL(fichier)
				reader.onloadend = function (e) {
					const img = new Image()
					img.src = e.target.result
					img.onload = function () {
						if (img.width > 1500) {
							const canvas = document.createElement('canvas')
							const ratio = img.width / img.height
							const largeur = 1500
							const hauteur = 1500 / ratio
							canvas.width = largeur
							canvas.height = hauteur
							canvas.getContext('2d').drawImage(img, 0, 0, largeur, hauteur)
							this.chargementImage = false
							this.image = canvas.toDataURL('image/jpeg', 0.85)
						} else {
							this.chargementImage = false
							this.image = e.target.result
						}
					}.bind(this)
				}.bind(this)
			}
		},
		verifierLettre (caractere) {
			if (this.motTrouve === false && this.erreursRestantes > 0) {
				const mot = this.mot.split('')
				mot.forEach(function (lettre, index) {
					mot[index] = lettre.toUpperCase()
				})
				if (mot.includes(caractere.toUpperCase())) {
					let lettresATrouver = 0
					mot.forEach(function (lettre, index) {
						if (lettre.toUpperCase() === caractere.toUpperCase()) {
							this.lettresTrouvees[index] = lettre.toUpperCase()
						}
					}.bind(this))
					this.lettresTrouvees.forEach(function (lettre) {
						if (lettre === '_') {
							lettresATrouver++
						}
					}.bind(this))
					if (lettresATrouver === 0) {
						this.motTrouve = true
						this.lancerConfettis()
					}
				} else {
					this.erreursRestantes--
					if (this.erreursRestantes === 0) {
						this.opacite = 1
					} else {
						this.opacite = this.opacite + (1 / this.erreurs)
					}
				}
			}
		}
	}
}
</script>

<style>
.panneau .panneau-pendu .conteneur-chargement {
	font-size: 0;
	line-height: 1;
	text-align: center;
}

.panneau .panneau-pendu .chargement {
	display: inline-block;
	border: 7px solid #ddd;
	border-top: 7px solid #00ced1;
	border-radius: 50%;
	width: 45px;
	height: 45px;
	animation: rotation 0.7s linear infinite;
}

.panneau .panneau-pendu label.bouton,
.panneau .panneau-pendu input[type="search"],
.panneau .panneau-pendu input[type="number"] {
	margin-bottom: 2rem;
}

.panneau .panneau-pendu img.pendu {
	max-width: 100%;
	max-height: 9rem;
}

.panneau .panneau-pendu .separateur {
    position: relative;
    margin: 2rem 25% 2rem;
    text-align: center;
    width: 50%;
}

.panneau .panneau-pendu .separateur::before {
    position: absolute;
    top: 50%;
    display: block;
    content: '';
    width: 100%;
    height: 1px;
    background-color: #ddd;
}

.panneau .panneau-pendu .separateur span {
    position: relative;
	display: inline-block;
    margin: 0;
    font-size: 1.5rem;
    z-index: 2;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    vertical-align: middle;
    background-color: #fff;
}

.panneau .panneau-pendu.lecture .contenu {
   display: flex;
}

.panneau .panneau-pendu.lecture .gauche {
   width: 35%;
}

.panneau .panneau-pendu.lecture img {
   max-width: 100%;
   height: auto;
}

.panneau .panneau-pendu.lecture .gauche .erreurs {
   font-size: 3rem;
   font-weight: 700;
}

.panneau .panneau-pendu.lecture .droite {
   width: 65%;
}

.panneau .panneau-pendu.lecture .droite .mot {
	display: flex;
	justify-content: center;
	margin-bottom: 4rem;
}

.panneau .panneau-pendu.lecture .droite .mot.trouve {
	color: #00b894;
}

.panneau .panneau-pendu.lecture .droite .mot .lettre {
	font-size: 5rem;
	font-weight: 700;
	margin-right: 1.2rem;
}

.panneau .panneau-pendu.lecture .droite .caracteres {
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
}

.panneau .panneau-pendu.lecture .droite .caractere {
	width: 6rem;
	text-align: center;
	font-size: 3rem;
	padding: 1rem 0;
	margin: 0.5rem;
	background: #00ced1;
	border-radius: 0.5rem;
	user-select: none;
	transition: color ease-in 0.1s, background-color ease-in 0.1s;
	cursor: pointer;
}

.panneau .panneau-pendu.lecture .droite .caractere:hover {
	color: #fff;
	background: #001d1d;
}

.panneau .panneau-pendu.lecture .droite .caractere.inactif:hover,
.panneau .panneau-pendu.lecture .droite .caractere.inactif {
	color: #001d1d;
	background: #ddd;
	cursor: default;
}
</style>
