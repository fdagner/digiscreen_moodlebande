<template>
	<JsPanel class="panneau" :visible="!chargement" :options="options">
		<div class="conteneur-gauche" />
		<div class="conteneur panneau-retroaction">
			<div class="contenu">
				<div class="retroactions">
					<span class="bouton" role="button" tabindex="0" @click="ouvrirCarte('applaudissements', 'confettis')" style="background-image: url(./static/img/retroactions/confettis.svg)" />
					<span class="bouton" role="button" tabindex="0" @click="ouvrirCarte('applaudissements', 'applaudissements')" style="background-image: url(./static/img/retroactions/applaudissements.svg)" />
					<span class="bouton" role="button" tabindex="0" @click="ouvrirCarte('victoire', 'victoire')" style="background-image: url(./static/img/retroactions/victoire.svg)" />
					<span class="bouton" role="button" tabindex="0" @click="ouvrirCarte('dommage', 'dommage')" style="background-image: url(./static/img/retroactions/dommage.svg)" />
					<span class="bouton" role="button" tabindex="0" @click="ouvrirCarte('vrai', 'vrai')" style="background-image: url(./static/img/retroactions/vrai.svg)" />
					<span class="bouton" role="button" tabindex="0" @click="ouvrirCarte('faux', 'faux')" style="background-image: url(./static/img/retroactions/faux.svg)" />
					<span class="bouton" role="button" tabindex="0" @click="ouvrirCarte('vrai', 'pouce-haut')" style="background-image: url(./static/img/retroactions/pouce-haut.svg)" />
					<span class="bouton" role="button" tabindex="0" @click="ouvrirCarte('faux', 'pouce-bas')" style="background-image: url(./static/img/retroactions/pouce-bas.svg)" />
				</div>
				<label>{{ $t('activerEffetsSonores') }}</label>
				<div class="choix">
					<span class="oui">
						<input type="radio" :id="'son_oui_' + id" :name="'son_' + id" value="oui" :checked="son === 'oui'" @change="son = $event.target.value">
						<label :for="'son_oui_' + id">{{ $t('oui') }}</label>
					</span>
					<span class="non">
						<input type="radio" :id="'son_non_' + id" :name="'son_' + id" value="non" :checked="son === 'non'" @change="son = $event.target.value">
						<label :for="'son_non_' + id">{{ $t('non') }}</label>
					</span>
				</div>
			</div>
		</div>
		<div class="conteneur-droite" />
		<div class="conteneur-bas" />

		<div class="conteneur-carte" :class="{'ouvert': carte === 'confettis'}" @click="fermerCarte" key="confettis">
			<span class="carte"><img src="@/assets/img/retroactions/confettis.svg" alt="confettis"></span>
		</div>

		<div class="conteneur-carte" :class="{'ouvert': carte === 'applaudissements'}" @click="fermerCarte" key="applaudissements">
			<span class="carte"><img src="@/assets/img/retroactions/applaudissements.svg" alt="applaudissements"></span>
		</div>

		<div class="conteneur-carte" :class="{'ouvert': carte === 'victoire'}" @click="fermerCarte" key="victoire">
			<span class="carte"><img src="@/assets/img/retroactions/victoire.svg" alt="victoire"></span>
		</div>

		<div class="conteneur-carte" :class="{'ouvert': carte === 'dommage'}" @click="fermerCarte" key="dommage">
			<span class="carte"><img src="@/assets/img/retroactions/dommage.svg" alt="dommage"></span>
		</div>

		<div class="conteneur-carte" :class="{'ouvert': carte === 'vrai'}" @click="fermerCarte" key="vrai">
			<span class="carte"><img src="@/assets/img/retroactions/vrai.svg" alt="vrai"></span>
		</div>

		<div class="conteneur-carte" :class="{'ouvert': carte === 'faux'}" @click="fermerCarte" key="faux">
			<span class="carte"><img src="@/assets/img/retroactions/faux.svg" alt="faux"></span>
		</div>

		<div class="conteneur-carte" :class="{'ouvert': carte === 'pouce-haut'}" @click="fermerCarte" key="pouce-haut">
			<span class="carte"><img src="@/assets/img/retroactions/pouce-haut.svg" alt="pouce-haut"></span>
		</div>

		<div class="conteneur-carte" :class="{'ouvert': carte === 'pouce-bas'}" @click="fermerCarte" key="pouce-bas">
			<span class="carte"><img src="@/assets/img/retroactions/pouce-bas.svg" alt="pouce-bas"></span>
		</div>
	</JsPanel>
</template>

<script>
import JsPanel from '@/components/jspanel.vue'
import Panneau from '@/panneau'

export default {
	name: 'PRetroaction',
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
			mode: 'lecture',
			deplacement: false,
			redimensionnement: false,
			titre: '',
			id: '',
			w: 0,
			h: 0,
			x: 0,
			y: 0,
			minw: 36,
			minh: 31,
			statut: '',
			dimensions: {},
			position: {},
			donnees: { w: 0, h: 0, x: 0, y: 0 },
			carte: '',
			son: 'oui'
		}
	},
	watch: {
		export: function (valeur) {
			if (valeur === true) {
				this.position = { x: this.x, y: this.y }
				this.$emit('export', { id: this.id, titre: this.titre, mode: this.mode, statut: this.statut, dimensions: this.dimensions, position: this.position, contenu: { son: this.son }, w: this.w, h: this.h, x: this.x, y: this.y })
			}
		}
	},
	created () {
		this.definirCaracteristiques('retroaction')
		if (this.panneau.contenu !== '') {
			this.son = this.panneau.contenu.son
		}
		this.genererOptions('retroaction')
	},
	mounted () {
		this.initialiser()
		this.positionner()
		this.chargement = false
	},
	methods: {
		ouvrirCarte (audio, carte) {
			this.carte = carte
			if (this.son === 'oui') {
				if (this.$parent.audio.src !== '') {
					this.$parent.audio.pause()
					this.$parent.audio.currentTime = 0
				}
				this.$parent.audio.src = './static/audio/' + audio + '.mp3'
				this.$parent.audio.play()
			}
			if (carte === 'confettis' || carte === 'applaudissements' || carte === 'victoire') {
				this.lancerConfettis()
			}
		},
		fermerCarte () {
			this.carte = ''
			if (this.$parent.audio.src !== '') {
				this.$parent.audio.pause()
				this.$parent.audio.currentTime = 0
			}
		}
	}
}
</script>

<style>
.panneau .panneau-retroaction .retroactions {
	display: flex;
	justify-content: space-between;
	flex-wrap: wrap;
	margin-bottom: 2rem;
}

.panneau .panneau-retroaction .bouton {
	background-color: #fff;
	background-size: contain;
	background-position: center;
	background-repeat: no-repeat;
	height: 7rem;
	width: 7rem;
	border: 2px solid #00ced1;
	border-radius: 50%;
}

.panneau .panneau-retroaction .bouton:hover {
	border: 2px solid #00acb0;
	background: #00ced1;
}

.panneau .panneau-retroaction .oui {
	margin-right: 2.5rem;
}

.panneau .panneau-retroaction .choix label {
	display: inline-block;
	width: auto;
	font-size: 1.6rem;
	font-weight: 400;
    margin-left: 1rem;
	margin-bottom: 0;
}

.panneau .conteneur-carte {
	visibility: hidden;
	display: flex;
	justify-content: center;
	align-items: center;
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	height: 100%;
	width: 100%;
	z-index: 10005;
	background-color: rgba(0, 0, 0, 0.3);
	opacity: 0;
	transition: opacity 0.4s ease-in-out;
	cursor: pointer;
}

.panneau .conteneur-carte.ouvert {
	visibility: visible;
	opacity: 1;
}

.panneau .conteneur-carte .carte {
	color: #fff;
	transform: scale(0);
	transition: all 0.4s ease-in-out;
	user-select: none;
}

.panneau .conteneur-carte .carte img {
	width: auto;
	height: 65vh;
}

.panneau .conteneur-carte.ouvert .carte {
	transform: scale(1);
}
</style>
