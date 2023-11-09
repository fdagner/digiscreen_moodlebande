<template>
	<TransitionGroup name="fondu">
		<div id="annotation" :class="{'curseur': this.outilDeplacer, 'avec-nav': nav}" key="canva">
			<v-stage ref="stage" :config="{width: dimensionsCanva.w, height: dimensionsCanva.h}" @mousedown="selectionnerDebut" @touchstart="selectionnerDebut" @mousemove="selectionnerMouvement" @touchmove="selectionnerMouvement" @mouseup="selectionnerFin" @touchend="selectionnerFin">
				<v-layer ref="objets">
					<template v-for="(item, indexItem) in items">
						<v-rect :config="item" v-if="item.objet === 'rectangle' || item.objet === 'rectangle-plein' || item.objet === 'surlignage'" @dragstart="selectionnerObjet" @dragend="deplacerFin" @transformend="redimensionnerFin" :key="'rectangle_' + indexItem" />
						<v-ellipse :config="item" v-else-if="item.objet === 'cercle' || item.objet === 'cercle-plein'" @dragend="deplacerFin" @transformend="redimensionnerFin" :key="'cercle_' + indexItem" @dragstart="selectionnerObjet" />
						<v-star :config="item" v-else-if="item.objet === 'etoile'" @dragstart="selectionnerObjet" @dragend="deplacerFin" @transformend="redimensionnerFin" :key="'etoile_' + indexItem" />
						<v-line :config="item" v-else-if="item.objet === 'ligne'" @dragstart="selectionnerObjet" @dragmove="deplacerForme" @dragend="enregistrer" :key="'ligne_' + indexItem" />
						<v-arrow :config="item" v-else-if="item.objet === 'fleche'" @dragstart="selectionnerObjet" @dragmove="deplacerForme" @dragend="enregistrer" :key="'fleche_' + indexItem" />
						<v-circle :config="item" v-else-if="item.objet === 'ancre'" @dragstart="selectionnerObjet" @dragmove="deplacerAncre" @dragend="enregistrer" :key="'ancre_' + indexItem" />
						<v-text :config="item" v-else-if="item.objet === 'texte'" @dragstart="selectionnerObjet" @dragend="deplacerFin" @dblclick="modifierTexte" @dbltap="modifierTexte" @transform="redimensionnerTexte" @transformend="redimensionnerFin" :key="'texte_' + indexItem" />
						<v-label :config="item" v-else-if="item.objet === 'label'" @dragstart="selectionnerObjet" @dragend="deplacerFin" @dblclick="modifierTexte" @dbltap="modifierTexte" @transformend="redimensionnerFin" :key="'label_' + indexItem">
							<v-tag :config="item.tag" />
							<v-text :config="item.text" />
						</v-label>
						<v-line :config="item" v-else-if="item.objet === 'dessin'" @dragstart="selectionnerObjet" @dragend="deplacerFin" :key="'dessin_' + indexItem" />
					</template>
					<v-rect :config="{name: 'selection', fill: 'rgba(1, 206, 209, 0.2)', visible: selection, x: positionSelectionX, y: positionSelectionY, width: largeurSelection, height: hauteurSelection}" @dragend="deplacerFin" @transformend="redimensionnerFin" />
					<v-rect :config="{name: 'objet-rectangle', fill: 'transparent', visible: creation && outil === 'rectangle', x: positionObjetX, y: positionObjetY, width: largeurObjet, height: hauteurObjet, stroke: '#ff0000', strokeWidth: 3, dash: [7, 5]}" @dragend="deplacerFin" @transformend="redimensionnerFin" />
					<v-rect :config="{name: 'objet-rectangle', fill: '#cccccc', visible: creation && outil === 'rectangle-plein', x: positionObjetX, y: positionObjetY, width: largeurObjet, height: hauteurObjet}" @dragend="deplacerFin" @transformend="redimensionnerFin" />
					<v-ellipse :config="{name: 'objet-cercle', fill: 'transparent', visible: creation && outil === 'cercle', x: positionObjetX + (largeurObjet / 2), y: positionObjetY + (hauteurObjet / 2), width: largeurObjet, height: hauteurObjet, stroke: '#ff0000', strokeWidth: 3, dash: [7, 5]}" @dragend="deplacerFin" @transformend="redimensionnerFin" />
					<v-ellipse :config="{name: 'objet-cercle', fill: '#cccccc', visible: creation && outil === 'cercle-plein', x: positionObjetX + (largeurObjet / 2), y: positionObjetY + (hauteurObjet / 2), width: largeurObjet, height: hauteurObjet}" @dragend="deplacerFin" @transformend="redimensionnerFin" />
					<v-rect :config="{name: 'objet-surlignage', fill: '#ffff00', opacity: 0.5, visible: creation && outil === 'surlignage', x: positionObjetX, y: positionObjetY, width: largeurObjet, height: hauteurObjet}" @dragend="deplacerFin" @transformend="redimensionnerFin" />
					<v-line :config="{name: 'objet-ligne', fill: '#ff0000', visible: creation && outil === 'ligne', x: 0, y: 0, points: [positionX1, positionY1, positionX2, positionY2], fill: '#ff0000', stroke: '#ff0000', strokeWidth: 3}" @dragend="deplacerFin" @transformend="redimensionnerFin" />
					<v-arrow :config="{name: 'objet-fleche', fill: '#ff0000', visible: creation && outil === 'fleche', x: 0, y: 0, points: [positionX1, positionY1, positionX2, positionY2], pointerLength: 15, pointerWidth: 12, fill: '#ff0000', stroke: '#ff0000', strokeWidth: 3}" @dragend="deplacerFin" @transformend="redimensionnerFin" />
					<v-transformer ref="transformer" :config="{anchorStroke: '#ff0000', anchorFill: '#ffff00', anchorSize: 10, anchorCornerRadius: 10, borderStroke: definirCouleurBordure(), borderDash: [3, 3], borderStrokeWidth: 1, enabledAnchors: definirAncres(), padding: 7.5, rotateEnabled: false, keepRatio: true, boundBoxFunc: definirLimites}" />
				</v-layer>
			</v-stage>
		</div>

		<div id="outils-annotation" key="outils">
			<span class="outil historique" :title="$t('defaire')" @click="defaire">
				<img src="@/assets/img/defaire.png" :alt="$t('defaire')">
			</span>
			<span class="outil historique" :title="$t('refaire')" @click="refaire">
				<img src="@/assets/img/refaire.png" :alt="$t('refaire')">
			</span>
			<span class="separateur" />
			<span class="outil" :title="$t('selectionner')" :class="{'actif': outilSelectionner}" @click="definirOutilPrincipal('selectionner')">
				<img src="@/assets/img/curseur.png" :alt="$t('selectionner')">
			</span>
			<span class="outil" :title="$t('dessiner')" :class="{'actif': outilDessiner}" @click="definirOutilPrincipal('dessiner')">
				<img src="@/assets/img/stylo.png" :alt="$t('dessiner')">
			</span>
			<span class="outil" :title="$t('deplacer')" :class="{'actif': outilDeplacer}" @click="definirOutilPrincipal('deplacer')">
				<img src="@/assets/img/pan.png" :alt="$t('deplacer')">
			</span>
			<span class="separateur" />
			<span id="outil-rectangle" class="outil" :title="$t('rectangle')" :class="{'actif': outilSelectionner && outil === 'rectangle'}" @click="selectionnerOutil('rectangle')">
				<img src="@/assets/img/rectangle.png" :alt="$t('rectangle')">
			</span>
			<span id="outil-rectangle-plein" class="outil" :title="$t('rectanglePlein')" :class="{'actif': outilSelectionner && outil === 'rectangle-plein'}" @click="selectionnerOutil('rectangle-plein')">
				<img src="@/assets/img/rectangle-plein.png" :alt="$t('rectanglePlein')">
			</span>
			<span id="outil-cercle" class="outil" :title="$t('cercle')" :class="{'actif': outilSelectionner && outil === 'cercle'}" @click="selectionnerOutil('cercle')">
				<img src="@/assets/img/cercle.png" :alt="$t('cercle')">
			</span>
			<span id="outil-cercle-plein" class="outil" :title="$t('cerclePlein')" :class="{'actif': outilSelectionner && outil === 'cercle-plein'}" @click="selectionnerOutil('cercle-plein')">
				<img src="@/assets/img/cercle-plein.png" :alt="$t('cerclePlein')">
			</span>
			<span id="outil-etoile" class="outil" :title="$t('etoile')" :class="{'actif': outilSelectionner && outil === 'etoile'}" @click="selectionnerOutil('etoile')">
				<img src="@/assets/img/etoile.png" :alt="$t('etoile')">
			</span>
			<span id="outil-surlignage" class="outil" :title="$t('surlignage')" :class="{'actif': outilSelectionner && outil === 'surlignage'}" @click="selectionnerOutil('surlignage')">
				<img src="@/assets/img/surligneur.png" :alt="$t('surlignage')">
			</span>
			<span id="outil-ligne" class="outil" :title="$t('ligne')" :class="{'actif': outilSelectionner && outil === 'ligne'}" @click="selectionnerOutil('ligne')">
				<img src="@/assets/img/ligne.png" :alt="$t('ligne')">
			</span>
			<span id="outil-fleche" class="outil" :title="$t('fleche')" :class="{'actif': outilSelectionner && outil === 'fleche'}" @click="selectionnerOutil('fleche')">
				<img src="@/assets/img/fleche.png" :alt="$t('fleche')">
			</span>
			<span id="outil-texte" class="outil" :title="$t('texte')" :class="{'actif': outilSelectionner && outil === 'texte'}" @click="selectionnerOutil('texte')">
				<img src="@/assets/img/texte.png" :alt="$t('texte')">
			</span>
			<span id="outil-label" class="outil" :title="$t('label')" :class="{'actif': outilSelectionner && outil === 'label'}" @click="selectionnerOutil('label')">
				<img src="@/assets/img/label.png" :alt="$t('label')">
			</span>
			<span class="separateur" />
			<span class="outil" :title="$t('reinitialiser')" @click="afficherReinitialiser">
				<img src="@/assets/img/reinitialiser.png" :alt="$t('reinitialiser')">
			</span>
			<span class="outil" :title="$t('fermer')" @click="$emit('fermer')">
				<img src="@/assets/img/fermer.png" :alt="$t('fermer')">
			</span>
		</div>

		<div id="options" v-if="nom !== '' || (!outilSelectionner && !outilDeplacer)" key="options">
			<span class="option icone" :title="$t('verrouiller')" @click="verrouiller" v-if="outilSelectionner && !objetVerrouille">
				<span><i class="material-icons">lock</i></span>
			</span>
			<span class="option icone orange" :title="$t('deverrouiller')" @click="deverrouiller" v-else-if="outilSelectionner && objetVerrouille">
				<span><i class="material-icons">lock_open</i></span>
			</span>
			<span class="option icone" :title="$t('mettreDevant')" @click="mettreDevant" v-if="outilSelectionner && objet !== 'selection'">
				<span><i class="material-icons">flip_to_front</i></span>
			</span>
			<span class="option icone" :title="$t('mettreDerriere')" @click="mettreDerriere" v-if="outilSelectionner && objet !== 'selection'">
				<span><i class="material-icons">flip_to_back</i></span>
			</span>
			<span class="separateur" v-if="outilSelectionner" />
			<span class="option noir" :class="{'actif': outilDessiner && couleurStylo === '#000000'}" :title="$t('noir')" @click="modifierCouleur('#000000')" v-if="nom !== 'selection' && objet !== 'label'">
				<span class="couleur noir" />
			</span>
			<span class="option blanc" :class="{'actif': outilDessiner && couleurStylo === '#ffffff'}" :title="$t('blanc')" @click="modifierCouleur('#ffffff')" v-if="nom !== 'selection' && objet !== 'label'">
				<span class="couleur blanc" />
			</span>
			<span class="option rouge" :class="{'actif': outilDessiner && couleurStylo === '#ff0000'}" :title="$t('rouge')" @click="modifierCouleur('#ff0000')" v-if="nom !== 'selection'">
				<span class="couleur rouge" />
			</span>
			<span class="option jaune" :class="{'actif': outilDessiner && couleurStylo === '#ffff00'}" :title="$t('jaune')" @click="modifierCouleur('#ffff00')" v-if="nom !== 'selection'">
				<span class="couleur jaune" />
			</span>
			<span class="option vert" :class="{'actif': outilDessiner && couleurStylo === '#00ff00'}" :title="$t('vert')" @click="modifierCouleur('#00ff00')" v-if="nom !== 'selection'">
				<span class="couleur vert" />
			</span>
			<span class="option bleu" :class="{'actif': outilDessiner && couleurStylo === '#04fdff'}" :title="$t('bleu')" @click="modifierCouleur('#04fdff')" v-if="nom !== 'selection'">
				<span class="couleur bleu" />
			</span>
			<span class="option icone" v-if="nom !== 'selection'" @click="definirCouleur">
				<label for="couleur-annotation"><i class="material-icons">colorize</i></label>
				<input type="color" id="couleur-annotation" :value="couleurSelecteur" :title="$t('selectionnerCouleur')">
			</span>
			<span class="separateur" v-if="outilDessiner" />
			<span class="option label-epaisseur" v-if="outilDessiner">
				<span><i class="material-icons">line_weight</i></span>
			</span>
			<span class="option epaisseur" :class="{'actif': epaisseurStylo === 2}" @click="modifierEpaisseur(2)" v-if="outilDessiner">
				<span>2</span>
			</span>
			<span class="option epaisseur" :class="{'actif': epaisseurStylo === 5}" @click="modifierEpaisseur(5)" v-if="outilDessiner">
				<span>5</span>
			</span>
			<span class="option epaisseur" :class="{'actif': epaisseurStylo === 10}" @click="modifierEpaisseur(10)" v-if="outilDessiner">
				<span>10</span>
			</span>
			<span class="option epaisseur" :class="{'actif': epaisseurStylo === 20}" @click="modifierEpaisseur(20)" v-if="outilDessiner">
				<span>20</span>
			</span>
			<span class="option epaisseur" :class="{'actif': epaisseurStylo === 40}" @click="modifierEpaisseur(40)" v-if="outilDessiner">
				<span>40</span>
			</span>
			<span class="option epaisseur" :class="{'actif': epaisseurStylo === 80}" @click="modifierEpaisseur(80)" v-if="outilDessiner">
				<span>80</span>
			</span>
			<span class="option label-transparence" v-if="outilDessiner">
				<span><i class="material-icons">opacity</i></span>
			</span>
			<span class="option transparence" :class="{'actif': transparenceStylo === 0.4}" v-if="outilDessiner" @click="modifierTransparence(0.4)">
				<span>0.4</span>
			</span>
			<span class="option transparence" :class="{'actif': transparenceStylo === 0.6}" v-if="outilDessiner" @click="modifierTransparence(0.6)">
				<span>0.6</span>
			</span>
			<span class="option transparence" :class="{'actif': transparenceStylo === 1}" v-if="outilDessiner" @click="modifierTransparence(1)">
				<span>1</span>
			</span>
			<span class="separateur" v-if="outilSelectionner && nom !== 'selection'" />
			<span class="option label-transparence" v-if="outilSelectionner && nom !== 'selection' && (objet === 'rectangle-plein' || objet === 'cercle-plein')">
				<span><i class="material-icons">opacity</i></span>
			</span>
			<span class="option icone" :title="$t('reduireTransparence')" v-if="outilSelectionner && nom !== 'selection' && (objet === 'rectangle-plein' || objet === 'cercle-plein')" @click="reduireTransparence">
				<span><i class="material-icons">remove</i></span>
			</span>
			<span class="option icone" :title="$t('augmenterTransparence')" v-if="outilSelectionner && nom !== 'selection' && (objet === 'rectangle-plein' || objet === 'cercle-plein')" @click="augmenterTransparence">
				<span><i class="material-icons">add</i></span>
			</span>
			<span class="option label-taille" v-if="outilSelectionner && nom !== 'selection' && objet === 'texte'">
				<span><i class="material-icons">format_size</i></span>
			</span>
			<span class="option icone" :title="$t('reduireTaille')" v-if="outilSelectionner && nom !== 'selection' && objet === 'texte'" @click="reduireTailleTexte">
				<span><i class="material-icons">remove</i></span>
			</span>
			<span class="option icone" :title="$t('augmenterTaille')" v-if="outilSelectionner && nom !== 'selection' && objet === 'texte'" @click="augmenterTailleTexte">
				<span><i class="material-icons">add</i></span>
			</span>
			<span class="separateur" v-if="(outilSelectionner && nom !== 'selection' && (objet === 'texte' || objet === 'rectangle-plein' || objet === 'cercle-plein'))" />
			<span class="option icone" :title="$t('dupliquer')" v-if="outilSelectionner && nom !== 'selection'" @click="dupliquer">
				<span><i class="material-icons">content_copy</i></span>
			</span>
			<span class="option icone rouge" :title="$t('supprimer')" @click="supprimer" v-if="outilSelectionner && nom !== 'selection'">
				<span><i class="material-icons">delete</i></span>
			</span>
			<span class="option icone rouge" :title="$t('supprimer')" @click="supprimerSelection" v-else-if="outilSelectionner && nom === 'selection'">
				<span><i class="material-icons">delete</i></span>
			</span>
		</div>

		<div id="annotation-texte" class="conteneur-modale" v-if="modale" key="modale">
			<div class="modale">
				<div class="conteneur">
					<div class="contenu">
						<textarea :value="texte" @input="texte = $event.target.value" :placeholder="$t('monTexte')" />
						<div class="actions">
							<span class="bouton" role="button" tabindex="0" @click="fermerModale">{{ $t('annuler') }}</span>
							<span class="bouton" role="button" tabindex="0" @click="ajouterTexte" v-if="outil === 'texte' || outil === 'label'">{{ $t('valider') }}</span>
							<span class="bouton" role="button" tabindex="0" @click="enregistrerTexte" v-else>{{ $t('valider') }}</span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div id="confirmation" class="conteneur-modale" v-if="confirmation" key="confirmation">
			<div class="modale">
				<div class="conteneur">
					<div class="contenu">
						<p v-html="$t('reinitialiserAnnotations')" />
						<div class="actions">
							<span class="bouton" role="button" tabindex="0" @click="confirmation = false">{{ $t('annuler') }}</span>
							<span class="bouton" role="button" tabindex="0" @click="reinitialiser">{{ $t('valider') }}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</TransitionGroup>
</template>

<script>
import Konva from 'konva'

export default {
	name: 'Annotation',
	props: {
		panneaux: Array,
		annotations: Object,
		largeur: Number,
		hauteur: Number,
		nav: Boolean
	},
	data () {
		return {
			modale: false,
			confirmation: false,
			dimensionsCanva: { w: 0, h: 0 },
			texte: '',
			id: 0,
			nom: '',
			objet: '',
			objetVerrouille: false,
			outilSelectionner: true,
			outilDeplacer: false,
			outilDessiner: false,
			items: [],
			dessin: false,
			historique: [],
			positionHistorique: 0,
			positionActuelleHistorique: 0,
			selection: false,
			positionX1: 0,
			positionY1: 0,
			positionX2: 0,
			positionY2: 0,
			positionSelectionX: 0,
			positionSelectionY: 0,
			largeurSelection: 0,
			hauteurSelection: 0,
			positionStylo: [],
			couleurStylo: '#000000',
			couleurSelecteur: '#000000',
			epaisseurStylo: 2,
			transparenceStylo: 1,
			outil: '',
			creation: false,
			positionObjetX: 0,
			positionObjetY: 0,
			largeurObjet: 0,
			hauteurObjet: 0
		}
	},
	watch: {
		panneaux: function () {
			this.reinitialiserOutils()
			this.definirOutilPrincipal('deplacer')
		},
		largeur: function () {
			this.$nextTick(function () {
				const rect = document.querySelector('#annotation').getBoundingClientRect()
				this.dimensionsCanva.w = rect.width
			}.bind(this))
		},
		hauteur: function () {
			this.$nextTick(function () {
				const rect = document.querySelector('#annotation').getBoundingClientRect()
				this.dimensionsCanva.h = rect.height
			}.bind(this))
		},
		outilSelectionner: function (valeur) {
			if (valeur === true) {
				this.activerDeplacement()
			}
			this.reinitialiserSelection()
		},
		outilDeplacer: function (valeur) {
			if (valeur === true) {
				this.desactiverDeplacement()
			}
			this.reinitialiserSelection()
		},
		outilDessiner: function (valeur) {
			if (valeur === true) {
				this.desactiverDeplacement()
				this.couleurStylo = '#000000'
				this.couleurSelecteur = '#000000'
			} else {
				this.couleurSelecteur = '#000000'
			}
			this.positionStylo = []
			this.reinitialiserSelection()
		},
		outil: function (valeur) {
			if (valeur === '') {
				this.activerDeplacement()
			} else {
				this.desactiverDeplacement()
			}
		}
	},
	mounted () {
		if (Object.keys(this.annotations).length > 0) {
			this.id = this.annotations.id
			if (this.annotations.hasOwnProperty('rectangles')) {
				const items = this.annotations.rectangles.concat(this.annotations.cercles, this.annotations.etoiles, this.annotations.lignes, this.annotations.fleches, this.annotations.ancres, this.annotations.textes, this.annotations.dessins)
				this.items = items
			} else {
				this.items = this.annotations.items
			}
			this.activerDeplacement()
		}
		this.enregistrer()
		const rect = document.querySelector('#annotation').getBoundingClientRect()
		this.dimensionsCanva.w = rect.width
		this.dimensionsCanva.h = rect.height
		window.addEventListener('keydown', this.gererClavier, false)
	},
	beforeUnmount () {
		if (document.querySelector('#couleur-annotation')) {
			document.querySelector('#couleur-annotation').removeEventListener('change', this.modifierCouleurSelecteur)
		}
		window.removeEventListener('keydown', this.gererClavier, false)
	},
	methods: {
		definirOutilPrincipal (type) {
			this.outilSelectionner = false
			this.outilDeplacer = false
			this.outilDessiner = false
			if (type === 'selectionner') {
				this.outilSelectionner = true
				this.$emit('outilDeplacer', false)
				this.desactiverSelecteur()
			} else if (type === 'deplacer') {
				this.outilDeplacer = true
				this.$emit('outilDeplacer', true)
				this.desactiverSelecteur()
			} else if (type === 'dessiner') {
				this.outilDessiner = true
				this.$emit('outilDeplacer', false)
				this.activerSelecteur()
			}
		},
		selectionnerOutil (type) {
			const outils = document.querySelectorAll('#outils-annotation .outil.actif')
			let actif = ''
			outils.forEach(function (outil) {
				if (outil.id) {
					actif = outil.id
				}
			})
			this.definirOutilPrincipal('selectionner')
			this.reinitialiserOutils()
			if ('outil-' + type !== actif) {
				this.outil = type
			}
		},
		ajouter (type) {
			this.definirOutilPrincipal('selectionner')
			this.objetVerrouille = false
			this.id++
			switch (type) {
			case 'rectangle':
				this.items.push({ name: 'rect' + this.id, objet: 'rectangle', x: this.positionObjetX, y: this.positionObjetY, scaleX: 1, scaleY: 1, width: this.largeurObjet, height: this.hauteurObjet, rotation: 0, fill: 'transparent', stroke: '#ff0000', strokeWidth: 3, strokeScaleEnabled: false, opacity: 1, draggable: true, verrouille: false })
				this.nom = 'rect' + this.id
				this.objet = 'rectangle'
				break
			case 'rectangle-plein':
				this.items.push({ name: 'rect' + this.id, objet: 'rectangle-plein', x: this.positionObjetX, y: this.positionObjetY, scaleX: 1, scaleY: 1, width: this.largeurObjet, height: this.hauteurObjet, rotation: 0, fill: '#cccccc', opacity: 1, draggable: true, verrouille: false })
				this.nom = 'rect' + this.id
				this.objet = 'rectangle-plein'
				break
			case 'cercle':
				this.items.push({ name: 'circ' + this.id, objet: 'cercle', x: this.positionObjetX + (this.largeurObjet / 2), y: this.positionObjetY + (this.hauteurObjet / 2), scaleX: 1, scaleY: 1, width: this.largeurObjet, height: this.hauteurObjet, rotation: 0, fill: 'transparent', stroke: '#ff0000', strokeWidth: 3, strokeScaleEnabled: false, opacity: 1, draggable: true, verrouille: false })
				this.nom = 'circ' + this.id
				this.objet = 'cercle'
				break
			case 'cercle-plein':
				this.items.push({ name: 'circ' + this.id, objet: 'cercle-plein', x: this.positionObjetX + (this.largeurObjet / 2), y: this.positionObjetY + (this.hauteurObjet / 2), scaleX: 1, scaleY: 1, width: this.largeurObjet, height: this.hauteurObjet, rotation: 0, fill: '#cccccc', opacity: 1, draggable: true, verrouille: false })
				this.nom = 'circ' + this.id
				this.objet = 'cercle-plein'
				break
			case 'etoile':
				this.items.push({ name: 'star' + this.id, objet: 'etoile', x: this.positionX1, y: this.positionY1, scaleX: 1, scaleY: 1, width: this.convertirRem(12), height: this.convertirRem(12), rotation: 0, fill: '#ffff00', stroke: 'black', strokeWidth: 3, strokeScaleEnabled: false, numPoints: 5, innerRadius: 20, outerRadius: 45, opacity: 1, draggable: true, verrouille: false })
				this.nom = 'star' + this.id
				this.objet = 'etoile'
				break
			case 'surlignage':
				this.items.push({ name: 'rect' + this.id, objet: 'surlignage', x: this.positionObjetX, y: this.positionObjetY, scaleX: 1, scaleY: 1, width: this.largeurObjet, height: this.hauteurObjet, rotation: 0, fill: '#ffff00', opacity: 0.5, draggable: true, verrouille: false })
				this.nom = 'rect' + this.id
				this.objet = 'surlignage'
				break
			case 'ligne':
				this.items.push({ name: 'line' + this.id, objet: 'ligne', x: 0, y: 0, scaleX: 1, scaleY: 1, points: [this.positionX1, this.positionY1, this.positionX2, this.positionY2], fill: '#ff0000', stroke: '#ff0000', strokeWidth: 3, hitStrokeWidth: 50, opacity: 1, draggable: true, verrouille: false })
				this.items.push({ name: 'ancr_line' + this.id + '_1', objet: 'ancre', x: this.positionX1, y: this.positionY1, radius: 10, width: 10, height: 10, fill: '#ffff00', stroke: '#ff0000', strokeWidth: 2, visible: true, opacity: 1, draggable: true })
				this.items.push({ name: 'ancr_line' + this.id + '_2', objet: 'ancre', x: this.positionX2, y: this.positionY2, radius: 10, width: 10, height: 10, fill: '#ffff00', stroke: '#ff0000', strokeWidth: 2, visible: true, opacity: 1, draggable: true })
				this.nom = 'line' + this.id
				this.objet = 'ligne'
				break
			case 'fleche':
				this.items.push({ name: 'flec' + this.id, objet: 'fleche', x: 0, y: 0, scaleX: 1, scaleY: 1, points: [this.positionX1, this.positionY1, this.positionX2, this.positionY2], pointerLength: 15, pointerWidth: 12, fill: '#ff0000', stroke: '#ff0000', strokeWidth: 3, hitStrokeWidth: 50, opacity: 1, draggable: true, verrouille: false })
				this.items.push({ name: 'ancr_flec' + this.id + '_1', objet: 'ancre', x: this.positionX1, y: this.positionY1, radius: 10, width: 10, height: 10, fill: '#ffff00', stroke: '#ff0000', strokeWidth: 2, visible: true, opacity: 1, draggable: true })
				this.items.push({ name: 'ancr_flec' + this.id + '_2', objet: 'ancre', x: this.positionX2, y: this.positionY2, radius: 10, width: 10, height: 10, fill: '#ffff00', stroke: '#ff0000', strokeWidth: 2, visible: true, opacity: 1, draggable: true })
				this.nom = 'flec' + this.id
				this.objet = 'fleche'
				break
			case 'texte':
				this.items.push({ name: 'text' + this.id, objet: 'texte', text: this.texte, fontSize: 30, lineHeight: 1.25, verticalAlign: 'middle', padding: 10, x: this.positionX1, y: this.positionY1, rotation: 0, scaleX: 1, scaleY: 1, fill: '#ff0000', opacity: 1, wrap: 'word', draggable: true, verrouille: false })
				this.nom = 'text' + this.id
				this.objet = 'texte'
				break
			case 'label':
				this.items.push({ name: 'labl' + this.id, objet: 'label', x: this.positionX1, y: this.positionY1, rotation: 0, opacity: 1, draggable: true, verrouille: false, tag: { name: 'labl' + this.id, objet: 'label', shadowColor: '#222222', shadowBlur: 10, shadowOffset: [7, 7], shadowOpacity: 0.2, fill: '#ffff00' }, text: { name: 'labl' + this.id, objet: 'label', text: this.texte, fontSize: 25, lineHeight: 1.25, verticalAlign: 'middle', fill: '#000000', padding: 15, wrap: 'word', align: 'center' } })
				this.nom = 'labl' + this.id
				this.objet = 'label'
				break
			}
			this.enregistrer()
			this.$nextTick(function () {
				this.transformer()
			}.bind(this))
		},
		verrouiller () {
			let item
			if (this.objet !== 'selection') {
				item = this.items.find(r => r.name === this.nom)
				if (item) {
					item.draggable = false
					item.verrouille = true
				}
			} else {
				const objets = this.$refs.transformer.getNode().nodes()
				for (let i = 0; i < objets.length; i++) {
					item = this.items.find(r => r.name === objets[i].getAttrs().name)
					if (item) {
						item.draggable = false
						item.verrouille = true
					}
				}
			}
			this.objetVerrouille = true
			this.items.forEach(function (item, index) {
				if (item.objet === 'ancre') {
					this.items[index].visible = false
				}
			}.bind(this))
			if (this.objet !== 'selection') {
				this.transformer()
			} else {
				const transformer = this.$refs.transformer.getNode()
				transformer.getLayer().batchDraw()
			}
			this.enregistrer()
		},
		deverrouiller () {
			let item
			if (this.objet !== 'selection') {
				item = this.items.find(r => r.name === this.nom)
				if (item) {
					item.draggable = true
					item.verrouille = false
				}
			} else {
				const objets = this.$refs.transformer.getNode().nodes()
				for (let i = 0; i < objets.length; i++) {
					item = this.items.find(r => r.name === objets[i].getAttrs().name)
					if (item) {
						item.draggable = true
						item.verrouille = false
					}
				}
			}
			this.nom = item.name
			this.objet = item.objet
			this.objetVerrouille = false
			const type = this.nom.substring(0, 4)
			if (type === 'flec' || type === 'line') {
				const ancre1 = this.items.find(r => r.name === 'ancr_' + this.nom + '_1')
				const ancre2 = this.items.find(r => r.name === 'ancr_' + this.nom + '_2')
				ancre1.visible = true
				ancre2.visible = true
			}
			if (this.objet !== 'selection') {
				this.transformer()
			} else {
				const transformer = this.$refs.transformer.getNode()
				transformer.getLayer().batchDraw()
			}
			this.enregistrer()
		},
		mettreDevant () {
			this.items.forEach(function (item, index) {
				if (item.name === this.nom && index < this.items.length) {
					this.items.splice(index, 1)
					this.items.splice(index + 1, 0, item)
				}
			}.bind(this))
			this.enregistrer()
			this.$nextTick(function () {
				this.transformer()
			}.bind(this))
		},
		mettreDerriere () {
			this.items.forEach(function (item, index) {
				if (item.name === this.nom && index > 0) {
					this.items.splice(index, 1)
					this.items.splice(index - 1, 0, item)
				}
			}.bind(this))
			this.enregistrer()
			this.$nextTick(function () {
				this.transformer()
			}.bind(this))
		},
		reduireTransparence () {
			const item = this.items.find(r => r.name === this.nom)
			const transparence = parseFloat(item.opacity.toFixed(1))
			if (transparence > 0.1) {
				item.opacity = transparence - 0.1
			}
			this.enregistrer()
		},
		augmenterTransparence () {
			const item = this.items.find(r => r.name === this.nom)
			const transparence = parseFloat(item.opacity.toFixed(1))
			if (transparence < 1) {
				item.opacity = transparence + 0.1
			}
			this.enregistrer()
		},
		dupliquer () {
			const id = (new Date()).getTime() + Math.random().toString(16).slice(10)
			const items = []
			let nom, objet
			JSON.parse(JSON.stringify(this.items)).forEach(function (item) {
				if (item.name.includes(this.nom)) {
					items.push(item)
				}
			}.bind(this))
			items.forEach(function (item) {
				const type = item.name.substring(0, 4)
				if (type === 'ancr') {
					item.name = item.name.substring(0, 9) + id + item.name.substring(item.name.length - 2)
					item.x = item.x + 20
					item.y = item.y + 20
				} else {
					nom = type + id
					objet = item.objet
					item.name = nom
					item.x = item.x + 20
					item.y = item.y + 20
				}
				if (type === 'labl') {
					item.tag.name = type + id
					item.text.name = type + id
				}
			})
			this.items.forEach(function (item, index) {
				if (item.objet === 'ancre') {
					this.items[index].visible = false
				}
			}.bind(this))
			this.$nextTick(function () {
				this.items.push(...items)
				this.nom = nom
				this.objet = objet
				this.enregistrer()
				this.$nextTick(function () {
					this.transformer()
				}.bind(this))
			}.bind(this))
		},
		supprimer () {
			const type = this.nom.substring(0, 4)
			const nom = this.nom
			if (type === 'ancr') {
				this.items = this.items.filter(r => !r.name.includes(nom.split('_')[1]))
			} else {
				this.items = this.items.filter(r => !r.name.includes(nom))
			}
			this.nom = ''
			this.objet = ''
			this.enregistrer()
			this.transformer()
		},
		supprimerSelection () {
			const objets = this.$refs.transformer.getNode().nodes()
			for (let i = 0; i < objets.length; i++) {
				this.nom = objets[i].getAttrs().name
				this.supprimer()
			}
		},
		gererClavier (event) {
			if (event.ctrlKey && event.key === 'd' && this.modale !== 'texte') {
				event.preventDefault()
				this.dupliquer()
			} else if ((event.key === 'Backspace' || event.key === 'Delete') && this.modale !== 'texte') {
				if (this.nom !== '' && this.objet !== 'selection') {
					this.supprimer()
				} else if (this.nom !== '' && this.objet === 'selection') {
					this.supprimerSelection()
				}
			} else if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
				let item, type, ancre1, ancre2
				if (this.objet !== 'selection') {
					item = this.items.find(r => r.name === this.nom)
					type = this.nom.substring(0, 4)
					if (item && event.key === 'ArrowDown') {
						item.y = item.y + 2
						if (type === 'flec' || type === 'line') {
							ancre1 = this.items.find(r => r.name === 'ancr_' + this.nom + '_1')
							ancre2 = this.items.find(r => r.name === 'ancr_' + this.nom + '_2')
							ancre1.y = ancre1.y + 2
							ancre2.y = ancre2.y + 2
						}
					} else if (item && event.key === 'ArrowUp') {
						item.y = item.y - 2
						if (type === 'flec' || type === 'line') {
							ancre1 = this.items.find(r => r.name === 'ancr_' + this.nom + '_1')
							ancre2 = this.items.find(r => r.name === 'ancr_' + this.nom + '_2')
							ancre1.y = ancre1.y - 2
							ancre2.y = ancre2.y - 2
						}
					} else if (item && event.key === 'ArrowLeft') {
						item.x = item.x - 2
						if (type === 'flec' || type === 'line') {
							ancre1 = this.items.find(r => r.name === 'ancr_' + this.nom + '_1')
							ancre2 = this.items.find(r => r.name === 'ancr_' + this.nom + '_2')
							ancre1.x = ancre1.x - 2
							ancre2.x = ancre2.x - 2
						}
					} else if (item && event.key === 'ArrowRight') {
						item.x = item.x + 2
						if (type === 'flec' || type === 'line') {
							ancre1 = this.items.find(r => r.name === 'ancr_' + this.nom + '_1')
							ancre2 = this.items.find(r => r.name === 'ancr_' + this.nom + '_2')
							ancre1.x = ancre1.x + 2
							ancre2.x = ancre2.x + 2
						}
					}
				} else {
					const objets = this.$refs.transformer.getNode().nodes()
					for (let i = 0; i < objets.length; i++) {
						item = this.items.find(r => r.name === objets[i].getAttrs().name)
						type = objets[i].getAttrs().name.substring(0, 4)
						if (item && event.key === 'ArrowDown') {
							item.y = item.y + 2
							if (type === 'flec' || type === 'line') {
								ancre1 = this.items.find(r => r.name === 'ancr_' + objets[i].getAttrs().name + '_1')
								ancre2 = this.items.find(r => r.name === 'ancr_' + objets[i].getAttrs().name + '_2')
								ancre1.y = ancre1.y + 2
								ancre2.y = ancre2.y + 2
							}
						} else if (item && event.key === 'ArrowUp') {
							item.y = item.y - 2
							if (type === 'flec' || type === 'line') {
								ancre1 = this.items.find(r => r.name === 'ancr_' + objets[i].getAttrs().name + '_1')
								ancre2 = this.items.find(r => r.name === 'ancr_' + objets[i].getAttrs().name + '_2')
								ancre1.y = ancre1.y - 2
								ancre2.y = ancre2.y - 2
							}
						} else if (item && event.key === 'ArrowLeft') {
							item.x = item.x - 2
							if (type === 'flec' || type === 'line') {
								ancre1 = this.items.find(r => r.name === 'ancr_' + objets[i].getAttrs().name + '_1')
								ancre2 = this.items.find(r => r.name === 'ancr_' + objets[i].getAttrs().name + '_2')
								ancre1.x = ancre1.x - 2
								ancre2.x = ancre2.x - 2
							}
						} else if (item && event.key === 'ArrowRight') {
							item.x = item.x + 2
							if (type === 'flec' || type === 'line') {
								ancre1 = this.items.find(r => r.name === 'ancr_' + objets[i].getAttrs().name + '_1')
								ancre2 = this.items.find(r => r.name === 'ancr_' + objets[i].getAttrs().name + '_2')
								ancre1.x = ancre1.x + 2
								ancre2.x = ancre2.x + 2
							}
						}
					}
				}
			}
		},
		afficherReinitialiser () {
			this.confirmation = true
		},
		reinitialiser () {
			this.definirOutilPrincipal('selectionner')
			this.id = 0
			this.nom = ''
			this.objet = ''
			this.objetVerrouille = false
			this.items = []
			this.historique = []
			this.positionHistorique = 0
			this.positionActuelleHistorique = 0
			this.transformer()
			this.enregistrer()
			this.confirmation = false
		},
		deplacerFin (event) {
			let item
			if (this.objet !== 'selection') {
				item = this.items.find(r => r.name === this.nom)
				if (item) {
					item.x = event.target.x()
					item.y = event.target.y()
				}
			} else {
				const objets = this.$refs.transformer.getNode().nodes()
				for (let i = 0; i < objets.length; i++) {
					item = this.items.find(r => r.name === objets[i].getAttrs().name)
					if (item) {
						item.x = objets[i].getAttrs().x
						item.y = objets[i].getAttrs().y
					}
				}
			}
			this.enregistrer()
		},
		redimensionnerTexte (event) {
			const type = this.nom.substring(0, 4)
			if (type === 'text') {
				event.target.setAttrs({
					width: Math.max(event.target.width() * event.target.scaleX(), 70),
					scaleX: 1,
					scaleY: 1
				})
			}
		},
		redimensionnerFin (event) {
			const item = this.items.find(r => r.name === this.nom)
			if (item) {
				item.x = event.target.x()
				item.y = event.target.y()
				item.width = event.target.width()
				item.height = event.target.height()
				item.scaleX = event.target.scaleX()
				item.scaleY = event.target.scaleY()
			}
			this.enregistrer()
		},
		selectionnerDebut (event) {
			const stage = event.target.getStage()
			if (this.outilSelectionner) {
				if (this.outil !== '' && this.creation === true) {
					this.selectionnerFin()
					return false
				}
				this.positionX1 = stage.getPointerPosition().x
				this.positionY1 = stage.getPointerPosition().y
				this.positionX2 = stage.getPointerPosition().x
				this.positionY2 = stage.getPointerPosition().y
				this.largeurSelection = 0
				this.hauteurSelection = 0
				this.largeurObjet = 0
				this.hauteurObjet = 0
				if (this.outil === '') {
					if (event.target.getParent() && event.target.getParent().className === 'Transformer') {
						return false
					}
					if (event.target !== event.target.getStage()) {
						this.selectionnerObjet(event)
						return false
					}
					this.selection = true
					this.nom = ''
					this.objet = ''
					this.items.forEach(function (item, index) {
						if (item.objet === 'ancre') {
							this.items[index].visible = false
						}
					}.bind(this))
					this.transformer()
				} else {
					this.creation = true
					this.nom = ''
					this.objet = ''
					this.items.forEach(function (item, index) {
						if (item.objet === 'ancre') {
							this.items[index].visible = false
						}
					}.bind(this))
					if (this.outil === 'etoile') {
						this.dessinerForme('etoile')
						this.creation = false
						this.activerSelecteur()
					} else if (this.outil === 'texte' || this.outil === 'label') {
						this.modale = true
						this.creation = false
						setTimeout(function () {
							document.querySelector('#annotation-texte textarea').focus()
						}, 10)
					}
					this.transformer()
				}
			} else if (this.outilDessiner) {
				this.dessin = true
				this.positionStylo = stage.getPointerPosition()
				this.id++
				this.items.push({ name: 'dess' + this.id, objet: 'dessin', points: [this.positionStylo.x, this.positionStylo.y], globalCompositeOperation: 'source-over', stroke: this.couleurStylo, strokeWidth: this.epaisseurStylo, opacity: this.transparenceStylo, hitStrokeWidth: 25, lineJoin: 'round', draggable: false, verrouille: false })
				this.nom = 'dess' + this.id
				this.objet = 'dessin'
				this.$nextTick(function () {
					this.$refs.objets.getNode().getLayer().batchDraw()
				}.bind(this))
			}
		},
		selectionnerMouvement (event) {
			const stage = event.target.getStage()
			if (this.outilSelectionner) {
				if (this.outil === '') {
					if (!this.selection) {
						return false
					}
					this.positionX2 = stage.getPointerPosition().x
					this.positionY2 = stage.getPointerPosition().y
					this.positionSelectionX = Math.min(this.positionX1, this.positionX2)
					this.positionSelectionY = Math.min(this.positionY1, this.positionY2)
					this.largeurSelection = Math.abs(this.positionX2 - this.positionX1)
					this.hauteurSelection = Math.abs(this.positionY2 - this.positionY1)
				} else {
					if (!this.creation) {
						return false
					}
					this.positionX2 = stage.getPointerPosition().x
					this.positionY2 = stage.getPointerPosition().y
					this.positionObjetX = Math.min(this.positionX1, this.positionX2)
					this.positionObjetY = Math.min(this.positionY1, this.positionY2)
					this.largeurObjet = Math.abs(this.positionX2 - this.positionX1)
					this.hauteurObjet = Math.abs(this.positionY2 - this.positionY1)
				}
				this.transformer()
			} else if (this.outilDessiner) {
				if (!this.dessin) {
					return false
				}
				this.positionStylo = stage.getPointerPosition()
				const item = this.items.find(r => r.name === this.nom)
				const points = item.points.concat([this.positionStylo.x, this.positionStylo.y])
				item.points = points
				this.$refs.objets.getNode().getLayer().batchDraw()
			}
		},
		selectionnerFin () {
			if (this.outilSelectionner) {
				if (this.outil === '') {
					if (!this.selection) {
						return false
					}
					if (this.largeurSelection < 10 && this.hauteurSelection < 10) {
						this.selection = false
						return false
					}
					this.selection = false
					const transformer = this.$refs.transformer.getNode()
					const stage = transformer.getStage()
					const objets = stage.find((item) => {
						return item.getAttrs().objet && item.getAttrs().name.substring(0, 4) !== 'ancr'
					})
					const rect = stage.findOne('.selection').getClientRect()
					const selection = objets.filter(item => Konva.Util.haveIntersection(rect, item.getClientRect()))
					if (selection.length > 1) {
						this.nom = 'selection'
						this.objet = 'selection'
						const objetsVerrouilles = selection.filter(item => item.getAttrs().verrouille === true)
						if (objetsVerrouilles.length === selection.length) {
							this.objetVerrouille = true
						} else {
							this.objetVerrouille = false
						}
						transformer.nodes(selection)
						transformer.getLayer().batchDraw()
						this.desactiverSelecteur()
					} else if (selection.length === 1) {
						const nom = selection[0].getAttrs().name
						this.selectionner(nom)
						this.transformer()
					} else {
						this.nom = ''
						this.objet = ''
						this.objetVerrouille = false
						this.desactiverSelecteur()
					}
				} else if (this.outil !== '' && this.outil !== 'etoile' && this.outil !== 'texte' && this.outil !== 'label' && this.largeurObjet > 0 && this.hauteurObjet > 0) {
					if (!this.creation) {
						return false
					}
					this.dessinerForme(this.outil)
					this.activerSelecteur()
				}
			} else if (this.outilDessiner) {
				this.dessin = false
				this.enregistrer()
			}
		},
		dessinerForme (type) {
			this.ajouter(type)
			this.reinitialiserOutils()
			this.creation = false
		},
		reinitialiserOutils () {
			this.outil = ''
			this.largeurObjet = 0
			this.hauteurObjet = 0
			this.positionX1 = 0
			this.positionY1 = 0
			this.positionX2 = 0
			this.positionY2 = 0
		},
		reinitialiserSelection () {
			this.nom = ''
			this.objet = ''
			this.objetVerrouille = false
			this.items.forEach(function (item, index) {
				if (item.objet === 'ancre') {
					this.items[index].visible = false
				}
			}.bind(this))
			this.transformer()
		},
		selectionnerObjet (event) {
			if (this.outilSelectionner) {
				if (event.target === event.target.getStage()) {
					this.reinitialiserSelection()
					return false
				}
				if (this.objet === 'selection' && event.target.getAttrs().objet && event.target.getAttrs().name.substring(0, 4) !== 'ancr') {
					return false
				}
				if (event.target.getParent().className === 'Transformer') {
					this.reinitialiserSelection()
					return false
				}
				this.selectionner(event.target.name())
				this.transformer()
			}
		},
		selectionner (nom) {
			let ancre1, ancre2
			const type = nom.substring(0, 4)
			const item = this.items.find(r => r.name === nom)
			if (item) {
				this.nom = nom
				this.objet = item.objet
				if (!item.draggable) {
					this.objetVerrouille = true
				} else {
					this.objetVerrouille = false
				}
				if (!this.outilDessiner) {
					this.definirCouleurSelecteur(this.objet, item)
				}
				this.activerSelecteur()
			} else {
				this.nom = ''
				this.objet = ''
				this.objetVerrouille = false
				this.desactiverSelecteur()
			}
			if (type === 'flec' || type === 'line') {
				this.items.forEach(function (item, index) {
					if (item.objet === 'ancre') {
						this.items[index].visible = false
					}
				}.bind(this))
				ancre1 = this.items.find(r => r.name === 'ancr_' + nom + '_1')
				ancre2 = this.items.find(r => r.name === 'ancr_' + nom + '_2')
				if (!item.verrouille) {
					ancre1.visible = true
					ancre2.visible = true
				} else {
					ancre1.visible = false
					ancre2.visible = false
				}
			} else if (type !== 'ancr') {
				this.items.forEach(function (item, index) {
					if (item.objet === 'ancre') {
						this.items[index].visible = false
					}
				}.bind(this))
			}
		},
		transformer () {
			const transformer = this.$refs.transformer.getNode()
			const stage = transformer.getStage()
			const noeud = stage.findOne('.' + this.nom)
			if (noeud && this.nom.substring(0, 4) !== 'ancr') {
				transformer.nodes([noeud])
			} else {
				transformer.nodes([])
			}
			transformer.getLayer().batchDraw()
		},
		ajouterTexte () {
			this.ajouter(this.outil)
			this.reinitialiserOutils()
			this.fermerModale()
			this.selection = false
			this.activerSelecteur()
		},
		modifierTexte (event) {
			this.texte = event.target.text()
			this.modale = true
			setTimeout(function () {
				document.querySelector('#annotation-texte textarea').focus()
			}, 10)
		},
		enregistrerTexte () {
			const type = this.nom.substring(0, 4)
			const item = this.items.find(r => r.name === this.nom)
			const texte = this.texte
			if (type === 'text') {
				item.text = texte
			} else {
				item.text.text = texte
				this.$nextTick(function () {
					this.transformer()
				}.bind(this))
			}
			this.fermerModale()
			this.enregistrer()
		},
		fermerModale () {
			this.texte = ''
			this.modale = false
		},
		reduireTailleTexte () {
			const item = this.items.find(r => r.name === this.nom)
			let taille = item.fontSize
			taille = taille - 2
			item.fontSize = taille
			this.enregistrer()
		},
		augmenterTailleTexte () {
			const item = this.items.find(r => r.name === this.nom)
			let taille = item.fontSize
			taille = taille + 2
			item.fontSize = taille
			this.enregistrer()
		},
		definirCouleurSelecteur (objet, item) {
			switch (objet) {
			case 'rectangle':
			case 'cercle':
			case 'ligne':
			case 'fleche':
			case 'dessin':
				if (['#000000', '#ffffff', '#ff0000', '#ffff00', '#00ff00', '#04fdff', '#cccccc'].includes(item.stroke) === false) {
					this.couleurSelecteur = item.stroke
				}
				break
			case 'rectangle-plein':
			case 'cercle-plein':
			case 'etoile':
			case 'surlignage':
			case 'texte':
				if (['#000000', '#ffffff', '#ff0000', '#ffff00', '#00ff00', '#04fdff', '#cccccc'].includes(item.fill) === false) {
					this.couleurSelecteur = item.fill
				}
				break
			case 'label':
				if (['#000000', '#ffffff', '#ff0000', '#ffff00', '#00ff00', '#04fdff', '#cccccc'].includes(item.tag.fill) === false) {
					this.couleurSelecteur = item.tag.fill
				}
				break
			}
		},
		definirCouleur () {
			const couleur = document.querySelector('#couleur-annotation').value
			if (this.outilDessiner && this.couleurSelecteur !== '#000000') {
				this.couleurStylo = couleur
			} else if (!this.outilDessiner && this.couleurSelecteur !== '#000000') {
				this.modifierCouleur(couleur)
			}
		},
		modifierCouleurSelecteur (event) {
			this.couleurSelecteur = event.target.value
			this.modifierCouleur(event.target.value)
		},
		modifierCouleur (couleur) {
			if (this.outilSelectionner) {
				let item = this.items.find(r => r.name === this.nom)
				if (this.objet === 'ancre') {
					item = this.items.find(r => r.name === this.nom.split('_')[1])
				}
				switch (this.objet) {
				case 'rectangle':
				case 'cercle':
				case 'dessin':
					item.stroke = couleur
					break
				case 'rectangle-plein':
				case 'cercle-plein':
				case 'etoile':
				case 'surlignage':
				case 'texte':
					item.fill = couleur
					break
				case 'ligne':
				case 'fleche':
				case 'ancre':
					item.stroke = couleur
					item.fill = couleur
					break
				case 'label':
					item.tag.fill = couleur
					break
				}
			} else if (this.outilDessiner) {
				this.couleurStylo = couleur
			}
			this.enregistrer()
		},
		modifierEpaisseur (epaisseur) {
			this.epaisseurStylo = epaisseur
		},
		modifierTransparence (transparence) {
			this.transparenceStylo = transparence
		},
		definirAncres () {
			let ancres = []
			if (this.objetVerrouille === false) {
				const type = this.nom.substring(0, 4)
				switch (type) {
				case 'rect':
				case 'circ':
					ancres = ['top-left', 'top-center', 'top-right', 'middle-right', 'middle-left', 'bottom-left', 'bottom-center', 'bottom-right']
					break
				case 'labl':
				case 'imag':
				case 'star':
					ancres = ['top-left', 'top-right', 'bottom-left', 'bottom-right']
					break
				case 'text':
					ancres = ['middle-right', 'middle-left']
					break
				}
			}
			return ancres
		},
		definirCouleurBordure () {
			if (this.objet === 'selection' && !this.objetVerrouille) {
				return '#01ced1'
			} else {
				return '#ddd'
			}
		},
		definirLimites (ancien, nouveau) {
			const type = this.nom.substring(0, 4)
			if (type === 'text') {
				if (nouveau.width < 70) {
					return ancien
				}
				return nouveau
			} else {
				return nouveau
			}
		},
		deplacerForme (event) {
			let item, ancre1, ancre2
			if (this.objet !== 'selection') {
				item = this.items.find(r => r.name === this.nom)
				if (item) {
					item.points = event.target.points()
					item.x = event.target.x()
					item.y = event.target.y()
					item.scaleX = event.target.scaleX()
					item.scaleY = event.target.scaleY()
					ancre1 = this.items.find(r => r.name === 'ancr_' + this.nom + '_1')
					ancre2 = this.items.find(r => r.name === 'ancr_' + this.nom + '_2')
					ancre1.x = event.target.points()[0] + event.target.x()
					ancre1.y = event.target.points()[1] + event.target.y()
					ancre1.scaleX = event.target.scaleX()
					ancre1.scaleY = event.target.scaleY()
					ancre2.x = event.target.points()[2] + event.target.x()
					ancre2.y = event.target.points()[3] + event.target.y()
					ancre2.scaleX = event.target.scaleX()
					ancre2.scaleY = event.target.scaleY()
				}
			} else {
				const objets = this.$refs.transformer.getNode().nodes()
				for (let i = 0; i < objets.length; i++) {
					if (objets[i].getAttrs().name.substring(0, 4) === 'flec' || objets[i].getAttrs().name.substring(0, 4) === 'line') {
						item = this.items.find(r => r.name === objets[i].getAttrs().name)
					}
					if (item) {
						item.points = objets[i].getAttrs().points
						item.x = objets[i].getAttrs().x
						item.y = objets[i].getAttrs().y
						item.scaleX = objets[i].getAttrs().scaleX
						item.scaleY = objets[i].getAttrs().scaleY
						ancre1 = this.items.find(r => r.name === 'ancr_' + objets[i].getAttrs().name + '_1')
						ancre2 = this.items.find(r => r.name === 'ancr_' + objets[i].getAttrs().name + '_2')
						ancre1.x = objets[i].getAttrs().points[0] + objets[i].getAttrs().x
						ancre1.y = objets[i].getAttrs().points[1] + objets[i].getAttrs().y
						ancre1.scaleX = objets[i].getAttrs().scaleX
						ancre1.scaleY = objets[i].getAttrs().scaleY
						ancre2.x = objets[i].getAttrs().points[2] + objets[i].getAttrs().x
						ancre2.y = objets[i].getAttrs().points[3] + objets[i].getAttrs().y
						ancre2.scaleX = objets[i].getAttrs().scaleX
						ancre2.scaleY = objets[i].getAttrs().scaleY
					}
					item = null
				}
			}
		},
		deplacerAncre (event) {
			let nom, index, item, ancre, points, ancreActive
			if (this.objet !== 'selection') {
				nom = this.nom.split('_')
				index = parseInt(nom[2])
				item = this.items.find(r => r.name === nom[1])
				if (item) {
					if (index === 1) {
						ancre = this.items.find(r => r.name === 'ancr_' + nom[1] + '_2')
						points = [
							event.target.x() - item.x,
							event.target.y() - item.y,
							ancre.x - item.x,
							ancre.y - item.y
						]
					} else {
						ancre = this.items.find(r => r.name === 'ancr_' + nom[1] + '_1')
						points = [
							ancre.x - item.x,
							ancre.y - item.y,
							event.target.x() - item.x,
							event.target.y() - item.y
						]
					}
					item.points = points
					ancreActive = this.items.find(r => r.name === 'ancr_' + nom[1] + '_' + index)
					ancreActive.x = event.target.x()
					ancreActive.y = event.target.y()
					ancreActive.scaleX = event.target.scaleX()
					ancreActive.scaleY = event.target.scaleY()
				}
			} else {
				const objets = this.$refs.transformer.getNode().nodes()
				for (let i = 0; i < objets.length; i++) {
					nom = objets[i].getAttrs().name.split('_')
					index = parseInt(nom[2])
					if (nom[1].substring(0, 4) === 'flec' || nom[1].substring(0, 4) === 'line') {
						item = this.items.find(r => r.name === nom[1])
					}
					if (item) {
						if (index === 1) {
							ancre = this.items.find(r => r.name === 'ancr_' + nom[1] + '_2')
							points = [
								objets[i].getAttrs().x - item.x,
								objets[i].getAttrs().y - item.y,
								ancre.x - item.x,
								ancre.y - item.y
							]
						} else {
							ancre = this.items.find(r => r.name === 'ancr_' + nom[1] + '_1')
							points = [
								ancre.x - item.x,
								ancre.y - item.y,
								objets[i].getAttrs().x - item.x,
								objets[i].getAttrs().y - item.y
							]
						}
						item.points = points
						ancreActive = this.items.find(r => r.name === 'ancr_' + nom[1] + '_' + index)
						ancreActive.x = objets[i].getAttrs().x
						ancreActive.y = objets[i].getAttrs().y
						ancreActive.scaleX = objets[i].getAttrs().scaleX
						ancreActive.scaleY = objets[i].getAttrs().scaleY
					}
				}
			}
		},
		enregistrer () {
			this.$parent.pages[this.$parent.page - 1].annotations = { id: this.id, items: this.items }
			const donnees = JSON.parse(JSON.stringify(this.items))
			if (!this.historique.includes(donnees) && this.positionActuelleHistorique === 0) {
				this.historique.push(donnees)
				this.positionHistorique += 1
			} else if (!this.historique.includes(donnees) && this.positionActuelleHistorique !== 0) {
				const historique = []
				for (let i = 0; i < this.positionActuelleHistorique; i++) {
					historique.push(this.historique[i])
				}
				historique.push(donnees)
				this.historique = historique
				this.positionHistorique = this.positionActuelleHistorique + 1
				this.positionActuelleHistorique = 0
			}
		},
		defaire () {
			if (this.positionHistorique === 0) {
				return false
			}
			this.positionHistorique -= 1
			this.positionActuelleHistorique = this.positionHistorique
			if (this.historique[this.positionHistorique - 1]) {
				const donnees = JSON.parse(JSON.stringify(this.historique[this.positionHistorique - 1]))
				this.items = donnees
				this.$parent.pages[this.$parent.page - 1].annotations = { id: this.id, items: donnees }
			}
			this.$nextTick(function () {
				this.reinitialiserSelection()
			}.bind(this))
		},
		refaire () {
			if (this.positionHistorique === this.historique.length) {
				return false
			}
			if (this.historique[this.positionHistorique]) {
				const donnees = JSON.parse(JSON.stringify(this.historique[this.positionHistorique]))
				this.items = donnees
				this.$parent.pages[this.$parent.page - 1].annotations = { id: this.id, items: donnees }
				this.positionHistorique += 1
			}
			this.$nextTick(function () {
				this.reinitialiserSelection()
			}.bind(this))
		},
		convertirRem (valeur) {
			const taille = window.getComputedStyle(document.querySelector('html'), null).getPropertyValue('font-size')
			return 'undefined' != typeof valeur && valeur > 0 ? parseFloat(taille) * valeur : parseFloat(taille)
		},
		activerDeplacement () {
			this.items.forEach(function (item) {
				item.verrouille ? item.draggable = false : item.draggable = true
			})
		},
		desactiverDeplacement () {
			this.items.forEach(function (item) {
				item.draggable = false
			})
		},
		activerSelecteur () {
			this.$nextTick(function () {
				if (document.querySelector('#couleur-annotation')) {
					document.querySelector('#couleur-annotation').addEventListener('change', this.modifierCouleurSelecteur)
				}
			}.bind(this))
		},
		desactiverSelecteur () {
			this.$nextTick(function () {
				if (document.querySelector('#couleur-annotation')) {
					document.querySelector('#couleur-annotation').removeEventListener('change', this.modifierCouleurSelecteur)
				}
			}.bind(this))
		}
	}
}
</script>

<style>
#annotation  {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: transparent;
	z-index: 10000;
}

#annotation.curseur {
	pointer-events: none;
	z-index: 99;
}

#annotation.avec-nav {
	bottom: 7.5rem;
}

#outils-annotation {
	position: absolute;
	top: 2rem;
	left: 0;
	display: grid;
    grid-template-rows: repeat(20, auto);
    background: #fff;
    padding: 3px 5px;
    margin: 0;
    border-top-right-radius: 10px;
	border-bottom-right-radius: 10px;
	z-index: 10001;
	max-height: calc(100% - 7.5rem);
	overflow-y: auto;
	overflow-x: hidden;
	user-select: none;
}

#outils-annotation .outil {
	display: flex;
    align-items: center;
    justify-content: center;
	width: 20px;
    height: 20px;
	margin: 5px 0;
	border-radius: 4px;
    cursor: pointer;
}

#outils-annotation .outil.actif {
    background: #01ced1;
}

#outils-annotation .outil.historique:active {
    opacity: 0.7;
}

#options .option img,
#outils-annotation .outil img {
	width: auto;
	height: auto;
	max-width: 16px;
	max-height: 16px;
}

#outils-annotation .separateur {
    margin: 5px 5px;
    border: 1px solid #ddd;
}

#options {
	position: absolute;
	left: 40px;
	top: 0;
	display: flex;
    justify-content: flex-start;
	align-items: center;
    background: #fff;
    padding: 5px;
    margin: 0;
    border-bottom-left-radius: 10px;
	border-bottom-right-radius: 10px;
	z-index: 10001;
	max-width: calc(100% - 100px);
	overflow-x: auto;
	overflow-y: hidden;
	user-select: none;
}

#options .option {
	display: flex;
    align-items: center;
    justify-content: center;
	width: 20px;
    height: 20px;
	margin: 0 5px;
	border-radius: 4px;
    cursor: pointer;
}

#options .option.label-transparence,
#options .option.label-taille,
#options .option.label-epaisseur {
	font-size: 24px;
	width: auto;
	cursor: default;
}

#options .option.transparence,
#options .option.epaisseur {
	line-height: 1;
}

#options .option.transparence,
#options .option.epaisseur {
	border: 1px solid #ddd;
	font-size: 12px;
}

#options .option.transparence.actif,
#options .option.epaisseur.actif {
	border: 1px solid #000;
}

#options .option.icone span:active {
	opacity: 0.5;
}

#options .option.transparence {
	width: 22px;
}

#options .option .couleur {
	display: block;
	width: 20px;
	height: 20px;
	border-radius: 50%;
}

#options .option.noir.actif,
#options .option .couleur.noir {
	background: black;
}

#options .option.blanc.actif,
#options .option .couleur.blanc {
	background: white;
	border: 1px solid #ddd;
}

#options .option.blanc.actif .couleur.blanc {
	border: 1px solid transparent;
	width: 18px;
	height: 18px;
}

#options .option.rouge.actif,
#options .option .couleur.rouge {
	background: #ff0000;
}

#options .option.jaune.actif,
#options .option .couleur.jaune {
	background: #ffff00;
}

#options .option.vert.actif,
#options .option .couleur.vert {
	background: #00ff00;
}

#options .option.bleu.actif,
#options .option .couleur.bleu {
	background: #04fdff;
}

#options .separateur {
    margin: 5px 5px;
    border: 1px solid #ddd;
	height: 10px;
}

#annotation-texte .modale .conteneur textarea {
    background: #fff;
    border: 1px solid #ddd;
    max-width: 100%;
    width: 100%;
    resize: none;
    padding: 1.5rem;
	text-align: left;
	line-height: 1.4;
	font-size: 1.6rem;
	height: 12rem;
}

#options .option.icone {
	width: auto;
}

#options .option.icone.orange span {
	color: #ff6600;
}

#options .option.icone.rouge span {
	color: #ff6259;
}

#options .option.icone span,
#options .option.icone label {
	font-size: 24px;
}

#options .option.icone input[type="color"] {
	width: 20px;
	height: 20px;
	border: none;
	margin-left: 5px;
	cursor: pointer;
}

#options .option.icone input[type="color"]::-moz-color-swatch {
	border: 1px solid #ddd;
	border-radius: 50%;
}

#options .option.icone input[type="color"]::-webkit-color-swatch {
	border: 1px solid #ddd;
	border-radius: 50%;
}

#options .option.icone input[type="color"]::-webkit-color-swatch-wrapper {
	padding: 0;
}
</style>
