<template>
	<JsPanel class="panneau" :visible="!chargement" :options="options">
		<div class="conteneur-gauche" />
		<div class="conteneur panneau-texte">
			<div class="contenu edition" v-if="mode === 'edition'">
				<div class="editeur" :style="{'font-size': convertirRem(taille) + 'px'}" />
				<span class="bouton" role="button" tabindex="0" @click="generer">{{ $t('valider') }}</span>
			</div>
			<div class="contenu" v-else>
				<div class="texte" :style="{'font-size': convertirRem(taille) + 'px'}" v-html="texte" />
			</div>
		</div>
		<div class="conteneur-droite" />
		<div class="conteneur-bas" />
	</JsPanel>
</template>

<script>
import JsPanel from '@/components/jspanel.vue'
import Panneau from '@/panneau'
import pell from 'pell'
import linkifyHtml from 'linkify-html'

export default {
	name: 'PTexte',
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
			redimensionnement: true,
			titre: '',
			id: '',
			w: 0,
			h: 0,
			x: 0,
			y: 0,
			minw: 53,
			minh: 46,
			statut: '',
			dimensions: {},
			position: {},
			donnees: { w: 0, h: 0, x: 0, y: 0 },
			editeur: '',
			texte: '',
			taille: 3.2,
			couleurFond: '#ffffff'
		}
	},
	watch: {
		export: function (valeur) {
			if (valeur === true) {
				this.position = { x: this.x, y: this.y }
				this.$emit('export', { id: this.id, titre: this.titre, mode: this.mode, statut: this.statut, dimensions: this.dimensions, position: this.position, contenu: { texte: this.texte, taille: this.taille, couleurFond: this.couleurFond }, w: this.w, h: this.h, x: this.x, y: this.y })
			}
		}
	},
	created () {
		this.definirCaracteristiques('texte')
		if (typeof this.panneau.contenu === 'object' && this.panneau.contenu.constructor === Object) {
			this.texte = this.panneau.contenu.texte
			this.taille = this.panneau.contenu.taille
			this.couleurFond = this.panneau.contenu.couleurFond
		} else if (this.panneau.contenu !== '') {
			this.texte = this.panneau.contenu
		}
		if (this.mode === 'lecture') {
			this.minw = 27
			this.minh = 8
			this.$nextTick(function () {
				window.MathJax.typeset()
			})
		}
		this.genererOptions('texte')
	},
	mounted () {
		this.initialiser()
		this.positionner()
		this.chargement = false
		this.$nextTick(function () {
			if (this.mode === 'edition') {
				this.creer()
				if (this.texte === '') {
					document.querySelector('#' + this.id + ' .pell-content').focus()
				}
			} else if (this.mode === 'lecture' && this.couleurFond !== '#ffffff') {
				document.querySelector('#' + this.id + ' .jsPanel-hdr').style.background = this.couleurFond
				document.querySelector('#' + this.id + ' .jsPanel-content').style.background = this.couleurFond
			}
		}.bind(this))
	},
	methods: {
		generer () {
			if (this.texte !== '') {
				this.mode = 'lecture'
				this.editeur = ''
				if (this.donnees.w > 0 && this.donnees.h > 0) {
					this.w = this.donnees.w
					this.h = this.donnees.h
				} else {
					this.w = 30
					this.h = 20
				}
				if (this.donnees.x > 0 && this.donnees.y > 0) {
					this.x = this.donnees.x
					this.y = this.donnees.y
				}
				this.minw = 27
				this.minh = 8
				this.positionner()
				if (this.couleurFond !== '#ffffff') {
					document.querySelector('#' + this.id + ' .jsPanel-hdr').style.background = this.couleurFond
					document.querySelector('#' + this.id + ' .jsPanel-content').style.background = this.couleurFond
				}
				this.$nextTick(function () {
					window.MathJax.typeset()
				})
			}
		},
		editer () {
			this.mode = 'edition'
			this.$nextTick(function () {
				this.creer()
				this.donnees.w = this.w
				this.donnees.h = this.h
				this.donnees.x = this.x
				this.donnees.y = this.y
				this.w = 53
				this.h = 46
				this.minw = 53
				this.minh = 46
				this.positionner()
				document.querySelector('#' + this.id + ' .jsPanel-hdr').style.background = '#ffffff'
				document.querySelector('#' + this.id + ' .jsPanel-content').style.background = '#ffffff'
			}.bind(this))
		},
		creer () {
			this.editeur = pell.init({
				element: document.querySelector('#' + this.id + ' .editeur'),
				onChange: function (html) {
					let texte = html.replace(/(<a [^>]*)(target="[^"]*")([^>]*>)/gi, '$1$3')
					texte = texte.replace(/(<a [^>]*)(>)/gi, '$1 target="_blank"$2')
					texte = linkifyHtml(texte, {
						defaultProtocol: 'https',
						target: '_blank'
					})
					this.texte = texte
				}.bind(this),
				actions: [
					{ name: 'taille-plus', title: this.$t('tailleTextePlus'), icon: '<i class="material-icons">add</i>', result: () => this.augmenterTaille() },
					{ name: 'taille-moins', title: this.$t('tailleTexteMoins'), icon: '<i class="material-icons">remove</i>', result: () => this.reduireTaille() },
					{ name: 'gras', title: this.$t('gras'), icon: '<i class="material-icons">format_bold</i>', result: () => pell.exec('bold') },
					{ name: 'italique', title: this.$t('italique'), icon: '<i class="material-icons">format_italic</i>', result: () => pell.exec('italic') },
					{ name: 'souligne', title: this.$t('souligne'), icon: '<i class="material-icons">format_underlined</i>', result: () => pell.exec('underline') },
					{ name: 'barre', title: this.$t('barre'), icon: '<i class="material-icons">format_strikethrough</i>', result: () => pell.exec('strikethrough') },
					{ name: 'listedecimale', title: this.$t('listeDecimale'), icon: '<i class="material-icons">format_list_numbered</i>', result: () => pell.exec('insertOrderedList') },
					{ name: 'liste', title: this.$t('liste'), icon: '<i class="material-icons">format_list_bulleted</i>', result: () => pell.exec('insertUnorderedList') },
					{ name: 'lien', title: this.$t('lien'), icon: '<i class="material-icons">link</i>', result: () => { const url = window.prompt(this.$t('adresseLien')); if (url) { pell.exec('createLink', url) } } },
					{ name: 'aligner-gauche', title: this.$t('alignerGauche'), icon: '<i class="material-icons">format_align_left</i>', result: () => pell.exec('JustifyLeft') },
					{ name: 'centrer', title: this.$t('centrer'), icon: '<i class="material-icons">format_align_center</i>', result: () => pell.exec('JustifyCenter') },
					{ name: 'couleur-texte', title: this.$t('couleurTexte'), icon: '<label for="couleur-texte-' + this.id + '"><i class="material-icons">format_color_text</i></label><input id="couleur-texte-' + this.id + '" type="color">', result: () => void 0 },
					{ name: 'couleur-fond', title: this.$t('couleurFond'), icon: '<label for="couleur-fond-' + this.id + '"><i class="material-icons">format_color_fill</i></label><input id="couleur-fond-' + this.id + '" type="color" value="' + this.couleurFond + '">', result: () => void 0 }
				]
			})
			this.editeur.onpaste = function (event) {
				event.preventDefault()
				event.stopPropagation()
				const texte = event.clipboardData.getData('text/plain')
				pell.exec('insertText', texte)
			}
			this.editeur.content.innerHTML = this.texte
			document.querySelector('#' + this.id + ' .editeur .pell-content').style.backgroundColor = this.couleurFond
			document.querySelector('#couleur-texte-' + this.id).addEventListener('change', this.modifierCouleurTexte)
			document.querySelector('#couleur-fond-' + this.id).addEventListener('change', this.modifierCouleurFond)
		},
		modifierCouleurTexte (event) {
			pell.exec('foreColor', event.target.value)
		},
		modifierCouleurFond (event) {
			document.querySelector('#' + this.id + ' .editeur .pell-content').style.backgroundColor = event.target.value
			this.couleurFond = event.target.value
		},
		augmenterTaille () {
			if (this.taille < 10) {
				this.taille = this.taille + 0.2
			}
		},
		reduireTaille () {
			if (this.taille > 1) {
				this.taille = this.taille - 0.2
			}
		},
		annulerTaille () {
			this.taille = 3.2
		}
	}
}
</script>

<style>
.panneau .panneau-texte .edition {
	width: 100%;
	height: 100%;
}

.panneau .panneau-texte .texte {
	font-weight: 400;
	line-height: 1.4;
	user-select: none;
}

.panneau .panneau-texte .texte a {
	color: #0000ee!important;
	text-decoration: underline!important;
}

.editeur {
	height: calc(100% - 6rem);
	border-bottom: 1px solid #ddd;
}

.editeur,
.pell-content {
    box-sizing: border-box;
}

.pell-content {
    height: calc(100% - 4.5rem);
	width: 100%;
	outline: 0;
	line-height: 1.5;
	padding: 2rem 1rem;
	text-align: left;
	overflow: auto;
	cursor: text;
}

.pell-content a {
	color: #0000ee!important;
	text-decoration: underline!important;
}

.pell-actionbar {
	display: flex;
	justify-content: center;
	align-items: center;
    background-color: #fff;
	border-bottom: 1px solid #ddd;
	height: 4.5rem;
}

.pell-button {
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 2.4rem;
    height: 3.4rem;
    outline: 0;
    width: auto;
	padding: 0 0.5rem;
	background-color: transparent;
    border: none;
    cursor: pointer;
}

.pell-button-selected {
    background-color: #f0f0f0;
}

.pell-button label {
	font-size: 2.2rem!important;
	font-weight: 400!important;
	margin: 0!important;
	width: 2.2rem!important;
}

.pell-button input[type="color"] {
	width: 2rem;
	height: 2rem;
	border: none;
	margin-left: 0.5rem;
	cursor: pointer;
}

.pell-button input[type="color"]::-moz-color-swatch {
	border: 1px solid #ddd;
	border-radius: 50%;
}

.pell-button input[type="color"]::-webkit-color-swatch {
	border: 1px solid #ddd;
	border-radius: 50%;
}

.pell-button input[type="color"]::-webkit-color-swatch-wrapper {
	padding: 0;
}
</style>
