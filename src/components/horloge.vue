<template>
	<JsPanel class="panneau" :visible="!chargement" :options="options">
		<div class="conteneur panneau-horloge">
			<div class="contenu">
				<div class="horloge">
					<div class="date">
						<span>{{ date }}</span>
					</div>
					<div class="temps">
						<span class="heures">{{ heure }}</span>
						<span class="separateur">:</span>
						<span class="minutes">{{ minute }}</span>
					</div>
					<canvas />
				</div>
			</div>
		</div>
	</JsPanel>
</template>

<script>
import dayjs from 'dayjs'
import 'dayjs/locale/de.js'
import 'dayjs/locale/es.js'
import 'dayjs/locale/fr.js'
import 'dayjs/locale/hr.js'
import 'dayjs/locale/it.js'
import 'dayjs/locale/nl.js'
import localizedFormat from 'dayjs/plugin/localizedFormat.js'
dayjs.extend(localizedFormat)
import JsPanel from '@/components/jspanel.vue'
import Panneau from '@/panneau'

export default {
	name: 'PHorloge',
	components: {
		JsPanel
	},
	props: {
		panneau: Object,
		pages: Array,
		nav: Boolean,
		export: Boolean,
		evenementClavier: Object,
		langue: String
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
			minw: 40,
			minh: 43.6,
			statut: '',
			dimensions: {},
			position: {},
			date: '',
			temps: '',
			heure: '',
			minute: '',
			horloge: '',
			canvas: '',
			contexte: '',
			radius: ''
		}
	},
	watch: {
		export: function (valeur) {
			if (valeur === true) {
				this.position = { x: this.x, y: this.y }
				this.$emit('export', { id: this.id, titre: this.titre, statut: this.statut, dimensions: this.dimensions, position: this.position, contenu: '', w: this.w, h: this.h, x: this.x, y: this.y })
			}
		},
		langue: function (langue) {
			this.date = dayjs(new Date()).locale(langue).format('dddd LL')
		}
	},
	created () {
		this.definirCaracteristiques('horloge')
		this.genererOptions('horloge')
	},
	mounted () {
		this.initialiser()
		this.positionner()
		this.chargement = false
		this.$nextTick(function () {
			this.canvas = document.querySelector('#' + this.id + ' canvas')
			this.canvas.width = this.convertirRem(30)
			this.canvas.height = this.convertirRem(30)
			this.contexte = this.canvas.getContext('2d')
			this.radius = this.canvas.height / 2
			this.contexte.translate(this.radius, this.radius)
			this.radius = this.radius * 0.90
			this.definirDate()
			this.definirTemps()
			this.temps = setInterval(this.definirTemps, 1000)
			this.dessinerHorloge()
			this.horloge = setInterval(this.dessinerHorloge, 1000)
		}.bind(this))
	},
	methods: {
		definirDate () {
			this.date = dayjs(new Date()).locale(this.langue).format('dddd LL')
		},
		definirTemps () {
			const maintenant = new Date()
			let heure = maintenant.getHours()
			let minute = maintenant.getMinutes()
			if (minute < 10) {
				minute = '0' + minute
			}
			this.heure = heure
			this.minute = minute
		},
		dessinerHorloge () {
			this.contexte.arc(0, 0, this.radius, 0 , 2 * Math.PI)
			this.contexte.fillStyle = '#fff'
			this.contexte.fill()
			this.contexte.beginPath();
			this.contexte.arc(0, 0, this.radius, 0, 2 * Math.PI)
			this.contexte.fillStyle = '#fff'
			this.contexte.fill()
			const grad = this.contexte.createRadialGradient(0, 0 ,this.radius * 0.95, 0, 0, this.radius * 1.05)
			grad.addColorStop(0, '#222')
			grad.addColorStop(1, '#444')
			this.contexte.strokeStyle = grad
			this.contexte.lineWidth = this.radius * 0.1
			this.contexte.stroke()
			// Point noir au milieu
			this.contexte.beginPath()
			this.contexte.arc(0, 0, this.radius * 0.1, 0, 2 * Math.PI)
			this.contexte.fillStyle = '#222'
			this.contexte.fill()
			// Heures
			let angle
			this.contexte.font = this.radius * 0.15 + 'px Orbitron'
			this.contexte.textBaseline = 'middle'
			this.contexte.textAlign = 'center'
			for (let num = 1; num < 13; num++) {
				angle = num * Math.PI / 6
				this.contexte.rotate(angle)
				this.contexte.translate(0, -this.radius * 0.85)
				this.contexte.rotate(-angle)
				this.contexte.fillText(num.toString(), 0, 0)
				this.contexte.rotate(angle)
				this.contexte.translate(0, this.radius * 0.85)
				this.contexte.rotate(-angle)
			}
			// Aiguilles
			const maintenant = new Date()
			let heure = maintenant.getHours()
			let minute = maintenant.getMinutes()
			let seconde = maintenant.getSeconds()
			heure = heure % 12
			heure = (heure * Math.PI / 6) + (minute * Math.PI / (6 * 60)) + (seconde * Math.PI / (360 * 60))
			this.dessinerAiguilles(this.contexte, heure, this.radius * 0.5, this.radius * 0.07)
			minute = (minute * Math.PI / 30) + (seconde * Math.PI / (30 * 60))
			this.dessinerAiguilles(this.contexte, minute, this.radius * 0.8, this.radius * 0.07)
			seconde = (seconde * Math.PI / 30)
			this.dessinerAiguilles(this.contexte, seconde, this.radius * 0.9, this.radius * 0.02)
		},
		dessinerAiguilles (contexte, position, longueur, largeur) {
			contexte.beginPath()
			contexte.lineWidth = largeur
			contexte.lineCap = 'round'
			contexte.moveTo(0, 0)
			contexte.rotate(position)
			contexte.lineTo(0, -longueur)
			contexte.stroke()
			contexte.rotate(-position)
		},
		redimensionnerHorloge () {
			this.$nextTick(function () {
				this.canvas.width = this.convertirRem(30)
				this.canvas.height = this.convertirRem(30)
				this.radius = this.canvas.height / 2
				this.contexte.translate(this.radius, this.radius)
				this.radius = this.radius * 0.90
			}.bind(this))
		}
	}
}
</script>

<style>
.panneau .panneau-horloge {
	width: 100%!important;
	height: 100%!important;
}

.horloge .date {
	display: flex;
	justify-content: center;
	text-align: center;
	font-size: 2.3rem;
	color: #001d1d;
	background: #00ced1;
    padding: 1.2rem 1rem 0 1rem;
	user-select: none;
}

.horloge .temps .heures,
.horloge .temps .minutes {
	display: inline-block;
}

.horloge .temps {
	display: flex;
	justify-content: center;
	text-align: center;
	font-family: 'Orbitron', sans-serif;
	font-size: 4rem;
	color: #001d1d;
	background: #00ced1;
	letter-spacing: 0.5rem;
	text-indent: 0.5rem;
	line-height: 1;
    padding: 1.2rem;
	user-select: none;
}

.horloge .temps span {
	display: inline-block;
	text-indent: 0.5rem;
}
</style>
