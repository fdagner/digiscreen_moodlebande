<template>
	<JsPanel class="panneau" :visible="!chargement" :options="options">
		<div class="conteneur-gauche" />
		<div class="conteneur panneau-histoire">
			<div class="contenu" v-if="mode === 'edition'">
				<label>{{ $t('nombreImages') }} (3 - 10)</label>
				<input type="number" :value="images" :min="3" :max="10" @input="images = parseInt($event.target.value)" @keydown.enter="generer">
				<span class="bouton" role="button" tabindex="0" @click="generer">{{ $t('valider') }}</span>
			</div>
			<div class="contenu" v-else>
				<div class="histoire">
					<img :src="'./static/img/pictogrammes/' + image" v-for="(image, index) in selection" :key="'image_' + index" :alt="image">
				</div>
				<div class="source"><a href="https://arasaac.org" target="_blank">{{ $t('sourceImages') }}&nbsp;: ARASAAC. Licence&nbsp;: CC (BY-NC-SA)</a></div>
				<span class="bouton" role="button" tabindex="0" @click="selectionner">{{ $t('generer') }}</span>
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
	name: 'PHistoire',
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
			minh: 22,
			statut: '',
			dimensions: {},
			position: {},
			donnees: { x: 0, y: 0 },
			pictogrammes: ['aeroport.png', 'amour.png', 'ampoule.png', 'anniversaire.png', 'appareil-photo.png', 'argent.png', 'autobus.png', 'automne.png', 'avalanche.png', 'baleine.png', 'ballon-air.png', 'ballon.png', 'banque.png', 'bar.png', 'bar-restaurant.png', 'basket-fauteuil.png', 'bateau-pirate.png', 'bateau.png', 'bibliotheque.png', 'bicyclette.png', 'big-ben.png', 'bijoux.png', 'boite.png', 'bouee-sauvetage.png', 'boulangerie.png', 'bouteille.png', 'boutique-de-cadeaux.png', 'buvette.png', 'cafe.png', 'camion-de-pompiers.png', 'camping-car.png', 'canard-plastique.png', 'canard.png', 'capitole.png', 'carafe.png', 'carte.png', 'cartes.png', 'caserne-de-pompiers.png', 'casque-de-protection.png', 'cassette-video.png', 'chaise.png', 'champignons.png', 'chapeau-melon.png', 'chapiteau.png', 'charcuterie.png', 'chateau.png', 'chat.png', 'chaussures-de-montagne.png', 'chaussures-de-sport.png', 'cheval.png', 'chien.png', 'chocolat.png', 'cinema.png', 'ciseaux.png', 'cles.png', 'coccinelle.png', 'cocotier.png', 'coffre-fort.png', 'coffre.png', 'colisee.png', 'commissariat.png', 'console.png', 'coquillages.png', 'courses.png', 'couverts.png', 'crevaison.png', 'crocodile.png', 'cygne.png', 'danseurs.png', 'dinosaure-peluche.png', 'diplôme.png', 'disque.png', 'donut.png', 'dromadaire.png', 'eau-gazeuse.png', 'eau.png', 'echiquier.png', 'ecureuil.png', 'elephant.png', 'eolienne.png', 'eruption-volcanique.png', 'essaim-abeilles.png', 'ete.png', 'etoile-de-mer.png', 'fer-cheval.png', 'fete.png', 'feu.png', 'flan-caramel.png', 'fleuve.png', 'foret.png', 'fromage.png', 'fruiterie.png', 'fruits-de-mer.png', 'fruits.png', 'fusee.png', 'galerie-d-art.png', 'gateau-creme.png', 'guitare.png', 'hamburger-frites.png', 'hiver.png', 'hopital.png', 'hotel.png', 'igloo.png', 'jo.png', 'jumelles.png', 'jus-de-pomme.png', 'jus-d-orange.png', 'kangourou.png', 'kayak.png', 'lait-amande.png', 'lait.png', 'lampe-de-poche.png', 'lampe.png', 'legumes.png', 'lentilles.png', 'librairie.png', 'lion.png', 'lit.png', 'longue-vue.png', 'loup.png', 'machine-a-laver.png', 'magasin-de-bijoux.png', 'magasin-de-bonbons.png', 'magasin-de-fleurs.png', 'magasin-de-glaces.png', 'magasin-de-sport.png', 'magasin-de-vetements.png', 'maison.png', 'manette.png', 'masques.png', 'mate.png', 'matin.png', 'medaille-argent.png', 'medaille-bronze.png', 'medaille-or.png', 'metro.png', 'monospace.png', 'montagne.png', 'montre.png', 'moto.png', 'muraille-chine.png', 'musique.png', 'noel.png', 'nuage.png', 'nuit.png', 'oeufs-paques.png', 'oeufs.png', 'oie.png', 'opera-sydney.png', 'orage.png', 'ordinateur.png', 'ordinateur-portable.png', 'ours.png', 'ovni.png', 'palmier.png', 'parapluie.png', 'parasol.png', 'parc.png', 'parfumerie.png', 'pates.png', 'patins.png', 'pendule.png', 'phare.png', 'pharmacie.png', 'pile.png', 'pingouin.png', 'piscine.png', 'pizzeria.png', 'pluie.png', 'podium.png', 'poisson.png', 'pomme-de-pin.png', 'portable.png', 'porte-de-brandebourg.png', 'poubelle.png', 'poulet.png', 'printemps.png', 'puzzle.png', 'quilles.png', 'refrigerateur.png', 'reveil-matin.png', 'rose.png', 'sablier.png', 'sac-sport.png', 'sagrada-familia.png', 'salon-de-coiffure.png', 'sandwich.png', 'sapin.png', 'scooter.png', 'scorpion.png', 'serpent.png', 'serviette-de-bain.png', 'sifflet.png', 'soja.png', 'soleil.png', 'sphynx.png', 'sport.png', 'statue-de-la-liberte.png', 'supermarche.png', 'table-de-pique-nique.png', 'tablette.png', 'taj-mahal.png', 'talkies-walkies.png', 'tarentule.png', 'tarte.png', 'taxi.png', 'tempete.png', 'tente.png', 'the-glace.png', 'the.png', 'tigre.png', 'tong.png', 'tonneau.png', 'torche.png', 'tornade.png', 'tortue.png', 'tour-eiffel.png', 'train.png', 'trottinette.png', 'tv.png', 'vache.png', 'valise.png', 'viande.png', 'village.png', 'ville.png', 'vin.png', 'voiture-de-sport.png', 'voiture.png'],
			images: 5,
			selection: []
		}
	},
	watch: {
		export: function (valeur) {
			if (valeur === true) {
				this.position = { x: this.x, y: this.y }
				this.$emit('export', { id: this.id, titre: this.titre, mode: this.mode, statut: this.statut, dimensions: this.dimensions, position: this.position, contenu: this.selection, w: this.w, h: this.h, x: this.x, y: this.y })
			}
		}
	},
	created () {
		this.definirCaracteristiques('histoire')
		if (this.panneau.contenu !== '') {
			this.selection = this.panneau.contenu
			if (this.selection.length > 0) {
				this.images = this.selection.length
			}
		}
		this.genererOptions('histoire')
	},
	mounted () {
		this.initialiser()
		this.positionner()
		this.chargement = false
		if (this.mode === 'edition' && this.statut !== 'min' && this.images === 5) {
			this.$nextTick(function () {
				document.querySelector('#' + this.id + ' input').focus()
			}.bind(this))
		} else if (this.mode === 'lecture') {
			this.generer()
		}
	},
	methods: {
		generer () {
			this.mode = 'lecture'
			if (this.images > 2 && this.images < 11) {
				switch (this.images) {
				case 3:
					this.w = 52
					this.h = 32
					break
				case 4:
					this.w = 69
					this.h = 32
					break
				case 5:
					this.w = 86
					this.h = 32
					break
				case 6:
					this.w = 103
					this.h = 32
					break
				case 7:
				case 8:
					this.w = 69
					this.h = 48
					break
				case 9:
				case 10:
					this.w = 86
					this.h = 48
					break
				}
				if (this.selection.length === 0) {
					this.selectionner()
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
			this.selection = []
			this.donnees.x = this.x
			this.donnees.y = this.y
			this.w = 40
			this.h = 22
			this.positionner()
		},
		selectionner () {
			const selection = []
			for (let i = 0; i < this.images;) {
				const picto = Math.floor(Math.random() * this.pictogrammes.length)
				if (selection.includes(this.pictogrammes[picto]) === true) {
					continue
				}
				selection.push(this.pictogrammes[picto])
				i++
			}
			this.selection = selection
		}
	}
}
</script>

<style>
.panneau .panneau-histoire .histoire {
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
}

.panneau .panneau-histoire .histoire img {
	max-width: 15rem;
	height: auto;
	padding: 1rem;
	margin: 0.5rem;
	border: 1px solid #ddd;
	border-radius: 0.5rem;
	background: #fff;
}

.panneau .panneau-histoire .histoire img:last-child {
	margin-right: 0;
}

.panneau .panneau-histoire .source {
	font-size: 1rem;
	margin-top: 1.5rem;
}
</style>
