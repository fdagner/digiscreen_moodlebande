<template>
	<JsPanel class="panneau" :visible="!chargement" :options="options">
		<div class="conteneur-gauche" />
		<div class="conteneur panneau-trous">
			<div class="contenu" v-if="mode === 'edition'">
				<label>{{ $t('texteATrous') }}</label>
				<span class="consigne" v-html="$t('consigneTrouSimple')" />
				<span class="consigne" v-html="$t('consigneTrouSelection')" />
				<textarea class="texte-a-trous" :value="texte" @input="texte = $event.target.value" :placeholder="$t('exempleTrou')"></textarea>
				<span class="bouton" role="button" tabindex="0" @click="generer">{{ $t('valider') }}</span>
			</div>
			<div class="contenu" v-else>
				<div class="texte-a-trous" :class="{'plein-ecran': statut === 'max'}">
					<template v-for="(item, index) in exercice">
						<template v-if="Array.isArray(item)">
							<template v-for="(it, ix) in item" >
								<template v-if="it !== '<br>' && it !== ''">
									<span :key="'item_br_' + index + '_' + ix">{{ it }}</span>
								</template>
								<template v-else-if="it === '<br>' && it !== ''">
									<br :key="'item_br_' + index + '_' + ix">
								</template>
							</template>
						</template>
						<span v-else-if="item.substring(0, 5) !== 'input' && item.substring(0, 6) !== 'select'" :key="'item_txt_' + index">{{ item }}</span>
						<span v-else-if="item.substring(0, 5) === 'input'" :key="'item_input_' + index">
							<input type="text" :class="{'correct': resultat !== '' && reponse[parseInt(item.slice(-1))] === items[parseInt(item.slice(-1))]}" @change="reponse[parseInt(item.slice(-1))] = $event.target.value" :size="itemsMelanges[parseInt(item.slice(-1))].length" :disabled="resultat === 'correct'" :value="reponse[parseInt(item.slice(-1))]" @input="reponse[parseInt(item.slice(-1))] = $event.target.value">
						</span>
						<span v-else-if="item.substring(0, 6) === 'select'" :key="'item_select_' + index">
							<select :class="{'correct': resultat !== '' && reponse[parseInt(item.slice(-1))] === items[parseInt(item.slice(-1))]}" :disabled="resultat === 'correct'" @change="reponse[parseInt(item.slice(-1))] = $event.target.value">
								<option value=""></option>
								<option v-for="(option, indexOption) in itemsMelanges[parseInt(item.slice(-1))]" :value="option" :key="'option_' + indexOption">{{ option }}</option>
							</select>
						</span>
					</template>
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

export default {
	name: 'PTrous',
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
			itemsMelanges: [],
			exercice: '',
			reponse: [],
			resultat: ''
		}
	},
	watch: {
		export: function (valeur) {
			if (valeur === true) {
				this.position = { x: this.x, y: this.y }
				this.$emit('export', { id: this.id, titre: this.titre, mode: this.mode, statut: this.statut, dimensions: this.dimensions, position: this.position, contenu: this.texte, w: this.w, h: this.h, x: this.x, y: this.y })
			}
		}
	},
	created () {
		this.definirCaracteristiques('texteATrous')
		if (this.panneau.contenu !== '') {
			this.texte = this.panneau.contenu
		}
		if (this.mode === 'lecture') {
			this.redimensionnement = true
			this.creer()
		}
		this.genererOptions('trous')
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
			if (this.texte !== '' && this.texte.split(/[**]/).length > 1) {
				this.mode = 'lecture'
				this.redimensionnement = true
				if (this.donnees.w > 0 && this.donnees.h > 0) {
					this.w = this.donnees.w
					this.h = this.donnees.h
				} else {
					this.w = 60
					this.h = 30
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
			const texte = this.texte.replace(/(?:\r|\n|\r\n)/g, '<br>')
			const items = texte.split(/[**]/)
			this.items = items.filter((a, i) => i % 2 === 1)
			const itemsMelanges = JSON.parse(JSON.stringify(this.items))
			itemsMelanges.forEach(function (item, index) {
				if (item.split('|').length > 1) {
					itemsMelanges[index] = this.melanger(item.split('|'))
				}
			}.bind(this))
			this.itemsMelanges = itemsMelanges
			this.items.forEach(function (item, index) {
				if (item.split('|').length > 1) {
					this.items[index] = item.split('|')[0]
				}
			}.bind(this))
			let total = 0
			items.forEach(function (item, index) {
				if (index % 2 === 1 && item.split('|').length === 1) {
					items[index] = 'input' + total
					total++
				} else if (index % 2 === 1 && item.split('|').length > 1) {
					items[index] = 'select' + total
					total++
				} else if (item.includes('<br>')) {
					const elements = item.split('<br>')
					items[index] = elements.map((e, i) => i < elements.length - 1 ? [e, '<br>'] : [e]).reduce((a, b) => a.concat(b))
				}
			})
			this.exercice = items
			for (let i = 0; i < this.items.length; i++) {
				this.reponse.push('')
			}
		},
		editer () {
			this.mode = 'edition'
			this.redimensionnement = false
			this.items = []
			this.exercice = ''
			this.reponse = []
			this.resultat = ''
			this.donnees.w = this.w
			this.donnees.h = this.h
			this.donnees.x = this.x
			this.donnees.y = this.y
			this.w = 46
			this.h = 48
			this.positionner()
		},
		verifier () {
			if (this.items.toString() === this.reponse.toString()) {
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
.panneau .conteneur textarea.texte-a-trous {
	height: 21rem;
    max-height: 21rem;
}

.panneau .conteneur div.texte-a-trous {
	text-align: left;
}

.panneau .conteneur div.texte-a-trous span {
	font-size: 3.2rem;
	font-weight: 400;
    vertical-align: middle;
	margin-right: 1rem;
	line-height: 2;
}

.panneau .conteneur div.texte-a-trous select,
.panneau .conteneur div.texte-a-trous input {
	display: inline-block;
	width: auto;
	font-size: 3.2rem;
	font-weight: 400;
	border: none;
	border-bottom: 1px solid #00ced1;
	background-color: #e1feff;
    margin: 0 auto 0.3rem;
	text-align: left;
	line-height: 1.4;
	vertical-align: middle;
}

.panneau .conteneur div.texte-a-trous select.correct,
.panneau .conteneur div.texte-a-trous input.correct {
	border-bottom: 1px solid #00b894;
	background-color: #e6fffa;
	color: #00b894;
	opacity: 1;
}

.panneau .conteneur div.texte-a-trous input {
    padding: 0 0.5rem;
}

.panneau .conteneur div.texte-a-trous select {
    padding: 0 3rem 0 0.5rem;
}

.panneau .conteneur div.texte-a-trous.plein-ecran select,
.panneau .conteneur div.texte-a-trous.plein-ecran input,
.panneau .conteneur div.texte-a-trous.plein-ecran span {
	font-size: 4.5rem;
}
</style>
