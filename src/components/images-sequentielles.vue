<template>
	<JsPanel class="panneau" :visible="!chargement" :options="options">
		<div class="conteneur-gauche" />
		<div class="conteneur panneau-images-sequentielles">
			<div class="contenu" v-if="mode === 'edition'">
				<label>{{ $t('imagesOrdre') }}</label>
				<div class="zone" @dragover.prevent @drop.prevent>
					<input :id="'selectionner-images-' + id" type="file" multiple accept="image/*" @change="selectionnerImages" style="display: none;">
					<label :for="'selectionner-images-' + id" @drop="glisserImages">{{ $t('selectionnerImages') }}</label>
				</div>
				<draggable class="images" v-model="images">
					<div class="image" v-for="(image, index) in images" :key="'image_' + index">
						<img :src="image" :alt="'Image' + index">
						<span class="fermer" @click="supprimerImage(index)"><i class="material-icons">highlight_off</i></span>
					</div>
				</draggable>
				<span class="bouton" role="button" tabindex="0" @click="generer">{{ $t('valider') }}</span>
			</div>
			<div class="contenu lecture" v-else>
				<draggable class="images" v-model="imagesMelangees" filter=".image.correct" :class="{'plein-ecran': statut === 'max'}">
					<div class="image" :class="{'correct': resultat === 'correct'}" v-for="(image, index) in imagesMelangees" :key="'image_' + index">
						<img :src="image" :alt="'Image' + index">
					</div>
				</draggable>
				<div v-if="resultat === 'correct'">
					<span class="emoticones">🎉🥳</span>
					<span class="bouton correct">{{ $t('bravoExercice') }}</span>
					<span class="emoticones">🥳🎉</span>
				</div>
				<div v-else-if="resultat === 'incorrect'">
					<span class="emoticones">🙁🙁</span>
					<span class="bouton verifier" @click="verifier">{{ $t('verifier') }}</span>
					<span class="emoticones">🙁🙁</span>
				</div>
				<span class="bouton verifier" role="button" tabindex="0" v-else @click="verifier">{{ $t('verifier') }}</span>
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
	name: 'PImagesSequentielles',
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
			minw: 30,
			minh: 20,
			statut: '',
			dimensions: {},
			position: {},
			donnees: { w: 0, h: 0, x: 0, y: 0 },
			images: [],
			imagesMelangees: [],
			resultat: ''
		}
	},
	watch: {
		export: function (valeur) {
			if (valeur === true) {
				this.position = { x: this.x, y: this.y }
				this.$emit('export', { id: this.id, titre: this.titre, mode: this.mode, statut: this.statut, dimensions: this.dimensions, position: this.position, contenu: { images: this.images }, w: this.w, h: this.h, x: this.x, y: this.y })
			}
		}
	},
	created () {
		this.definirCaracteristiques('imagesSequentielles')
		if (this.panneau.contenu !== '') {
			this.images = this.panneau.contenu.images
			this.imagesMelangees = this.melanger(JSON.parse(JSON.stringify(this.images)))
		}
		if (this.mode === 'lecture' && this.images.length > 0) {
			this.redimensionnement = true
		}
		this.genererOptions('images-sequentielles')
	},
	mounted () {
		this.initialiser()
		this.positionner()
		this.chargement = false
	},
	methods: {
		generer () {
			if (this.images.length > 1) {
				this.mode = 'lecture'
				this.redimensionnement = true
				this.imagesMelangees = this.melanger(JSON.parse(JSON.stringify(this.images)))
				if (this.donnees.w > 0 && this.donnees.h > 0) {
					this.w = this.donnees.w
					this.h = this.donnees.h
				} else {
					this.w = 74
					this.h = 54
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
			this.w = 60
			this.h = 34
			this.index = 0
			this.positionner()
		},
		selectionnerImages (event) {
			for (let i = 0; i < event.target.files.length; i++) {
				const reader = new FileReader()
				reader.readAsDataURL(event.target.files[i])
				reader.onloadend = function (e) {
					const img = new Image()
					img.src = e.target.result
					img.onload = function () {
						if (img.width > 1000) {
							const canvas = document.createElement('canvas')
							const ratio = img.width / img.height
							const largeur = 1000
							const hauteur = 1000 / ratio
							canvas.width = largeur
							canvas.height = hauteur
							canvas.getContext('2d').drawImage(img, 0, 0, largeur, hauteur)
							this.images.push(canvas.toDataURL('image/jpeg', 0.85))
						} else {
							this.images.push(e.target.result)
						}
					}.bind(this)
				}.bind(this)
			}
		},
		glisserImages (event) {
			for (let i = 0; i < event.dataTransfer.files.length; i++) {
				const reader = new FileReader()
				reader.readAsDataURL(event.dataTransfer.files[i])
				reader.onloadend = function (e) {
					const img = new Image()
					img.src = e.target.result
					img.onload = function () {
						if (img.width > 1000) {
							const canvas = document.createElement('canvas')
							const ratio = img.width / img.height
							const largeur = 1000
							const hauteur = 1000 / ratio
							canvas.width = largeur
							canvas.height = hauteur
							canvas.getContext('2d').drawImage(img, 0, 0, largeur, hauteur)
							this.images.push(canvas.toDataURL('image/jpeg', 0.85))
						} else {
							this.images.push(e.target.result)
						}
					}.bind(this)
				}.bind(this)
			}
		},
		supprimerImage (index) {
			this.images.splice(index, 1)
		},
		verifier () {
			if (this.images.toString() === this.imagesMelangees.toString()) {
				this.resultat = 'correct'
				this.lancerConfettis()
			} else {
				this.resultat = 'incorrect'
			}
		}
	}
}
</script>

<style>
.panneau .panneau-images-sequentielles .contenu.lecture {
	width: 100%;
	height: 100%;
}

.panneau .panneau-images-sequentielles .zone {
	height: 7rem;
	border: 2px dashed #00ced1;
	cursor: pointer;
}

.panneau .panneau-images-sequentielles .zone label {
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

.panneau .panneau-images-sequentielles .images {
	display: flex;
	justify-content: flex-start;
	align-items: center;
	flex-wrap: wrap;
	padding: 1rem;
}

.panneau .panneau-images-sequentielles .images .image {
	position: relative;
	margin: 1rem;
	padding: 0.5rem;
	border: 1px solid #ddd;
	cursor: move;
}

.panneau .panneau-images-sequentielles .images .image img {
	width: 8.8rem;
	height: auto;
}

.panneau .panneau-images-sequentielles .images .image .fermer {
	position: absolute;
	top: -1.1rem;
	right: -1.1rem;
	font-size: 2.2rem;
	color: #777;
	background: #fff;
	border-radius: 50%;
	line-height: 1;
	cursor: pointer;
}

.panneau .panneau-images-sequentielles .contenu:not(.lecture) .bouton {
	margin-top: 0;
}

.panneau .panneau-images-sequentielles .images .image.correct {
    border: 1px solid #00b894;
	cursor: default;
}

.panneau .panneau-images-sequentielles .contenu.lecture .images {
	justify-content: center;
}

.panneau .panneau-images-sequentielles .contenu.lecture .images .image img {
	width: 27rem;
	height: auto;
}

.panneau .panneau-images-sequentielles .contenu.lecture .images.plein-ecran .image img {
	width: 32rem;
	height: auto;
}
</style>
