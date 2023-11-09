<template>
	<JsPanel class="panneau" :visible="!chargement" :options="options">
		<div class="conteneur-gauche" />
		<div class="conteneur panneau-lien" v-if="mode === 'edition'">
			<div class="contenu" v-show="!chargementIcone">
				<label>{{ $t('lien') }}</label>
				<input type="search" class="lien" :value="lien" @input="lien = $event.target.value" @keydown.enter="generer">
				<label>{{ $t('titreLien') }}</label>
				<input type="search" class="titre-lien" :value="titreLien" @input="titreLien = $event.target.value" @keydown.enter="generer">
				<span class="bouton" role="button" tabindex="0" @click="generer">{{ $t('valider') }}</span>
			</div>
			<div class="contenu" v-show="chargementIcone">
				<div class="conteneur-chargement">
					<div class="chargement" />
				</div>
			</div>
		</div>
		<div class="conteneur panneau-lien" v-else>
			<label v-if="titreLien !== ''"><a :href="lien" target="_blank" rel="noreferrer">{{ titreLien }}</a></label>
			<a class="icone" :href="lien" target="_blank" rel="noreferrer" v-if="icone === 'defaut'"><i class="material-icons">open_in_new</i></a>
			<a class="favicon" :href="lien" target="_blank" rel="noreferrer" v-else><img :src="icone" :width="60" :height="60" :alt="titreLien" onerror="this.onerror=null;this.src='./static/img/lien.png';"></a>
		</div>
		<div class="conteneur-droite" />
		<div class="conteneur-bas" />
	</JsPanel>
</template>

<script>
import JsPanel from '@/components/jspanel.vue'
import Panneau from '@/panneau'

export default {
	name: 'PLien',
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
			minw: 22,
			minh: 18,
			statut: '',
			dimensions: {},
			position: {},
			donnees: { w: 0, h: 0, x: 0, y: 0 },
			lien: '',
			titreLien: '',
			icone: 'defaut',
			chargementIcone: false
		}
	},
	watch: {
		export: function (valeur) {
			if (valeur === true) {
				this.position = { x: this.x, y: this.y }
				this.$emit('export', { id: this.id, titre: this.titre, mode: this.mode, statut: this.statut, dimensions: this.dimensions, position: this.position, contenu: { lien: this.lien, titreLien: this.titreLien, icone: this.icone }, w: this.w, h: this.h, x: this.x, y: this.y })
			}
		}
	},
	created () {
		this.definirCaracteristiques('lien')
		if (this.panneau.contenu !== '') {
			this.lien = this.panneau.contenu.lien
			this.titreLien = this.panneau.contenu.titreLien
			if (this.panneau.contenu.hasOwnProperty('icone') && !this.panneau.contenu.icone.includes('ladigitale.dev/favicons')) {
				this.icone = this.panneau.contenu.icone
			}
		}
		this.genererOptions('lien')
	},
	mounted () {
		this.initialiser()
		this.positionner()
		this.chargement = false
		if (this.mode === 'edition' && this.statut !== 'min' && this.lien === '') {
			this.$nextTick(function () {
				document.querySelector('#' + this.id + ' input').focus()
			}.bind(this))
		}
	},
	methods: {
		generer () {
			if (this.verifierURL(this.lien) === true) {
				this.chargementIcone = true
				const url = new URL(this.lien)
				const domaine = url.hostname
				const chemin = url.pathname
				const protocole = url.protocol
				const xhr = new XMLHttpRequest()
				xhr.onload = function () {
					if (xhr.readyState === xhr.DONE && xhr.status === 200) {
						const donnees = xhr.responseText
						if (donnees !== '' && this.verifierURL(donnees) === true) {
							this.icone = donnees
						} else if (donnees !== '' && donnees.substring(0, 2) === './') {
							this.icone = protocole + '//' + domaine + chemin + donnees.substring(2)
						} else if (donnees !== '' && donnees.substring(0, 1) === '/') {
							this.icone = protocole + '//' + domaine + chemin + donnees.substring(1)
						} else if (donnees !== '') {
							this.icone = protocole + '//' + domaine + chemin + donnees
						} else {
							this.icone = 'defaut'
						}
						if (this.titreLien !== '') {
							this.titre = this.titreLien
						} else {
							this.titre = this.$t('lien')
						}
						this.mode = 'lecture'
						this.w = 22
						this.h = 18
						this.positionner()
					}
					this.chargementIcone = false
				}.bind(this)
				xhr.open('POST', window.location.href.split('?')[0] + 'inc/recuperer_icone.php', true)
				xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
				xhr.send('lien=' + domaine)
			}
		},
		editer () {
			this.mode = 'edition'
			this.w = 40
			this.h = 28
			this.positionner()
		}
	}
}
</script>

<style>
.panneau .panneau-lien {
	text-align: center;
}

.panneau .panneau-lien .conteneur-chargement {
	font-size: 0;
	line-height: 1;
	text-align: center;
}

.panneau .panneau-lien .chargement {
	display: inline-block;
	border: 7px solid #ddd;
	border-top: 7px solid #00ced1;
	border-radius: 50%;
	width: 45px;
	height: 45px;
	animation: rotation 0.7s linear infinite;
}

.panneau .panneau-lien input.lien {
	margin-bottom: 2rem;
}

.panneau .panneau-lien a.icone {
	font-size: 7.2rem;
}

.panneau .panneau-lien a.favicon {
	font-size: 0;
}
</style>
