const modulesSansMax = ['audio', 'calendrier', 'chrono', 'codeqr', 'des', 'histoire', 'horloge', 'lien', 'modalites', 'plateau', 'pendu', 'rebours', 'retroaction', 'sonometre', 'synthese']
const modulesAvecMax = ['dessin', 'nuage', 'texte']
const modulesAvecMaxLecture = ['cartes', 'document', 'galerie', 'groupes', 'iframe', 'image', 'images-sequentielles', 'ordre', 'surlignage', 'tableau', 'tirage-audio', 'tirage-image', 'tirage-texte', 'trous', 'video', 'webcam']
const modulesSansEdition = ['calendrier', 'chrono', 'dessin', 'document', 'horloge', 'iframe', 'modalites', 'retroaction', 'sonometre', 'webcam']
const modulesAvecZoom = ['tableau', 'texte']
const modulesAvecFocus = ['calendrier', 'horloge', 'modalites', 'retroaction']
const modulesAvecFocusLecture = ['calendrier', 'chrono', 'codeqr', 'des', 'histoire', 'horloge', 'modalites', 'pendu', 'rebours']

export default {
	methods: {
		definirCaracteristiques (titre) {
			this.titre = this.$t(titre)
			this.id = this.panneau.id
			this.w = this.panneau.w
			this.h = this.panneau.h
			this.x = this.panneau.x
			this.y = this.panneau.y
			this.statut = this.panneau.statut
			this.dimensions = this.panneau.dimensions
			if (this.panneau.hasOwnProperty('position')) {
				this.position = this.panneau.position
			}
			if (this.panneau.hasOwnProperty('titre')) {
				this.titre = this.panneau.titre
			}
			if (this.panneau.mode !== '') {
				this.mode = this.panneau.mode
			}
		},
		genererOptions (module) {
			let controles = { size: 'xl', minimize: 'remove', maximize: 'hide' }
			if (modulesAvecMax.includes(module)) {
				controles = { size: 'xl', minimize: 'remove' }
			} else if (modulesSansMax.includes(module)) {
				controles = { size: 'xl', minimize: 'remove', maximize: 'remove' }
			}
			this.options = {
				id: this.id,
				theme: 'none',
				iconfont: 'material-icons',
				container: 'window',
				animateIn: 'jsPanelFadeIn',
				animateOut: 'jsPanelFadeOut',
				headerTitle: '',
				headerControls: controles,
				borderRadius: '0.7rem',
				closeOnEscape: false,
				panelSize: {
					width: this.convertirRem(this.w),
					height: this.convertirRem(this.h)
				},
				dragit: {
					containment: [0, 0, this.convertirRem(7.5), 0],
					handles: '.jsPanel-titlebar, .conteneur-gauche, .conteneur-droite, .conteneur-bas',
					opacity: 0.85,
					drag: function (panel, paneldata) {
						this.deplacer(paneldata)
					}.bind(this),
					stop: function (panel, paneldata) {
						this.redimensionner(paneldata)
					}.bind(this)
				},
				resizeit: {
					containment: [0, 0, this.convertirRem(7.5), 0],
					handles: 'n, e, s, w, ne, se, sw, nw',
					minWidth: this.convertirRem(this.minw),
					minHeight: this.convertirRem(this.minh),
					stop: function (panel, paneldata) {
						this.redimensionner(paneldata)
					}.bind(this)
				},
				onmaximized: function (panel) {
					this.statut = 'max'
					if (Object.keys(this.dimensions).length === 0) {
						this.dimensions = { w: this.w, h: this.h, x: this.x, y: this.y }
					}
					panel.setHeaderTitle('')
					panel.setBorderRadius('0')
					panel.resizeit('disable')
					panel.dragit('disable')
					panel.setControlStatus('smallify', 'hide')
					if (this.nav === true) {
						panel.style.height = (document.body.clientHeight - this.convertirRem(7.5)) + 'px'
					} else {
						panel.style.height = '100%'
					}
				}.bind(this),
				onsmallified: function (panel) {
					this.statut = 'min'
					if (Object.keys(this.dimensions).length === 0) {
						this.dimensions = { w: this.w, h: this.h, x: this.x, y: this.y }
					}
					panel.setHeaderTitle(this.titre)
					panel.resizeit('disable')
					if (this.mode === 'edition' && modulesAvecMaxLecture.includes(this.panneau.type) === true) {
						panel.setControlStatus('maximize', 'hide')
					}
					if (this.mode === 'lecture' && (modulesAvecZoom.includes(this.panneau.type) === true || this.panneau.type === 'image')) {
						panel.setControlStatus('zoom-in', 'hide')
						panel.setControlStatus('zoom-out', 'hide')
						panel.setControlStatus('reset', 'hide')
						panel.setControlStatus('separator', 'hide')
					}
				}.bind(this),
				onunsmallified: function (panel) {
					this.statut = ''
					this.w = this.dimensions.w
					this.h = this.dimensions.h
					this.dimensions = {}
					panel.setHeaderTitle('')
					if (this.redimensionnement === true) {
						panel.resizeit('enable')
					}
					if (this.mode === 'edition' && modulesAvecMaxLecture.includes(this.panneau.type) === true) {
						panel.setControlStatus('maximize', 'hide')
					}
					if (this.mode === 'lecture' && (modulesAvecZoom.includes(this.panneau.type) === true || this.panneau.type === 'image')) {
						panel.setControlStatus('zoom-in', 'show')
						panel.setControlStatus('zoom-out', 'show')
						panel.setControlStatus('reset', 'show')
						panel.setControlStatus('separator', 'show')
					}
					this.positionner()
				}.bind(this),
				onnormalized: function (panel) {
					this.statut = ''
					this.w = this.dimensions.w
					this.h = this.dimensions.h
					this.x = this.dimensions.x
					this.y = this.dimensions.y
					this.dimensions = {}
					panel.setBorderRadius('0.7rem')
					panel.setHeaderTitle('')
					panel.dragit('enable')
					if (this.redimensionnement === true) {
						panel.resizeit('enable')
					}
					panel.setControlStatus('smallify', 'show')
					this.positionner()
				}.bind(this),
				onfronted: function () {
					this.$emit('afficher', this.id)
				}.bind(this),
				onclosed: function () {
					const module = this.panneau.type
					this.$emit('fermer', this.id, module)
					if (module === 'audio' && this.dataURL !== '' && this.audio !== '') {
						window.URL.revokeObjectURL(this.audio)
					} else if (module === 'document' && this.type === 'pdf' && this.document !== '') {
						window.URL.revokeObjectURL(this.document)
					} else if (module === 'horloge') {
						clearInterval(this.horloge)
					} else if (module === 'plateau') {
						this.desactiverPions()
					} else if (module === 'rebours' && this.decompte !== '') {
						clearInterval(this.decompte)
					} else if (module === 'sonometre') {
						this.pause()
						if (this.analyseur !== '') {
							this.analyseur.disconnect()
						}
					} else if (module === 'tableau' && this.tabulator !== '') {
						this.tabulator.clearData()
						this.tabulator.destroy()
					} else if (module === 'video' && this.lecteur !== '') {
						this.lecteur.dispose()
					}
				}.bind(this),
				onwindowresize: function () {
					this.positionner()
					if (this.panneau.type === 'horloge') {
						this.redimensionnerHorloge()
					} else if (this.panneau.type === 'dessin') {
						this.dimensionsCanva.w = this.convertirRem(this.w)
						this.dimensionsCanva.h = this.convertirRem(this.h) - this.convertirRem(3)
					}
				}.bind(this)
			}
		},
		initialiser () {
			this.$nextTick(function () {
				const panneau = document.querySelector('#' + this.id)
				if (panneau) {
					if (this.redimensionnement === true) {
						panneau.resizeit('enable')
					} else {
						panneau.resizeit('disable')
					}
					panneau.style.left = this.x + 'px'
					panneau.style.top = this.y + 'px'
					panneau.querySelector('.jsPanel-title').addEventListener('dblclick', function () {
						this.renommer(this.titre)
					}.bind(this))
					if (panneau && this.$parent.pages.length > 1 && panneau.contains(document.querySelector('#' + this.id + ' .jsPanel-btn-send')) === false && this.panneau.type !== 'modalites' && this.panneau.type !== 'retroaction' && modulesSansEdition.includes(this.panneau.type) === true) {
						panneau.addControl({
							html: '<span class="material-icons">send</span>',
							name: 'send',
							ariaLabel: 'panel send',
							handler: function () {
								this.envoyer(this.id)
							}.bind(this),
							position: 1
						})
					}
					if (modulesAvecFocus.includes(this.panneau.type) === true) {
						this.ajouterFocus(panneau)
					}
					this.$nextTick(function () {
						if (this.statut === 'min') {
							panneau.smallify()
						} else if (this.statut === 'max') {
							panneau.maximize()
						}
					}.bind(this))
				}
			}.bind(this))
		},
		deplacer (donnees) {
			this.deplacement = true
			if (this.donnees && Object.keys(this.donnees).length > 0) {
				this.donnees.x = donnees.left
				this.donnees.y = donnees.top
				this.position = {}
			}
		},
		redimensionner (donnees) {
			this.deplacement = false
			let base = 10
			if (document.body.clientWidth < 1367) {
				base = 9
			}
			this.w = donnees.width / base
			this.h = donnees.height / base
			this.x = donnees.left
			this.y = donnees.top
			this.position = {}
		},
		positionner () {
			if (this.w > document.body.clientWidth) {
				this.w = document.body.clientWidth
			}
			if (this.nav === true && this.h > document.body.clientHeight - this.convertirRem(7.5)) {
				this.h = document.body.clientHeight - this.convertirRem(7.5)
			} else if (this.nav === false && this.h > document.body.clientHeight) {
				this.h = document.body.clientHeight
			}
			if (this.x > document.body.clientWidth - this.convertirRem(this.w)) {
				this.x = document.body.clientWidth - this.convertirRem(this.w)
			}
			if (Object.keys(this.position).length > 0 && this.position.x <= (document.body.clientWidth - this.convertirRem(this.w))) {
				this.x = this.position.x
			}
			if (this.nav === true && this.y > document.body.clientHeight - (this.convertirRem(7.5) + this.convertirRem(this.h))) {
				this.y = document.body.clientHeight - (this.convertirRem(7.5) + this.convertirRem(this.h))
				if (Object.keys(this.position).length > 0 && this.position.y <= (document.body.clientHeight - (this.convertirRem(7.5) + this.convertirRem(this.h)))) {
					this.y = this.position.y
				}
			} else if (this.nav === false && this.y > document.body.clientHeight - this.convertirRem(this.h)) {
				this.y = document.body.clientHeight - this.convertirRem(this.h)
				if (Object.keys(this.position).length > 0 && this.position.y <= (document.body.clientHeight- this.convertirRem(this.h))) {
					this.y = this.position.y
				}
			}
			this.$nextTick(function () {
				const panneau = document.querySelector('#' + this.id)
				this.$nextTick(function () {
					if (panneau && this.statut === '') {
						panneau.resize({
							width: this.convertirRem(this.w),
							height: this.convertirRem(this.h)
						})
						panneau.style.left = this.x + 'px'
						panneau.style.top = this.y + 'px'
					}
				}.bind(this))
				this.options.resizeit.minWidth = this.convertirRem(this.minw)
				this.options.resizeit.minHeight = this.convertirRem(this.minh)
				if (this.nav === true) {
					this.options.dragit.containment = [0, 0, this.convertirRem(7.5), 0]
					this.options.resizeit.containment = [0, 0, this.convertirRem(7.5), 0]
					if (panneau && this.statut === 'max') {
						this.$nextTick(function () {
							panneau.style.height = (document.body.clientHeight - this.convertirRem(7.5)) + 'px'
						}.bind(this))
					}
				} else {
					this.options.dragit.containment = [0, 0, 0, 0]
					this.options.resizeit.containment = [0, 0, 0, 0]
					if (panneau && this.statut === 'max') {
						this.$nextTick(function () {
							panneau.style.height = '100%'
						}.bind(this))
					}
				}
			}.bind(this))
		},
		renommer (module) {
			const titre = prompt(this.$t('nouveauTitre'), module)
			if (titre !== null) {
				this.titre = titre
				document.querySelector('#' + this.id).setHeaderTitle(titre)
			}
		},
		envoyer (id) {
			const page = prompt(this.$t('envoyerPage'), this.$parent.page)
			if (page !== null && this.$parent.page !== parseInt(page) && parseInt(page) > 0 && parseInt(page) <= this.$parent.pages.length) {
				this.$parent.exportDonnees = true
				this.$nextTick(function () {
					const panneaux = JSON.parse(JSON.stringify(this.$parent.panneaux))
					panneaux.forEach(function (panneau) {
						if (panneau.id === id) {
							panneau.page = parseInt(page)
						}
					})
					if (document.querySelector('#' + id)) {
						document.querySelector('#' + id).close()
					}
					this.$parent.exportDonnees = false
					setTimeout(function () {
						this.$parent.panneaux = panneaux
					}.bind(this), 150)
				}.bind(this))
			}
		},
		ajouterFocus (panneau) {
			panneau.addControl({
				html: '<span class="material-icons">highlight</span>',
				name: 'focus',
				ariaLabel: 'panel focus',
				handler: function () {
					this.statut = 'focus'
					
					const panneaux = document.querySelectorAll('.jsPanel')
					panneaux.forEach(function (panneau) {
						if (panneau.id !== this.id) {
							panneau.style.display = 'none'
						} else {
							panneau.resizeit('disable')
							panneau.dragit('disable')
							panneau.querySelector('.jsPanel-controlbar').style.display = 'none'
							const largeurFenetre = document.body.clientWidth
							let hauteurFenetre
							if (this.nav) {
								hauteurFenetre = document.body.clientHeight - this.convertirRem(7.5)
							} else {
								hauteurFenetre = document.body.clientHeight
							}
							let ratio = hauteurFenetre / this.convertirRem(this.h)
							if (this.convertirRem(this.w) * ratio > largeurFenetre) {
								ratio = largeurFenetre / this.convertirRem(this.w)
							}
							panneau.setAttribute('data-x', this.x)
							panneau.setAttribute('data-y', this.y)
							panneau.style.top = ((hauteurFenetre - this.convertirRem(this.h)) / 2) + 'px'
							panneau.style.left = ((largeurFenetre - this.convertirRem(this.w)) / 2) + 'px'
							panneau.style.top = ((hauteurFenetre - this.convertirRem(this.h)) / 2) + 'px'
							panneau.style.transform = 'scale(' + ratio + ')'
							panneau.style.boxShadow = 'none'
							panneau.style.background = 'transparent'
							panneau.querySelector('.jsPanel-hdr').style.visibility = 'hidden'
							panneau.querySelector('.jsPanel-content').style.background = 'transparent'
						}
					}.bind(this))
					const masque = document.createElement('div')
					masque.id = 'masque'
					if (this.panneau.type === 'modalites' || this.panneau.type === 'pendu' || this.panneau.type === 'retroaction') {
						masque.className = 'blanc'
					}
					masque.innerHTML = '<span class="material-icons">close</span>'
					document.body.appendChild(masque)
					document.querySelector('#masque span').addEventListener('click', function () {
						this.statut = ''
					}.bind(this))
					document.querySelector('nav').style.display = 'none'
					document.querySelector('.bouton-cadenas').style.display = 'none'
					if (document.querySelector('.nav')) {
						document.querySelector('.nav').style.display = 'none'
					}
					if (document.querySelector('.bouton-export')) {
						document.querySelector('.bouton-export').style.display = 'none'
					}
					if (document.querySelector('.bouton-plein-ecran')) {
						document.querySelector('.bouton-plein-ecran').style.display = 'none'
					}
					if (document.querySelector('.bouton-capture')) {
						document.querySelector('.bouton-capture').style.display = 'none'
					}
					if (document.querySelector('.bouton-annotation')) {
						document.querySelector('.bouton-annotation').style.display = 'none'
					}
				}.bind(this),
				position: 2
			})
		},
		gererClavier (touche, id, type) {
			const modulesMax = modulesAvecMax.concat(modulesAvecMaxLecture)
			const panneau = document.querySelector('#' + this.id)
			if (id === this.id && this.statut !== 'max' && (touche === 'ArrowLeft' || touche === 'ArrowRight' || touche === 'ArrowUp' || touche === 'ArrowDown')) {
				this.deplacerClavier(touche)
			} else if (panneau && id === this.id && touche === 'm' && this.statut === '') {
				panneau.smallify()
			} else if (panneau && id === this.id && ((touche === 'm' && this.statut === 'min') || (touche === 'f' && this.statut === 'max'))) {
				panneau.normalize()
			} else if (panneau && id === this.id && touche === 'f' && this.statut === '' && modulesMax.includes(type) === true && ((this.mode === 'lecture' && type !== 'nuage' && type !== 'texte') || (type === 'nuage') || (type === 'texte' && this.mode === 'edition'))) {
				panneau.maximize()
			}
		},
		deplacerClavier (direction) {
			if (direction === 'ArrowLeft') {
				this.x = this.x - 1
			} else if (direction === 'ArrowRight') {
				this.x = this.x + 1
			} else if (direction === 'ArrowUp') {
				this.y = this.y - 1
			} else if (direction === 'ArrowDown') {
				this.y = this.y + 1
			}
			this.$nextTick(function () {
				const panneau = document.querySelector('#' + this.id)
				if (panneau) {
					panneau.style.left = this.x + 'px'
					panneau.style.top = this.y + 'px'
				}
			}.bind(this))
		},
		convertirRem (valeur) {
			const taille = window.getComputedStyle(document.querySelector('html'), null).getPropertyValue('font-size')
			return 'undefined' != typeof valeur && valeur > 0 ? parseFloat(taille) * valeur : parseFloat(taille)
		},
		verifierURL (lien) {
			let url
			try {
				url = new URL(lien)
			} catch (_) {
				return false
			}
			return url.protocol === 'http:' || url.protocol === 'https:'
		},
		melanger (array) {
			for (let i = array.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1))
				const temp = array[i]
				array[i] = array[j]
				array[j] = temp
			}
			return array
		},
		lancerConfettis () {
			// eslint-disable-next-line
			confetti({ angle: 300, spread: 55, particleCount: 150, origin: { x: 0, y: -0.2 }, zIndex: 10010 })
			// eslint-disable-next-line
			confetti({ angle: 240, spread: 55, particleCount: 150, origin: { x: 1, y: -0.2 }, zIndex: 10010 })
			// eslint-disable-next-line
			confetti({ angle: 270, spread: 70, particleCount: 150, origin: { x: 0.5, y: -0.2 }, zIndex: 10010 })
		},
		convertirDataURL (dataurl) {
			let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1], bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n)
			while (n--) {
				u8arr[n] = bstr.charCodeAt(n)
			}
			return new Blob([u8arr], { type: mime })
		}
	},
	watch: {
		redimensionnement: function (redimensionnement) {
			this.$nextTick(function () {
				const panneau = document.querySelector('#' + this.id)
				if (panneau && redimensionnement === true && this.statut === '') {
					panneau.resizeit('enable')
				} else if (panneau && redimensionnement === false && this.statut === '') {
					panneau.resizeit('disable')
				}
			}.bind(this))
		},
		mode: function (mode) {
			this.$nextTick(function () {
				const panneau = document.querySelector('#' + this.id)
				const module = this.panneau.type
				if (mode === 'lecture' && panneau && modulesAvecMaxLecture.includes(module) === true) {
					panneau.setControlStatus('maximize', 'show')
				}
				if (mode === 'lecture' || mode === 'decompte') {
					if (panneau && panneau.contains(document.querySelector('#' + this.id + ' .jsPanel-btn-edit')) === false && ((module !== 'video' && module !== 'image' && modulesSansEdition.includes(module) === false) || (module === 'video' && this.videoId !== '') || (module === 'image' && this.requete !== ''))) {
						panneau.addControl({
							html: '<span class="material-icons">arrow_back</span>',
							name: 'edit',
							ariaLabel: 'panel edit',
							handler: function (panel) {
								if (this.statut === 'min') {
									panel.unsmallify()
								} else if (this.statut === 'max') {
									panel.normalize()
								}
								this.editer()
							}.bind(this),
							position: 1
						})
					}
					if (panneau && panneau.contains(document.querySelector('#' + this.id + ' .jsPanel-btn-focus')) === false && modulesAvecFocusLecture.includes(this.panneau.type) === true) {
						this.ajouterFocus(panneau)
					}
					if (panneau && this.$parent.pages.length > 1 && panneau.contains(document.querySelector('#' + this.id + ' .jsPanel-btn-send')) === false) {
						panneau.addControl({
							html: '<span class="material-icons">send</span>',
							name: 'send',
							ariaLabel: 'panel send',
							handler: function () {
								this.envoyer(this.id)
							}.bind(this),
							position: 2
						})
					}
					if (panneau && (modulesAvecZoom.includes(module) === true || module === 'image')) {
						if (panneau.contains(document.querySelector('#' + this.id + ' .jsPanel-btn-zoom-in')) === false) {
							panneau.addControl({
								html: '<span class="material-icons">add</span>',
								name: 'zoom-in',
								ariaLabel: 'panel zoom-in',
								handler: function () {
									if (module === 'image') {
										this.zoomer()
									} else {
										this.augmenterTaille()
									}
								}.bind(this),
								position: 1
							})
						}
						if (panneau.contains(document.querySelector('#' + this.id + ' .jsPanel-btn-zoom-out')) === false) {
							panneau.addControl({
								html: '<span class="material-icons">remove</span>',
								name: 'zoom-out',
								ariaLabel: 'panel zoom-out',
								handler: function () {
									if (module === 'image') {
										this.dezoomer()
									} else {
										this.reduireTaille()
									}
								}.bind(this),
								position: 2
							})
						}
						if (panneau.contains(document.querySelector('#' + this.id + ' .jsPanel-btn-reset')) === false) {
							panneau.addControl({
								html: '<span class="material-icons">center_focus_strong</span>',
								name: 'reset',
								ariaLabel: 'panel reset',
								handler: function () {
									if (module === 'image') {
										this.recadrer()
									} else {
										this.annulerTaille()
									}
								}.bind(this),
								position: 3
							})
						}
						if (panneau.contains(document.querySelector('#' + this.id + ' .jsPanel-btn-separator')) === false) {
							panneau.addControl({
								html: '<span></span>',
								name: 'separator',
								ariaLabel: 'panel separator',
								position: 4
							})
						}
					}
				}
				if (mode !== 'lecture') {
					if (panneau && modulesAvecMax.includes(module) === false) {
						panneau.setControlStatus('maximize', 'hide')
					}
					if (panneau && modulesSansEdition.includes(module) === false && panneau.contains(document.querySelector('#' + this.id + ' .jsPanel-btn-edit')) === true && module !== 'rebours') {
						panneau.setControlStatus('edit', 'remove')
					}
					if (panneau && panneau.contains(document.querySelector('#' + this.id + ' .jsPanel-btn-focus')) === true && module !== 'rebours') {
						panneau.setControlStatus('focus', 'remove')
					}
					if (panneau && (modulesAvecZoom.includes(module) === true || module === 'image')) {
						if (panneau.contains(document.querySelector('#' + this.id + ' .jsPanel-btn-zoom-in')) === true) {
							panneau.setControlStatus('zoom-in', 'remove')
						}
						if (panneau.contains(document.querySelector('#' + this.id + ' .jsPanel-btn-zoom-out')) === true) {
							panneau.setControlStatus('zoom-out', 'remove')
						}
						if (panneau.contains(document.querySelector('#' + this.id + ' .jsPanel-btn-reset')) === true) {
							panneau.setControlStatus('reset', 'remove')
						}
						if (panneau.contains(document.querySelector('#' + this.id + ' .jsPanel-btn-separator')) === true) {
							panneau.setControlStatus('separator', 'remove')
						}
					}
					if (panneau && this.$parent.pages.length > 1 && panneau.contains(document.querySelector('#' + this.id + ' .jsPanel-btn-send')) === true) {
						panneau.setControlStatus('send', 'remove')
					}
				}
			}.bind(this))
		},
		pages: {
			handler: function (pages) {
				if (pages.length > 1) {
					this.$nextTick(function () {
						const panneau = document.querySelector('#' + this.id)
						if (panneau && panneau.contains(document.querySelector('#' + this.id + ' .jsPanel-btn-send')) === false) {
							document.querySelector('#' + this.id).addControl({
								html: '<span class="material-icons">send</span>',
								name: 'send',
								ariaLabel: 'panel send',
								handler: function () {
									this.envoyer(this.id)
								}.bind(this),
								position: 2
							})
						}
					}.bind(this))
				}
			},
			deep: true
		},
		nav: function () {
			this.positionner()
		},
		statut: function (statut, ancienStatut) {
			if (ancienStatut === 'focus' && statut === '') {
				document.querySelector('#masque').remove()
				const panneaux = document.querySelectorAll('.jsPanel')
				panneaux.forEach(function (panneau) {
					if (panneau.id !== this.id) {
						panneau.style.display = 'flex'
					} else {
						if (this.redimensionnement) {
							panneau.resizeit('enable')
						}
						panneau.dragit('enable')
						panneau.querySelector('.jsPanel-controlbar').removeAttribute('style')
						panneau.style.transform = 'none'
						panneau.style.boxShadow = '0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)'
						panneau.style.background = '#fff'
						panneau.querySelector('.jsPanel-hdr').style.visibility = 'visible'
						panneau.querySelector('.jsPanel-content').style.background = '#fff'
						this.x = panneau.getAttribute('data-x')
						this.y = panneau.getAttribute('data-y')
						panneau.style.left = this.x + 'px'
						panneau.style.top = this.y + 'px'
						panneau.removeAttribute('data-y')
						panneau.removeAttribute('data-y')
					}
				}.bind(this))
				document.querySelector('nav').style.display = 'flex'
				document.querySelector('.bouton-cadenas').style.display = 'flex'
				if (document.querySelector('.nav')) {
					document.querySelector('.nav').style.display = 'flex'
				}
				if (document.querySelector('.bouton-export')) {
					document.querySelector('.bouton-export').style.display = 'flex'
				}
				if (document.querySelector('.bouton-plein-ecran')) {
					document.querySelector('.bouton-plein-ecran').style.display = 'flex'
				}
				if (document.querySelector('.bouton-capture')) {
					document.querySelector('.bouton-capture').style.display = 'flex'
				}
				if (document.querySelector('.bouton-annotation')) {
					document.querySelector('.bouton-annotation').style.display = 'flex'
				}
			}
		},
		evenementClavier: function ({ touche, id }) {
			this.gererClavier(touche, id, this.panneau.type)
		}
	}
}
