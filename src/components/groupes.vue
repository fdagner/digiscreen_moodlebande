<template>
	<JsPanel class="panneau" :visible="!chargement" :options="options">
		<div class="conteneur-gauche" />
		<div class="conteneur panneau-groupes">
			<div class="contenu" v-if="mode === 'edition'">
				<label>{{ $t('listePersonnes') }}</label>
				<span class="consigne" v-html="$t('consigneGroupe')" />
				<textarea class="groupes" :value="texte" @input="texte = $event.target.value" :placeholder="$t('exempleGroupe')"></textarea>
				<label>{{ $t('nombrePersonnesGroupe') }}</label>
				<input type="number" :value="personnes" :min="1" @input="personnes = $event.target.value">
				<span class="bouton" role="button" tabindex="0" @click="generer">{{ $t('valider') }}</span>
			</div>
			<div class="contenu" v-else>
				<div class="groupes">
					<div class="groupe" v-for="(groupe, index) in groupes" :key="'groupe_' + index">
						<div>{{ $t('groupe') }} {{ index + 1 }}</div>
						<draggable v-model="groupes[index]" group="groupe" tag="ul">
							<li v-for="(personne, indexPersonne) in groupe" :key="personne + '_' + indexPersonne">{{ personne }}</li>
						</draggable>
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
	name: 'PGroupes',
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
			minw: 32,
			minh: 28,
			statut: '',
			dimensions: {},
			position: {},
			donnees: { w: 0, h: 0, x: 0, y: 0 },
			texte: '',
			personnes: 1,
			groupes: []
		}
	},
	watch: {
		export: function (valeur) {
			if (valeur === true) {
				this.position = { x: this.x, y: this.y }
				this.$emit('export', { id: this.id, titre: this.titre, mode: this.mode, statut: this.statut, dimensions: this.dimensions, position: this.position, contenu: { texte: this.texte, personnes: this.personnes, groupes: this.groupes }, w: this.w, h: this.h, x: this.x, y: this.y })
			}
		}
	},
	created () {
		this.definirCaracteristiques('groupes')
		if (this.panneau.contenu !== '') {
			this.texte = this.panneau.contenu.texte
			this.personnes = this.panneau.contenu.personnes
			this.groupes = this.panneau.contenu.groupes
		}
		if (this.mode === 'lecture') {
			this.redimensionnement = true
		}
		this.genererOptions('groupes')
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
				let liste = this.texte.split(',').map(item => item.trim())
				liste = liste.filter(item => item !== '')
				liste = this.melanger(liste)
				const nombrePersonnes = parseInt(this.personnes)
				if (liste.length > 0 && nombrePersonnes > 0) {
					let nombreGroupes = Math.ceil(liste.length / nombrePersonnes)
					let indexPersonne = 0
					while (nombreGroupes > 0) {
						const groupe = []
						let i
						if (nombreGroupes < 1) {
							while (indexPersonne < liste.length) {
								groupe[groupe.length] = liste[indexPersonne]
								indexPersonne++
							}
						} else {
							for (i = nombrePersonnes; i > 0 ; i--) {
								groupe[groupe.length] = liste[indexPersonne]
								indexPersonne++
							}
						}
						this.groupes[this.groupes.length] = groupe
						nombreGroupes--
					}
				}
				if (this.donnees.w > 0 && this.donnees.h > 0) {
					this.w = this.donnees.w
					this.h = this.donnees.h
				} else {
					this.w = 64
					this.h = 48
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
			this.groupes = []
			this.donnees.w = this.w
			this.donnees.h = this.h
			this.donnees.x = this.x
			this.donnees.y = this.y
			this.w = 46
			this.h = 42
			this.positionner()
		}
	}
}
</script>

<style>
.panneau .conteneur textarea.groupes {
	height: 15rem;
	max-height: 15rem;
	margin-bottom: 2rem;
}

.panneau .conteneur div.groupes {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
}

.panneau .conteneur .groupe {
    border: 1px solid #ddd;
    width: 28rem;
    padding: 1.5rem 1rem;
    margin: 1rem;
    font-size: 2.4rem;
}

.panneau .conteneur .groupe div {
    padding-bottom: 1.5rem;
    border-bottom: 1px solid #ddd;
    margin-bottom: 1.5rem;
    font-weight: 700;
}

.panneau .conteneur .groupe ul {
	width: 100%;
	height: calc(100% - 6rem);
    list-style: none;
}

.panneau .conteneur .groupe li {
    margin-bottom: 1rem;
    line-height: 1.4;
	cursor: move;
}

.panneau .conteneur .groupe li:last-child {
    margin-bottom: 0;
}
</style>
