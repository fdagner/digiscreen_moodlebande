<template>
	<JsPanel class="panneau" :visible="!chargement" :options="options">
		<div class="conteneur-gauche" />
		<div class="conteneur panneau-cartes" v-if="mode === 'edition'">
			<div class="contenu">
				<label>{{ $t('formatCartes') }}</label>
				<div class="format">
					<span class="paysage">
						<input type="radio" :id="'format_paysage_' + id" :name="'format_' + id" value="paysage" :checked="format === 'paysage'" @change="format = $event.target.value">
						<label :for="'format_paysage_' + id">{{ $t('paysage') }}</label>
					</span>
					<span class="portrait">
						<input type="radio" :id="'format_portrait_' + id" :name="'format_' + id" value="portrait" :checked="format === 'portrait'" @change="format = $event.target.value">
						<label :for="'format_portrait_' + id">{{ $t('portrait') }}</label>
					</span>
					<span class="carre">
						<input type="radio" :id="'format_carre_' + id" :name="'format_' + id" value="carre" :checked="format === 'carre'" @change="format = $event.target.value">
						<label :for="'format_carre_' + id">{{ $t('carre') }}</label>
					</span>
				</div>
				<label>{{ $t('recto') }}</label>
				<div class="conteneur-recto">
					<input type="search" :class="{'avec-image': imageRecto !== ''}" :value="texteRecto" :maxlength="50" @input="texteRecto = $event.target.value">
					<input type="color" :id="'fond-recto-' + id" :value="fondRecto" :title="$t('selectionnerCouleurFond')" @change="fondRecto = $event.target.value" v-if="imageRecto === '' && chargementImage === ''">
					<span class="fond-recto" v-if="fondRecto === '#001d1d' && imageRecto === '' && chargementImage === ''">
						<label :for="'televerser-image-recto-' + id" :title="$t('selectionnerImage')" class="bouton-secondaire"><i class="material-icons">add_photo_alternate</i></label>
						<input :id="'televerser-image-recto-' + id" type="file" @change="televerserImage($event, 'recto')" style="display: none" accept=".jpg, .jpeg, .png, .gif">
					</span>
					<span class="fond-recto" v-else-if="imageRecto === '' && chargementImage === 'recto'">
						<span class="conteneur-chargement">
							<span class="chargement" />
						</span>
					</span>
					<span class="fond-recto image" v-else-if="imageRecto !== ''" :style="'background-image: url(' + imageRecto + ')'" />
					<span class="supprimer-image" role="button" tabindex="0" @click="imageRecto = ''" v-if="imageRecto !== ''"><i class="material-icons">highlight_off</i></span>
					<span class="supprimer-fond" role="button" tabindex="0" @click="fondRecto = '#001d1d'" v-if="fondRecto !== '#001d1d' && imageRecto === ''"><i class="material-icons">highlight_off</i></span>
				</div>
				<label>{{ $t('verso') }}</label>
				<div class="conteneur-verso">
					<input type="search" :class="{'avec-image': imageVerso !== ''}" :value="texteVerso" :maxlength="50" @input="texteVerso = $event.target.value">
					<input type="color" :id="'fond-verso-' + id" :value="fondVerso" :title="$t('selectionnerCouleurFond')" @change="fondVerso = $event.target.value" v-if="imageVerso === '' && chargementImage === ''">
					<span class="fond-verso" v-if="fondVerso === '#ffffff' && imageVerso === '' && chargementImage === ''">
						<label :for="'televerser-image-verso-' + id" :title="$t('selectionnerImage')" class="bouton-secondaire"><i class="material-icons">add_photo_alternate</i></label>
						<input :id="'televerser-image-verso-' + id" type="file" @change="televerserImage($event, 'verso')" style="display: none" accept=".jpg, .jpeg, .png, .gif">
					</span>
					<span class="fond-verso" v-else-if="imageVerso === '' && chargementImage === 'verso'">
						<span class="conteneur-chargement">
							<span class="chargement" />
						</span>
					</span>
					<span class="fond-verso image" v-else-if="imageVerso !== ''" :style="'background-image: url(' + imageVerso + ')'" />
					<span class="supprimer-image" role="button" tabindex="0" @click="imageVerso = ''" v-if="imageVerso !== ''"><i class="material-icons">highlight_off</i></span>
					<span class="supprimer-fond" role="button" tabindex="0" @click="fondVerso = '#ffffff'" v-if="fondVerso !== '#ffffff' && imageVerso === ''"><i class="material-icons">highlight_off</i></span>
				</div>
				<span class="bouton-secondaire ajouter" role="button" tabindex="0" :title="$t('ajouterCarte')" @click="ajouterCarte"><i class="material-icons">add_circle_outline</i></span>
				<draggable class="items" v-model="cartes">
					<div class="item" :class="format" v-for="(carte, index) in cartes" :key="'item_' + index">
						<div :id="'item_' + id + '_' + index" class="carte" @click="retournerCarte('item_' + id + '_' + index)">
							<div class="recto" :class="{'avec-image': carte.recto.image !== ''}" :style="'background-color:' + carte.recto.fond">
								<div :style="'background-image: url(' + carte.recto.image + ')'" v-if="carte.recto.image !== ''">
									<h1 :style="'color:' + definirCouleurTexte(carte.recto.fond)" v-if="carte.recto.texte !== ''">{{ carte.recto.texte }}</h1>
								</div>
								<div v-else>
									<h1 :style="'color:' + definirCouleurTexte(carte.recto.fond)" v-if="carte.recto.texte !== ''">{{ carte.recto.texte }}</h1>
								</div>
							</div>
							<div class="verso" :class="{'avec-image': carte.verso.image !== ''}" :style="'background-color:' + carte.verso.fond">
								<div :style="'background-image: url(' + carte.verso.image + ')'" v-if="carte.verso.image !== ''">
									<p :style="'color:' + definirCouleurTexte(carte.verso.fond)" v-if="carte.verso.texte !== ''">{{ carte.verso.texte }}</p>
								</div>
								<div v-else>
									<p :style="'color:' + definirCouleurTexte(carte.verso.fond)" v-if="carte.verso.texte !== ''">{{ carte.verso.texte }}</p>
								</div>
							</div>
						</div>
						<span class="fermer" role="button" tabindex="0" @click="supprimerCarte(index)"><i class="material-icons">highlight_off</i></span>
					</div>
				</draggable>
				<span class="bouton" role="button" tabindex="0" @click="generer">{{ $t('valider') }}</span>
			</div>
		</div>
		<div class="conteneur panneau-cartes" v-else>
			<div class="contenu cartes">
				<div :id="'carte_' + id + '_' + index" class="carte" :class="format" v-for="(carte, index) in cartes" @click="retournerCarte('carte_' + id + '_' + index)" :key="'carte_' + index">
					<div class="recto" :class="{'avec-image': carte.recto.image !== ''}" :style="'background-color:' + carte.recto.fond">
						<div :style="'background-image: url(' + carte.recto.image + ')'" v-if="carte.recto.image !== ''">
							<h1 :style="'color:' + definirCouleurTexte(carte.recto.fond)" v-if="carte.recto.texte !== ''">{{ carte.recto.texte }}</h1>
						</div>
						<div v-else>
							<h1 :style="'color:' + definirCouleurTexte(carte.recto.fond)" v-if="carte.recto.texte !== ''">{{ carte.recto.texte }}</h1>
						</div>
					</div>
					<div class="verso" :class="{'avec-image': carte.verso.image !== ''}" :style="'background-color:' + carte.verso.fond">
						<div :style="'background-image: url(' + carte.verso.image + ')'" v-if="carte.verso.image !== ''">
							<p :style="'color:' + definirCouleurTexte(carte.verso.fond)" v-if="carte.verso.texte !== ''">{{ carte.verso.texte }}</p>
						</div>
						<div v-else>
							<p :style="'color:' + definirCouleurTexte(carte.verso.fond)" v-if="carte.verso.texte !== ''">{{ carte.verso.texte }}</p>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="conteneur-droite" />
		<div class="conteneur-bas" />
	</JsPanel>
</template>

<script>
import JsPanel from '@/components/jspanel.vue'
import { VueDraggableNext } from 'vue-draggable-next'
import Panneau from '@/panneau'

export default {
	name: 'PCartes',
	components: {
		JsPanel,
		draggable: VueDraggableNext
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
			minw: 60,
			minh: 50,
			statut: '',
			dimensions: {},
			position: {},
			donnees: { w: 0, h: 0, x: 0, y: 0 },
			cartes: [],
			format: 'paysage',
			texteRecto: '',
			texteVerso: '',
			fondRecto: '#001d1d',
			fondVerso: '#ffffff',
			imageRecto: '',
			imageVerso: '',
			chargementImage: ''
		}
	},
	watch: {
		export: function (valeur) {
			if (valeur === true) {
				this.position = { x: this.x, y: this.y }
				this.$emit('export', { id: this.id, titre: this.titre, mode: this.mode, statut: this.statut, dimensions: this.dimensions, position: this.position, contenu: { cartes: this.cartes, format: this.format }, w: this.w, h: this.h, x: this.x, y: this.y })
			}
		}
	},
	created () {
		this.definirCaracteristiques('cartes')
		if (this.panneau.contenu !== '') {
			this.cartes = this.panneau.contenu.cartes
			this.format = this.panneau.contenu.format
		}
		this.genererOptions('cartes')
	},
	mounted () {
		this.initialiser()
		this.positionner()
		this.chargement = false
		if (this.mode === 'edition' && this.statut !== 'min') {
			this.$nextTick(function () {
				document.querySelector('#' + this.id + ' input[type="search"]').focus()
			}.bind(this))
		} else if (this.mode === 'lecture') {
			this.redimensionnement = true
		}
	},
	methods: {
		generer () {
			if (this.cartes.length > 0) {
				this.mode = 'lecture'
				this.redimensionnement = true
				if (this.donnees.w > 0 && this.donnees.h > 0) {
					this.w = this.donnees.w
					this.h = this.donnees.h
				} else {
					this.w = 90
					this.h = 64
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
			this.texteRecto = ''
			this.texteVerso = ''
			this.fondRecto = '#001d1d'
			this.fondVerso = '#ffffff'
			this.imageRecto = ''
			this.imageVerso = ''
			this.chargementImage = ''
			this.donnees.w = this.w
			this.donnees.h = this.h
			this.donnees.x = this.x
			this.donnees.y = this.y
			this.w = 60
			this.h = 50
			this.positionner()
		},
		ajouterCarte () {
			if ((this.texteRecto !== '' || this.fondRecto !== '#001d1d' || this.imageRecto !== '') && (this.texteVerso !== '' || this.fondVerso !== '#ffffff' || this.imageVerso !== '')) {
				const carte = { recto: { texte: this.texteRecto, fond: this.fondRecto, image: this.imageRecto }, verso: { texte: this.texteVerso, fond: this.fondVerso, image: this.imageVerso }}
				this.cartes.push(carte)
				this.texteRecto = ''
				this.texteVerso = ''
				this.imageRecto = ''
				this.imageVerso = ''
				this.chargementImage = ''
			}
		},
		retournerCarte (id) {
			const carte = document.querySelector('#' + id)
			carte.classList.contains('flip') ? carte.classList.remove('flip') : carte.classList.add('flip')
		},
		supprimerCarte (index) {
			this.cartes.splice(index, 1)
		},
		televerserImage (event, type) {
			const fichier = event.target.files[0]
			if (fichier) {
				this.chargementImage = type
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
							this.chargementImage = ''
							if (type === 'recto') {
								this.imageRecto = canvas.toDataURL('image/jpeg', 0.85)
							} else {
								this.imageVerso = canvas.toDataURL('image/jpeg', 0.85)
							}
						} else {
							this.chargementImage = ''
							if (type === 'recto') {
								this.imageRecto = e.target.result
							} else {
								this.imageVerso = e.target.result
							}
						}
					}.bind(this)
				}.bind(this)
			}
		},
		definirCouleurTexte (couleurFond) {
			const couleur = (couleurFond.charAt(0) === '#') ? couleurFond.substring(1, 7) : couleurFond
			const r = parseInt(couleur.substring(0, 2), 16)
			const v = parseInt(couleur.substring(2, 4), 16)
			const b = parseInt(couleur.substring(4, 6), 16)
			return (((r * 0.299) + (v * 0.587) + (b * 0.114)) > 186) ? '#001d1d' : '#ffffff'
		}
	}
}
</script>

<style>
.panneau .panneau-cartes .paysage,
.panneau .panneau-cartes .portrait {
	margin-right: 2.5rem;
}

.panneau .panneau-cartes .format {
	margin-bottom: 2rem;
}

.panneau .panneau-cartes .format label {
	display: inline-block;
    width: auto;
	font-size: 1.6rem;
	font-weight: 400;
    margin-left: 1rem;
	margin-bottom: 0;
}

.panneau .panneau-cartes .conteneur-recto,
.panneau .panneau-cartes .conteneur-verso {
	position: relative;
	display: flex;
	justify-content: flex-start;
	align-items: center;
}

.panneau .panneau-cartes .conteneur-recto {
	margin-bottom: 2rem;
}

.panneau .panneau-cartes .conteneur-recto .bouton-secondaire,
.panneau .panneau-cartes .conteneur-verso .bouton-secondaire {
	width: auto!important;
	height: 4rem!important;
	font-size: 3.6rem;
	font-weight: 400;
	margin-bottom: 0;
	margin-left: 0.5rem;
}

.panneau .panneau-cartes .conteneur-recto .bouton-secondaire i,
.panneau .panneau-cartes .conteneur-verso .bouton-secondaire i {
	line-height: 4rem!important;
}

.panneau .panneau-cartes .ajouter {
	margin-top: 1.5rem;
}

.panneau .panneau-cartes .cartes,
.panneau .panneau-cartes .items {
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
}

.panneau .panneau-cartes .items .item {
	position: relative;
	margin: 1rem;
}

.panneau .panneau-cartes .items .item .fermer {
	position: absolute;
    top: 0;
    right: 0;
	font-size: 2.2rem;
	color: #777;
	background: #fff;
	cursor: pointer;
	line-height: 1;
	z-index: 5;
}

.panneau .panneau-cartes .carte {
	position: relative;
    display: inline-block;
    margin: 0 0.5em 1.5rem;
	cursor: pointer;
	box-sizing: border-box;
}

.panneau .panneau-cartes .carte.paysage {
	width: 32rem;
}

.panneau .panneau-cartes .carte.portrait {
	width: 22rem;
}

.panneau .panneau-cartes .carte.carre {
	width: 27rem;
}

.panneau .panneau-cartes .paysage .carte {
	width: 16rem;
}

.panneau .panneau-cartes .portrait .carte {
	width: 11rem;
}

.panneau .panneau-cartes .carre .carte {
	width: 13.5rem;
}

.panneau .panneau-cartes .items .carte {
	margin: 0;
}

.panneau .panneau-cartes .carte h1 {
    font-size: 2.2em;
	text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.3);
}

.panneau .panneau-cartes .items .carte h1 {
    font-size: 1.1em;
}

.panneau .panneau-cartes .carte > .recto,
.panneau .panneau-cartes .carte > .verso {
    width: inherit;
    border-radius: 0.7rem;
	border: 1px solid #001d1d;
	transition-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275);
    transition-duration: 0.5s;
    transition-property: transform, opacity;
}

.panneau .panneau-cartes .carte.paysage > .recto,
.panneau .panneau-cartes .carte.paysage > .verso {
	height: 22rem;
}

.panneau .panneau-cartes .carte.portrait > .recto,
.panneau .panneau-cartes .carte.portrait > .verso {
	height: 32rem;
}

.panneau .panneau-cartes .carte.carre > .recto,
.panneau .panneau-cartes .carte.carre > .verso {
	height: 27rem;
}

.panneau .panneau-cartes .paysage .carte > .recto,
.panneau .panneau-cartes .paysage .carte > .verso {
	height: 11rem;
}

.panneau .panneau-cartes .portrait .carte > .recto,
.panneau .panneau-cartes .portrait .carte > .verso {
	height: 16rem;
}

.panneau .panneau-cartes .carre .carte > .recto,
.panneau .panneau-cartes .carre .carte > .verso {
	height: 13.5rem;
}

.panneau .panneau-cartes .carte > .recto {
    transform: rotateY(0deg);
	background-size: cover;
}

.panneau .panneau-cartes .carte > .verso {
    position: absolute;
    opacity: 0;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
	background-size: contain;
    transform: rotateX(-180deg);
}

.panneau .panneau-cartes .carte.flip > .recto {
    transform: rotateX(180deg);
}

.panneau .panneau-cartes .carte.flip > .verso {
    opacity: 1;
    transform: rotateX(0deg);
}

.panneau .panneau-cartes .carte > .verso p {
    font-size: 1.5em;
    line-height: 1.4;
	font-weight: 400;
	text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.3);
}

.panneau .panneau-cartes .items .carte > .verso p {
    font-size: 0.75em;
}

.panneau .panneau-cartes .carte > .recto > div,
.panneau .panneau-cartes .carte > .verso > div {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
    height: 100%;
	padding: 1em;
	border-radius: 0.5rem;
}

.panneau .panneau-cartes .carte > .recto > div,
.panneau .panneau-cartes .carte > .verso > div {
	background-size: cover;
	background-position: center;
	background-repeat: no-repeat;
}

.panneau .panneau-cartes span.conteneur-chargement {
	width: 2.4rem;
}

.panneau .panneau-cartes span.conteneur-chargement .chargement {
	display: inline-block;
	border: 0.4rem solid #ddd;
	border-top: 0.4rem solid #00ced1;
	border-radius: 50%;
	width: 2.4rem;
	height: 2.4rem;
	animation: rotation 0.7s linear infinite;
}

.panneau .panneau-cartes .fond-verso,
.panneau .panneau-cartes .fond-recto {
	width: 4.1rem;
}

.panneau .panneau-cartes .fond-verso.image,
.panneau .panneau-cartes .fond-recto.image {
	position: absolute;
	top: 0;
	bottom: 0;
    right: 4.1rem;
	background-size: cover;
	background-position: center;
	background-repeat: no-repeat;
	border-top-right-radius: 0.4rem;
	border-bottom-right-radius: 0.4rem;
}

.panneau .panneau-cartes input[type="search"] {
	width: calc(100% - 8.2rem);
	margin: 0;
}

.panneau .panneau-cartes input.avec-image {
	border-top-right-radius: 0;
	border-bottom-right-radius: 0;
}

.panneau .panneau-cartes .supprimer-fond,
.panneau .panneau-cartes .supprimer-image {
	width: 3.6rem;
	line-height: 4rem;
	font-size: 2.4rem;
	cursor: pointer;
}

.panneau .panneau-cartes .supprimer-fond {
	margin-left: 0.5rem;
}

.panneau .panneau-cartes .supprimer-image {
	margin-left: 4.6rem;
}

.panneau .panneau-cartes input[type="color"] {
	width: 3.6rem;
	height: 3.6rem;
	border: none;
	margin-left: 0.5rem;
	cursor: pointer;
}

.panneau .panneau-cartes input[type="color"]::-moz-color-swatch {
	border: 1px solid #ddd;
	border-radius: 50%;
}

.panneau .panneau-cartes input[type="color"]::-webkit-color-swatch {
	border: 1px solid #ddd;
	border-radius: 50%;
}

.panneau .panneau-cartes input[type="color"]::-webkit-color-swatch-wrapper {
	padding: 0;
}
</style>
