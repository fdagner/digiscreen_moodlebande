<template>
	<JsPanel class="panneau" :visible="!chargement" :options="options">
		<div class="conteneur-gauche" />
		<div class="conteneur panneau-des">
			<div class="contenu" v-if="mode === 'edition'">
				<label>{{ $t('nombreDes') }}</label>
				<input type="number" :value="des" :min="1" :max="6" @input="des = parseInt($event.target.value)">
				<label>{{ $t('typeDe') }}</label>
				<div class="choix">
					<span class="classique">
						<input type="radio" :id="'classique_' + id" :name="'type_' + id" value="classique" :checked="type === 'classique'" @change="type = $event.target.value">
						<label :for="'classique_' + id">{{ $t('classique') }}</label>
					</span>
					<span class="nombre">
						<input type="radio" :id="'nombre_' + id" :name="'type_' + id" value="nombre" :checked="type === 'nombre'" @change="type = $event.target.value">
						<label :for="'nombre_' + id">{{ $t('nombre') }}</label>
					</span>
					<span class="lettre">
						<input type="radio" :id="'lettre_' + id" :name="'type_' + id" value="lettre" :checked="type === 'lettre'" @change="type = $event.target.value">
						<label :for="'lettre_' + id">{{ $t('lettre') }}</label>
					</span>
				</div>
				<div class="plage-nombre" v-if="type === 'nombre'">
					<div class="min">
						<label>{{ $t('minimum') }}</label>
						<input type="number" :value="nombreMin" :min="0" :max="99" @input="nombreMin = $event.target.value">
					</div>
					<div class="max">
						<label>{{ $t('maximum') }}</label>
						<input type="number" :value="nombreMax" :min="0" :max="99" @input="nombreMax = $event.target.value">
					</div>
				</div>
				<span class="bouton" role="button" tabindex="0" @click="generer">{{ $t('valider') }}</span>
			</div>
			<div class="contenu" v-else>
				<div class="des">
					<template v-for="(resultat, index) in resultats">
						<span :class="'de de-' + resultat" v-if="type === 'classique'" :key="'de_classique_' + index" />
						<span class="de-autre" v-else-if="type === 'nombre'" :key="'de_nombre_' + index">{{ resultat }}</span>
						<span class="de-autre" v-else-if="type === 'lettre'" :key="'de_lettre_' + index">{{ resultat }}</span>
					</template>
				</div>
				<span class="bouton" role="button" tabindex="0" @click="jeter">{{ $t('jeter') }}</span>
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
	name: 'PDes',
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
			minw: 20,
			minh: 22,
			statut: '',
			dimensions: {},
			position: {},
			donnees: { x: 0, y: 0 },
			des: 1,
			type: 'classique',
			nombreMin: 0,
			nombreMax: 99,
			alphabet: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
			resultats: []
		}
	},
	watch: {
		export: function (valeur) {
			if (valeur === true) {
				this.position = { x: this.x, y: this.y }
				this.$emit('export', { id: this.id, titre: this.titre, mode: this.mode, statut: this.statut, dimensions: this.dimensions, position: this.position, contenu: { des: this.des, type: this.type, nombreMin: this.nombreMin, nombreMax: this.nombreMax }, w: this.w, h: this.h, x: this.x, y: this.y })
			}
		},
		type: function (type) {
			if (type === 'nombre') {
				this.w = 40
				this.h = 34
			} else {
				this.w = 40
				this.h = 25.4
			}
			this.$nextTick(function () {
				this.positionner()
			}.bind(this))
		}
	},
	created () {
		this.definirCaracteristiques('des')
		if (typeof this.panneau.contenu === 'object' && this.panneau.contenu.constructor === Object) {
			this.des = this.panneau.contenu.des
			this.type = this.panneau.contenu.type
			this.nombreMin = this.panneau.contenu.nombreMin
			this.nombreMax = this.panneau.contenu.nombreMax
			for (let i = 0; i < this.des; i++) {
				if (this.type === 'classique') {
					this.resultats.push(1)
				} else if (this.type === 'nombre') {
					this.resultats.push(this.nombreMin)
				} else if (this.type === 'lettre') {
					this.resultats.push('A')
				}
			}
		} else if (this.panneau.contenu !== '') {
			this.des = this.panneau.contenu
			for (let i = 0; i < this.des; i++) {
				this.resultats.push(1)
			}
		}
		this.genererOptions('des')
	},
	mounted () {
		this.initialiser()
		this.positionner()
		this.chargement = false
		if (this.mode === 'edition' && this.statut !== 'min' && this.des === 1) {
			this.$nextTick(function () {
				document.querySelector('#' + this.id + ' input').focus()
			}.bind(this))
		}
	},
	methods: {
		generer () {
			this.mode = 'lecture'
			if (this.des === 1) {
				this.w = 20
				this.h = 24
			} else if (this.des === 2) {
				this.w = 30
				this.h = 24
			} else if (this.des === 3) {
				this.w = 40
				this.h = 24
			} else if (this.des > 3 && this.des < 7) {
				this.w = 40
				this.h = 36
			} else if (this.des > 6 && this.des < 10) {
				this.w = 40
				this.h = 48
			} else if (this.des > 9) {
				this.w = 40
				this.h = 60
			}
			if (this.donnees.x > 0 && this.donnees.y > 0) {
				this.x = this.donnees.x
				this.y = this.donnees.y
			}
			for (let i = 0; i < this.des; i++) {
				if (this.type === 'classique') {
					this.resultats.push(1)
				} else if (this.type === 'nombre') {
					this.resultats.push(this.nombreMin)
				} else if (this.type === 'lettre') {
					this.resultats.push('A')
				}
			}
			this.positionner()
		},
		editer () {
			this.mode = 'edition'
			this.resultats = []
			this.donnees.x = this.x
			this.donnees.y = this.y
			if (this.type === 'nombre') {
				this.w = 40
				this.h = 34
			} else {
				this.w = 40
				this.h = 25.4
			}
			this.positionner()
		},
		jeter () {
			this.resultats = []
			for (let i = 0; i < this.des; i++) {
				let resultat
				if (this.type === 'classique') {
					resultat = Math.floor(Math.random() * (6 - 1 + 1) + 1)
				} else if (this.type === 'nombre') {
					resultat = Math.floor(Math.random() * (this.nombreMax - this.nombreMin + 1) + this.nombreMin)
				} else if (this.type === 'lettre') {
					resultat = this.alphabet[Math.floor(Math.random() * this.alphabet.length)]
				}
				this.resultats.push(resultat)
			}
			this.$parent.audio.src = './static/audio/des.mp3'
			this.$parent.audio.play()
		}
	}
}
</script>

<style>
.panneau .panneau-des input[type="number"] {
	margin-bottom: 2rem;
}

.panneau .panneau-des .plage-nombre {
	margin-top: 2rem;
}

.panneau .panneau-des .classique,
.panneau .panneau-des .nombre {
	margin-right: 2.5rem;
}

.panneau .panneau-des .min,
.panneau .panneau-des .max {
	display: inline-block;
}

.panneau .panneau-des .min {
	margin-right: 2rem;
}

.panneau .panneau-des .min input[type="number"],
.panneau .panneau-des .max input[type="number"] {
	margin-bottom: 0;
}

.panneau .panneau-des .choix label {
	display: inline-block;
	width: auto;
	font-size: 1.6rem;
	font-weight: 400;
    margin-left: 1rem;
	margin-bottom: 0;
}

.des {
	width: 100%;
	text-align: center;
}

.de {
    display: inline-block;
	font-size: 6em;
    min-height: 1em;
    padding-left: 1em;
    background-size: 1em;
    background-repeat: no-repeat;
	margin: 1rem;
}

.de-1 {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg' version='1.1' viewBox='0 0 76.5 76.5' height='21.6' width='21.6'%3E%3Cg transform='translate(113.25%2C-494.1)'%3E%3Cg transform='matrix(0.5%2C0%2C0%2C0.5%2C-406.5%2C374.7)'%3E%3Crect x='588' y='240.4' width='150' height='150' ry='50' rx='50' style='fill%3A%23fff%3Bstroke-width%3A3%3Bstroke%3A%23000'%2F%3E%3Ccircle transform='translate(337.5%2C87.5)' cx='325' cy='227.4' r='12.5' style='fill%3A%23000%3Bstroke-width%3A3%3Bstroke%3A%23000'%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E ");
}

.de-2 {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg' version='1.1' viewBox='0 0 76.5 76.5' height='21.6' width='21.6'%3E%3Cstyle%3E.s0%7Bfill%3A%23000%3Bstroke-width%3A3%3Bstroke%3A%23000%3B%7D%3C%2Fstyle%3E%3Cg transform='translate(109.9%2C-505.1)'%3E%3Cg transform='matrix(0.5%2C0%2C0%2C0.5%2C-415.6%2C485.6)'%3E%3Crect x='613' y='40.4' width='150' height='150' ry='50' rx='50' style='fill%3A%23fff%3Bstroke-width%3A3%3Bstroke%3A%23000'%2F%3E%3Ccircle transform='translate(326.5%2C-148.5)' cx='325' cy='227.4' r='12.5' class='s0'%2F%3E%3Ccircle transform='translate(398.5%2C-76.5)' cx='325' cy='227.4' r='12.5' class='s0'%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E ");
}

.de-3 {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg' version='1.1' viewBox='0 0 76.5 76.5' height='21.6' width='21.6'%3E%3Cstyle%3E.s0%7Bfill%3A%23000%3Bstroke-width%3A3%3Bstroke%3A%23000%3B%7D%3C%2Fstyle%3E%3Cg transform='translate(84.9%2C-515.5)'%3E%3Cg transform='matrix(0.5%2C0%2C0%2C0.5%2C-290.6%2C514.9)'%3E%3Crect x='413' y='2.9' width='150' height='150' ry='50' rx='50' style='fill%3A%23fff%3Bstroke-width%3A3%3Bstroke%3A%23000'%2F%3E%3Ccircle transform='translate(126.5%2C-186)' cx='325' cy='227.4' r='12.5' class='s0'%2F%3E%3Ccircle transform='translate(198.5%2C-114)' cx='325' cy='227.4' r='12.5' class='s0'%2F%3E%3Ccircle transform='translate(162.5%2C-150)' cx='325' cy='227.4' r='12.5' class='s0'%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E ");
}

.de-4 {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg' version='1.1' viewBox='0 0 76.5 76.5' height='21.6' width='21.6'%3E%3Cstyle%3E.s0%7Bfill%3A%23000%3Bstroke-width%3A3%3Bstroke%3A%23000%3B%7D%3C%2Fstyle%3E%3Cg transform='translate(90.7%2C-499.7)'%3E%3Cg transform='matrix(0.5%2C0%2C0%2C0.5%2C-302.7%2C367.8)'%3E%3Crect x='425.5' y='265.4' width='150' height='150' ry='50' rx='50' style='fill%3A%23fff%3Bstroke-width%3A3%3Bstroke%3A%23000'%2F%3E%3Ccircle transform='translate(139%2C76.5)' cx='325' cy='227.4' r='12.5' class='s0'%2F%3E%3Ccircle transform='translate(139%2C148.5)' cx='325' cy='227.4' r='12.5' class='s0'%2F%3E%3Ccircle transform='translate(211%2C76.5)' cx='325' cy='227.4' r='12.5' class='s0'%2F%3E%3Ccircle transform='translate(211%2C148.5)' cx='325' cy='227.4' r='12.5' class='s0'%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E ");
}

.de-5 {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg' version='1.1' viewBox='0 0 76.5 76.5' height='21.6' width='21.6'%3E%3Cstyle%3E.s0%7Bfill%3A%23000%3Bstroke-width%3A3%3Bstroke%3A%23000%3B%7D%3C%2Fstyle%3E%3Cg transform='translate(89.2%2C-510.5)'%3E%3Cg transform='matrix(0.5%2C0%2C0%2C0.5%2C-194.9%2C372.3)'%3E%3Crect x='213' y='277.9' width='150' height='150' ry='50' rx='50' style='fill%3A%23fff%3Bstroke-width%3A3%3Bstroke%3A%23000'%2F%3E%3Ccircle transform='translate(-73.5%2C89)' cx='325' cy='227.4' r='12.5' class='s0'%2F%3E%3Ccircle transform='translate(-73.5%2C161)' cx='325' cy='227.4' r='12.5' class='s0'%2F%3E%3Ccircle transform='translate(-1.5%2C89)' cx='325' cy='227.4' r='12.5' class='s0'%2F%3E%3Ccircle transform='translate(-1.5%2C161)' cx='325' cy='227.4' r='12.5' class='s0'%2F%3E%3Ccircle transform='translate(-37.5%2C125)' cx='325' cy='227.4' r='12.5' class='s0'%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E ");
}

.de-6 {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg' version='1.1' viewBox='0 0 76.5 76.5' height='21.6' width='21.6'%3E%3Cstyle%3E.s0%7Bfill%3A%23000%3Bstroke-width%3A3%3Bstroke%3A%23000%3B%7D%3C%2Fstyle%3E%3Cg transform='translate(86.2%2C-500.6)'%3E%3Cg transform='matrix(0.5%2C0%2C0%2C0.5%2C-98.2%2C356.2)'%3E%3Crect x='25.5' y='290.4' width='150' height='150' ry='50' rx='50' style='fill%3A%23fff%3Bstroke-width%3A3%3Bstroke%3A%23000'%2F%3E%3Ccircle transform='translate(-261%2C101.5)' cx='325' cy='227.4' r='12.5' class='s0'%2F%3E%3Ccircle transform='translate(-261%2C173.5)' cx='325' cy='227.4' r='12.5' class='s0'%2F%3E%3Ccircle transform='translate(-261%2C137.5)' cx='325' cy='227.4' r='12.5' class='s0'%2F%3E%3Ccircle transform='translate(-189%2C101.5)' cx='325' cy='227.4' r='12.5' class='s0'%2F%3E%3Ccircle transform='translate(-189%2C173.5)' cx='325' cy='227.4' r='12.5' class='s0'%2F%3E%3Ccircle transform='translate(-189%2C137.5)' cx='325' cy='227.4' r='12.5' class='s0'%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E");
}

.de-autre {
    display: inline-flex;
	justify-content: center;
	align-items: center;
    width: 9.6rem;
	height: 9.6rem;
	font-size: 3rem;
	font-weight: 700;
	letter-spacing: 0.3rem;
	text-indent: 0.3rem;
	margin: 1rem;
	border: 2px solid #000;
	border-radius: 1em;
	background-color: #fff;
}
</style>
