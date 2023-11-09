<template>
	<JsPanel class="panneau" :visible="!chargement" :options="options">
		<div class="conteneur-gauche" />
		<div class="conteneur panneau-ordre">
			<div class="contenu" v-if="mode === 'edition'">
				<label>{{ $t('typeRemiseOrdre') }}</label>
				<div class="type">
					<span class="horizontale">
						<input type="radio" :id="'horizontale_' + id" :name="'type_' + id" value="horizontale" :checked="type === 'horizontale'" @change="type = $event.target.value">
						<label :for="'horizontale_' + id">{{ $t('horizontale') }}</label>
					</span>
					<span class="verticale">
						<input type="radio" :id="'verticale_' + id" :name="'type_' + id" value="verticale" :checked="type === 'verticale'" @change="type = $event.target.value">
						<label :for="'verticale_' + id">{{ $t('verticale') }}</label>
					</span>
				</div>
				<label>{{ $t('itemsOrdre') }}</label>
				<div class="items">
					<input type="search" v-for="(item, index) in items" :value="item" @input="items[index] = $event.target.value" :key="'item_' + index">
				</div>
				<span class="bouton-secondaire" role="button" tabindex="0" :title="$t('ajouterItem')" @click="ajouterItem"><i class="material-icons">add_circle_outline</i></span>
				<div class="actions">
					<span class="bouton" role="button" tabindex="0" @click="generer">{{ $t('valider') }}</span>
				</div>
			</div>
			<div class="contenu" v-else>
				<div class="items" :class="{'horizontale': type === 'horizontale', 'verticale': type === 'verticale', 'plein-ecran': statut === 'max'}">
					<div class="item" v-for="(item, index) in itemsMelanges" :class="{'correct': resultat === 'correct'}" :key="'item_' + index">
						<span>{{ item }}</span>
					</div>
				</div>
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
import Panneau from '@/panneau'
import Sortable from 'sortablejs'

export default {
	name: 'POrdre',
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
			minw: 30,
			minh: 15,
			statut: '',
			dimensions: {},
			position: {},
			donnees: { w: 0, h: 0, x: 0, y: 0 },
			type: 'horizontale',
			items: ['', '', '', '', ''],
			itemsMelanges: [],
			resultat: '',
			sortable: ''
		}
	},
	watch: {
		export: function (valeur) {
			if (valeur === true) {
				this.position = { x: this.x, y: this.y }
				this.$emit('export', { id: this.id, titre: this.titre, mode: this.mode, statut: this.statut, dimensions: this.dimensions, position: this.position, contenu: { items: this.items, type: this.type }, w: this.w, h: this.h, x: this.x, y: this.y })
			}
		}
	},
	created () {
		this.definirCaracteristiques('remiseOrdre')
		if (this.panneau.contenu !== '') {
			this.items = this.panneau.contenu.items
			this.type = this.panneau.contenu.type
			this.itemsMelanges = this.melanger(JSON.parse(JSON.stringify(this.items)))
		}
		if (this.mode === 'lecture') {
			this.redimensionnement = true
		}
		this.genererOptions('ordre')
	},
	mounted () {
		this.initialiser()
		this.positionner()
		this.chargement = false
		if (this.mode === 'lecture') {
			this.$nextTick(function () {
				this.sortable = new Sortable(document.querySelector('#' + this.id + ' .conteneur .items'), {
					sort: true,
					delay: 0,
					delayOnTouchOnly: false,
					touchStartThreshold: 0,
					animation: 150,
					easing: 'cubic-bezier(1, 0, 0, 1)',
					draggable: '.item',
					filter: '.item.correct',
					preventOnFilter: true
				})
			}.bind(this))
		}
	},
	methods: {
		generer () {
			if (this.items.length > 0) {
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
				this.items.forEach(function (item, index) {
					this.items[index] = item.trim()
				}.bind(this))
				this.items = this.items.filter(function (element) {
					return element !== ''
				})
				this.itemsMelanges = this.melanger(JSON.parse(JSON.stringify(this.items)))
				this.$nextTick(function () {
					this.sortable = new Sortable(document.querySelector('#' + this.id + ' .conteneur .items'), {
						sort: true,
						delay: 0,
						delayOnTouchOnly: false,
						touchStartThreshold: 0,
						animation: 150,
						easing: 'cubic-bezier(1, 0, 0, 1)',
						draggable: '.item',
						filter: '.item.correct',
						preventOnFilter: true
					})
				}.bind(this))
			}
		},
		editer () {
			this.$nextTick(function () {
				this.sortable.destroy()
				this.mode = 'edition'
				this.redimensionnement = false
				this.itemsMelanges = []
				this.resultat = ''
				this.sortable = ''
				this.donnees.w = this.w
				this.donnees.h = this.h
				this.donnees.x = this.x
				this.donnees.y = this.y
				this.w = 46
				this.h = 50.4
				this.positionner()
			}.bind(this))
		},
		verifier () {
			const reponse = []
			var elements = document.querySelectorAll('#' + this.id + ' .items .item')
			elements.forEach(function (element) {
				reponse.push(element.textContent)
			})
			if (this.items.toString() === reponse.toString()) {
				this.resultat = 'correct'
				this.lancerConfettis()
			} else {
				this.resultat = 'incorrect'
			}
		},
		ajouterItem () {
			this.items.push('')
		}
	}
}
</script>

<style>
.panneau .panneau-ordre .type {
	margin-bottom: 2rem;
}

.panneau .panneau-ordre .type label {
	display: inline-block;
	width: auto;
	font-size: 1.6rem;
	font-weight: 400;
    margin-left: 1rem;
	margin-bottom: 0;
}

.panneau .panneau-ordre .horizontale {
	margin-right: 2.5rem;
}

.panneau .panneau-ordre .items .item {
    padding: 0.5rem 1.5rem;
    border: 1px solid #ddd;
    border-radius: 0.4rem;
	font-size: 3.2rem;
	font-weight: 400;
	line-height: 1.4;
	cursor: move;
	background: #fff;
}

.panneau .panneau-ordre .items .item.correct {
    color: #00b894;
    border: 1px solid #00b894;
	cursor: default;
}

.panneau .panneau-ordre .items.horizontale .item {
	display: inline-block;
	margin: 0.5rem;
}

.panneau .panneau-ordre .items.verticale .item {
	display: block;
	margin: 1rem 0;
}

.panneau .panneau-ordre .items.plein-ecran .item {
	font-size: 4.5rem;
}

.panneau .panneau-ordre .items.plein-ecran.horizontale .item {
	margin: 0.75rem;
}

.panneau .panneau-ordre .items.plein-ecran.verticale .item {
	margin: 1.25rem 0;
}
</style>
