<template>
	<JsPanel class="panneau" :visible="!chargement" :options="options">
		<div class="conteneur-gauche" />
		<div class="conteneur panneau-surlignage">
			<div class="contenu" v-if="mode === 'edition'">
				<label>{{ $t('texte') }}</label>
				<textarea class="surlignage" :value="texte" @input="texte = $event.target.value"></textarea>
				<span class="bouton" role="button" tabindex="0" @click="generer">{{ $t('valider') }}</span>
			</div>
			<div class="contenu" v-else>
				<div class="surligneurs">
					<span class="surligneur jaune" :class="{'actif': surligneur === '#faff00'}" @click="surligneur = '#faff00'" />
					<span class="surligneur vert" :class="{'actif': surligneur === '#00ff00'}" @click="surligneur = '#00ff00'" />
					<span class="surligneur rose" :class="{'actif': surligneur === '#fb3bc3'}" @click="surligneur = '#fb3bc3'" />
					<span class="surligneur bleu" :class="{'actif': surligneur === '#04fdff'}" @click="surligneur = '#04fdff'" />
				</div>
				<div class="surlignage" :class="{'plein-ecran': statut === 'max'}">
					<template v-for="(item, index) in items">
						<template v-if="item !== '<br>' && item !== ''">
							<span :style="{'background': definirCouleur(index)}" @click="surligner(index)" v-if="itemsSurlignes.map(function (i) { return i.index }).includes(index)" :key="'item_surligne_' + index + '_' + item">{{ item }}</span>
							<span @click="surligner(index)" v-else :key="'item_' + index + '_' + item">{{ item }}</span>
						</template>
						<template v-else-if="item === '<br>'">
							<br :key="'item_br_' + index + '_' + item">
						</template>
					</template>
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
	name: 'PSurlignage',
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
			texte: '',
			items: [],
			itemsSurlignes: [],
			surligneur: '#faff00'
		}
	},
	watch: {
		export: function (valeur) {
			if (valeur === true) {
				this.position = { x: this.x, y: this.y }
				this.$emit('export', { id: this.id, titre: this.titre, mode: this.mode, statut: this.statut, dimensions: this.dimensions, position: this.position, contenu: { texte: this.texte, itemsSurlignes: this.itemsSurlignes }, w: this.w, h: this.h, x: this.x, y: this.y })
			}
		}
	},
	created () {
		this.definirCaracteristiques('surlignage')
		if (this.panneau.contenu !== '') {
			this.texte = this.panneau.contenu.texte
			this.itemsSurlignes = this.panneau.contenu.itemsSurlignes
		}
		if (this.mode === 'lecture') {
			this.redimensionnement = true
			this.creer()
		}
		this.genererOptions('surlignage')
	},
	mounted () {
		this.initialiser()
		this.positionner()
		this.chargement = false
		if (this.mode === 'edition' && this.statut !== 'min' && this.texte === '') {
			this.$nextTick(function () {
				document.querySelector('#' + this.id + ' textarea').focus()
			}.bind(this))
		}
	},
	methods: {
		generer () {
			if (this.texte !== '') {
				this.mode = 'lecture'
				this.redimensionnement = true
				if (this.donnees.w > 0 && this.donnees.h > 0) {
					this.w = this.donnees.w
					this.h = this.donnees.h
				} else {
					this.w = 60
					this.h = 36
				}
				if (this.donnees.x > 0 && this.donnees.y > 0) {
					this.x = this.donnees.x
					this.y = this.donnees.y
				}
				this.positionner()
				this.creer()
			}
		},
		creer () {
			const texte = this.texte.replace(/(?:\r|\n|\r\n)/g, ' <br> ')
			const items = texte.split(' ')
			this.items = items
		},
		editer () {
			this.mode = 'edition'
			this.redimensionnement = false
			this.items = []
			this.itemsSurlignes = []
			this.surligneur = '#faff00'
			this.donnees.w = this.w
			this.donnees.h = this.h
			this.donnees.x = this.x
			this.donnees.y = this.y
			this.w = 46
			this.h = 36
			this.positionner()
		},
		surligner (item) {
			if (this.itemsSurlignes.map(function (i) { return i.index }).includes(item)) {
				const index = this.itemsSurlignes.map(function (i) { return i.index }).indexOf(item)
				if (this.itemsSurlignes[index].couleur === this.surligneur) {
					this.itemsSurlignes.splice(index, 1)
				} else {
					this.itemsSurlignes[index].couleur = this.surligneur
				}
			} else {
				this.itemsSurlignes.push({ index: item, couleur: this.surligneur })
			}
		},
		definirCouleur (index) {
			let couleur = ''
			this.itemsSurlignes.forEach(function (item) {
				if (item.index === index) {
					couleur = item.couleur
				}
			})
			return couleur
		}
	}
}
</script>

<style>
.panneau .conteneur textarea.surlignage {
	height: 21rem;
    max-height: 21rem;
}

.panneau .conteneur .surligneurs {
	display: flex;
	justify-content: center;
	margin-bottom: 2rem;
}

.panneau .conteneur .surligneur {
	display: inline-block;
	width: 4rem;
	height: 4rem;
	border-radius: 50%;
	margin: 0 1rem;
	cursor: pointer;
}

.panneau .conteneur .surligneur.jaune {
	background: #faff00;
}

.panneau .conteneur .surligneur.vert {
	background: #00ff00;
}

.panneau .conteneur .surligneur.rose {
	background: #fa35c2;
}

.panneau .conteneur .surligneur.bleu {
	background: #04fdff;
}

.panneau .conteneur .surligneur.actif {
	border-radius: 4px;
}

.panneau .conteneur div.surlignage {
	text-align: left;
}

.panneau .conteneur div.surlignage span {
	display: inline-flex;
	font-size: 3.2rem;
	font-weight: 400;
    vertical-align: middle;
	margin-right: 1rem;
	line-height: 2;
	cursor: pointer;
}

.panneau .conteneur div.surlignage.plein-ecran span {
	font-size: 4.5rem;
}
</style>
