<template>
	<JsPanel class="panneau" :visible="!chargement" :options="options">
		<div class="conteneur-gauche" />
		<div class="conteneur panneau-plateau" v-if="mode === 'edition'">
			<div class="contenu" v-if="!chargementImage">
				<label>{{ $t('plateauJeu') }}</label>
				<img class="plateau" :src="image" alt="Plateau">
				<div class="separateur"><span>{{ $t('ou') }}</span></div>
				<label class="bouton" role="button" tabindex="0" :for="'selectionner-plateau-' + id">{{ $t('selectionnerImage') }}</label>
				<input :id="'selectionner-plateau-' + id" type="file" @change="televerserImage" style="display: none" accept=".jpg, .jpeg, .png, .gif">
				<label>{{ $t('nombrePions') }}</label>
				<input type="number" :value="pions" :min="2" :max="12" @input="pions = parseInt($event.target.value)">
				<span class="bouton" role="button" tabindex="0" @click="generer">{{ $t('valider') }}</span>
			</div>
			<div class="contenu" v-else>
				<div class="conteneur-chargement">
					<div class="chargement" />
				</div>
			</div>
		</div>
		<div class="conteneur panneau-plateau" v-else>
			<div class="conteneur-plateau">
				<div class="plateau" :style="'background-image: url(' + image + ')'" />
				<div class="pions">
					<img :id="'pion_' + pion + '_' + id" class="pion" v-for="pion in pions" :src="'./static/img/plateau/pion' + pion + '.png'" :key="'pion_' + pion + '_' + id">
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
import interact from 'interactjs'

export default {
	name: 'PPlateau',
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
			image: './static/img/plateau/plateau.png',
			pions: 2,
			chargementImage: false
		}
	},
	watch: {
		export: function (valeur) {
			if (valeur === true) {
				this.position = { x: this.x, y: this.y }
				this.$emit('export', { id: this.id, titre: this.titre, mode: this.mode, statut: this.statut, dimensions: this.dimensions, position: this.position, contenu: { image: this.image, pions: this.pions }, w: this.w, h: this.h, x: this.x, y: this.y })
			}
		}
	},
	created () {
		this.definirCaracteristiques('plateauJeu')
		if (this.panneau.contenu !== '') {
			this.image = this.panneau.contenu.image
			this.pions = this.panneau.contenu.pions
		}
		this.genererOptions('plateau')
	},
	mounted () {
		this.initialiser()
		this.positionner()
		this.chargement = false
		if (this.mode === 'lecture') {
			this.redimensionnement = true
			this.activerPions()
			this.positionner()
		}
	},
	methods: {
		generer () {
			if (this.image !== '' && this.pions > 1 && this.pions < 13) {
				this.mode = 'lecture'
				this.redimensionnement = true
				if (this.donnees.w > 0 && this.donnees.h > 0) {
					this.w = this.donnees.w
					this.h = this.donnees.h
				} else {
					this.w = 88
					this.h = 60
				}
				if (this.donnees.x > 0 && this.donnees.y > 0) {
					this.x = this.donnees.x
					this.y = this.donnees.y
				}
				this.activerPions()
				this.positionner()
			}
		},
		editer () {
			this.mode = 'edition'
			this.redimensionnement = false
			this.chargementImage = false
			this.donnees.w = this.w
			this.donnees.h = this.h
			this.donnees.x = this.x
			this.donnees.y = this.y
			this.w = 40
			this.h = 50
			this.positionner()
			this.desactiverPions()
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
		activerPions () {
			interact('#' + this.id + ' .pion').draggable({
				modifiers: [
					interact.modifiers.restrictRect({
						restriction: '#' + this.id + ' .conteneur-plateau',
						endOnly: false
					})
				],
				listeners: {
					move: function (event) {
						const cible = event.target
						const x = (parseFloat(cible.getAttribute('data-x')) || 0) + event.dx
						const y = (parseFloat(cible.getAttribute('data-y')) || 0) + event.dy
						cible.style.transform = 'translate(' + x + 'px, ' + y + 'px)'
						cible.setAttribute('data-x', x)
						cible.setAttribute('data-y', y)
					}
				}
			})
		},
		desactiverPions () {
			interact('#' + this.id + ' .pion').unset()
		}
	}
}
</script>

<style>
.panneau .panneau-plateau .conteneur-chargement {
	font-size: 0;
	line-height: 1;
	text-align: center;
}

.panneau .panneau-plateau .chargement {
	display: inline-block;
	border: 7px solid #ddd;
	border-top: 7px solid #00ced1;
	border-radius: 50%;
	width: 45px;
	height: 45px;
	animation: rotation 0.7s linear infinite;
}

.panneau .panneau-plateau img.plateau {
	max-width: 100%;
	max-height: 16rem;
}

.panneau .panneau-plateau .separateur {
    position: relative;
    margin: 2rem 25% 2rem;
    text-align: center;
    width: 50%;
}

.panneau .panneau-plateau .separateur::before {
    position: absolute;
    top: 50%;
    display: block;
    content: '';
    width: 100%;
    height: 1px;
    background-color: #ddd;
}

.panneau .panneau-plateau .separateur span {
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

.panneau .panneau-plateau label.bouton {
	width: auto!important;
    display: inline-block!important;
	margin-top: 0;
	margin-bottom: 2rem!important;
}

.panneau .panneau-plateau .conteneur-plateau {
	width: 100%;
	height: 100%;
}

.panneau .panneau-plateau div.plateau {
	margin-top: 3rem;
	background-position: center;
	background-repeat: no-repeat;
	background-size: contain;
	width: 100%;
	height: calc(100% - 10rem);
}

.panneau .panneau-plateau .pions {
	display: flex;
	justify-content: space-around;
	align-items: flex-end;
	width: 100%;
	height: 7rem;
}

.panneau .panneau-plateau .pions img {
	max-width: 100%;
	height: 5.5rem;
}
</style>
