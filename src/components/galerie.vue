<template>
	<JsPanel class="panneau" :visible="!chargement" :options="options">
		<div class="conteneur-gauche" />
		<div class="conteneur panneau-galerie">
			<div class="contenu" v-if="mode === 'edition'">
				<label>{{ $t('texteGalerie') }}</label>
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
				<div class="galerie" tabindex="-1" @keydown="gererClavier">
					<div class="diapo" v-for="(image, indexImage) in images" v-show="index === indexImage" :key="'image_' + indexImage">
						<div class="numero">{{ indexImage + 1 }} / {{ images.length }}</div>
						<img :src="image" :alt="'Image' + index">
					</div>
					<span class="diapo-precedente" role="button" tabindex="0" @click="afficherDiapoPrecedente"><i class="material-icons">navigate_before</i></span>
					<span class="diapo-suivante" role="button" tabindex="0" @click="afficherDiapoSuivante"><i class="material-icons">navigate_next</i></span>
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
	name: 'PGalerie',
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
			index: 0
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
		this.definirCaracteristiques('galerieImages')
		if (this.panneau.contenu !== '') {
			this.images = this.panneau.contenu.images
		}
		if (this.mode === 'lecture' && this.images.length > 0) {
			this.redimensionnement = true
		}
		this.genererOptions('galerie')
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
				if (this.donnees.w > 0 && this.donnees.h > 0) {
					this.w = this.donnees.w
					this.h = this.donnees.h
				} else {
					this.w = 50
					this.h = 40
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
						if (img.width > 1500) {
							const canvas = document.createElement('canvas')
							const ratio = img.width / img.height
							const largeur = 1500
							const hauteur = 1500 / ratio
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
						if (img.width > 1500) {
							const canvas = document.createElement('canvas')
							const ratio = img.width / img.height
							const largeur = 1500
							const hauteur = 1500 / ratio
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
		afficherDiapoPrecedente () {
			if (this.index === 0) {
				this.index = this.images.length - 1
			} else {
				this.index--
			}
		},
		afficherDiapoSuivante () {
			if (this.index === this.images.length - 1) {
				this.index = 0
			} else {
				this.index++
			}
		},
		gererClavier (event) {
			if (this.mode === 'lecture' && event.key === 'ArrowLeft') {
				this.afficherDiapoPrecedente()
			} else if (this.mode === 'lecture' && event.key === 'ArrowRight') {
				this.afficherDiapoSuivante()
			}
		}
	}
}
</script>

<style>
.panneau .panneau-galerie .contenu.lecture {
	width: 100%;
	height: 100%;
}

.panneau .panneau-galerie .zone {
	height: 7rem;
	border: 2px dashed #00ced1;
	cursor: pointer;
}

.panneau .panneau-galerie .zone label {
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

.panneau .panneau-galerie .images {
	display: flex;
	justify-content: flex-start;
	align-items: center;
	flex-wrap: wrap;
	padding: 1rem;
}

.panneau .panneau-galerie .images .image {
	position: relative;
	margin: 1rem;
	padding: 0.5rem;
	border: 1px solid #ddd;
	cursor: move;
}

.panneau .panneau-galerie .images .image img {
	width: 8.8rem;
	height: auto;
}

.panneau .panneau-galerie .images .image .fermer {
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

.panneau .panneau-galerie .contenu .bouton {
	margin-top: 0;
}

.panneau .panneau-galerie .galerie {
	position: relative;
	width: 100%;
	height: 100%;
	user-select: none;
}

.panneau .panneau-galerie .diapo {
	display: flex;
    justify-content: center;
	align-items: center;
	width: 100%;
	height: 100%;
	animation-name: fonduDiapo;
	animation-duration: 0.5s;
}

.panneau .panneau-galerie .galerie img {
    max-width: 100%;
	max-height: 100%;
	align-self: center;
}

.panneau .panneau-galerie .diapo-precedente,
.panneau .panneau-galerie .diapo-suivante {
	position: absolute;
	top: 50%;
	width: auto;
	margin-top: -3.9rem;
	padding: 1.2rem 1.6rem;
	color: #fff;
	font-size: 3.6rem;
	line-height: 1;
	background-color: rgba(0, 0, 0, 0.3);
	transition: 0.3s ease;
	border-radius: 3px;
	user-select: none;
	cursor: pointer;
}

.panneau .panneau-galerie .diapo-precedente {
	left: 0;
}

.panneau .panneau-galerie .diapo-suivante {
	right: 0;
}

.panneau .panneau-galerie .diapo-precedente:hover,
.panneau .panneau-galerie .diapo-suivante:hover {
	background-color: rgba(0, 0, 0, 0.7);
}

.panneau .panneau-galerie .numero {
	position: absolute;
	top: 0;
	left: 0;
	color: #fff;
	font-size: 1.5rem;
	padding: 0.8rem 1.2rem;
	background-color: rgba(0, 0, 0, 0.3);
	border-radius: 3px;
}

@keyframes fonduDiapo {
	from {
		opacity: 0.4;
	}
	to {
		opacity: 1;
	}
}
</style>
