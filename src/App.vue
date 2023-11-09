<template>
	<main :style="definirFond()">
		<div id="alerte" v-if="alerte">
			<div class="conteneur">
				<span class="marque">Digiscreen by La Digitale</span>
				<span class="message">{{ $t('alerte') }}</span>
			</div>
		</div>

		<div id="chargement" v-if="chargement">Digiscreen by La Digitale</div>

		<div id="import" :class="{'termine': importTermine}" v-if="importDonnees">
			<div class="chargement"><div /><div /><div /><div /><div /><div /><div /><div /><div /></div>
		</div>

		<Chargement :chargementPage="chargementPage" v-if="chargementPage" />

		<Annotation :panneaux="panneaux" :annotations="annotations" :largeur="largeur" :hauteur="hauteur" :nav="nav" @fermer="arreterAnnoter" @outilDeplacer="definirOutilDeplacer" v-if="annotation" />

		<div id="grille" :class="grille.couleur + ' grille-' + grille.colonnes" v-if="Object.keys(grille).length > 0">
			<span v-for="element in (grille.colonnes * grille.lignes)" :key="'element_' + element" />
		</div>

		<nav v-if="!alerte" :class="{'masque': !nav}" :data-html2canvas-ignore="true">
			<div @click="creerPanneau('codeqr')" v-if="modules.includes('codeqr')" :title="$t('codeqr')">
				<span class="icone"><i class="material-icons">qr_code</i></span>
				<span class="titre">{{ $t('codeqr') }}</span>
			</div>
			<div @click="creerPanneau('texte')" v-if="modules.includes('texte')" :title="$t('texte')">
				<span class="icone"><i class="material-icons">title</i></span>
				<span class="titre">{{ $t('texte') }}</span>
			</div>
			<div @click="creerPanneau('tableau')" v-if="modules.includes('tableau')" :title="$t('tableau')">
				<span class="icone"><i class="material-icons">table_chart</i></span>
				<span class="titre">{{ $t('tableau') }}</span>
			</div>
			<div @click="creerPanneau('image')" v-if="modules.includes('image')" :title="$t('image')">
				<span class="icone"><i class="material-icons">insert_photo</i></span>
				<span class="titre">{{ $t('image') }}</span>
			</div>
			<div @click="creerPanneau('galerie')" v-if="modules.includes('galerie')" :title="$t('galerieImages')">
				<span class="icone"><i class="material-icons">view_carousel</i></span>
				<span class="titre">{{ $t('galerie') }}</span>
			</div>
			<div @click="creerPanneau('dessin')" v-if="modules.includes('dessin')" :title="$t('dessin')">
				<span class="icone"><i class="material-icons">gesture</i></span>
				<span class="titre">{{ $t('dessin') }}</span>
			</div>
			<div @click="creerPanneau('document')" v-if="modules.includes('document')" :title="$t('document')">
				<span class="icone"><i class="material-icons">description</i></span>
				<span class="titre">{{ $t('doc') }}</span>
			</div>
			<div @click="creerPanneau('audio')" v-if="modules.includes('audio')" :title="$t('audio')">
				<span class="icone"><i class="material-icons">volume_up</i></span>
				<span class="titre">{{ $t('audio') }}</span>
			</div>
			<div @click="creerPanneau('synthese')" v-if="modules.includes('synthese')" :title="$t('syntheseVocale')">
				<span class="icone"><i class="material-icons">record_voice_over</i></span>
				<span class="titre">{{ $t('synthese') }}</span>
			</div>
			<div @click="creerPanneau('video')" v-if="modules.includes('video')" :title="$t('video')">
				<span class="icone"><i class="material-icons">movie_creation</i></span>
				<span class="titre">{{ $t('video') }}</span>
			</div>
			<div @click="creerPanneau('webcam')" v-if="modules.includes('webcam')" :title="$t('webcam')">
				<span class="icone"><i class="material-icons">photo_camera</i></span>
				<span class="titre">{{ $t('webcam') }}</span>
			</div>
			<div @click="creerPanneau('lien')" v-if="modules.includes('lien')" :title="$t('lien')">
				<span class="icone"><i class="material-icons">link</i></span>
				<span class="titre">{{ $t('lien') }}</span>
			</div>
			<div @click="creerPanneau('iframe')" v-if="modules.includes('iframe')" :title="$t('contenuIntegre')">
				<span class="icone"><i class="material-icons">code</i></span>
				<span class="titre">{{ $t('iframe') }}</span>
			</div>
			<div @click="creerPanneau('nuage')" v-if="modules.includes('nuage')" :title="$t('nuageMots')">
				<span class="icone"><i class="material-icons">cloud</i></span>
				<span class="titre">{{ $t('nuage') }}</span>
			</div>
			<div @click="creerPanneau('ordre')" v-if="modules.includes('ordre')" :title="$t('remiseOrdre')">
				<span class="icone"><i class="material-icons">sort_by_alpha</i></span>
				<span class="titre">{{ $t('ordre') }}</span>
			</div>
			<div @click="creerPanneau('images-sequentielles')" v-if="modules.includes('images-sequentielles')" :title="$t('imagesSequentielles')">
				<span class="icone"><i class="material-icons">category</i></span>
				<span class="titre">{{ $t('ordreImage') }}</span>
			</div>
			<div @click="creerPanneau('trous')" v-if="modules.includes('trous')" :title="$t('texteATrous')">
				<span class="icone"><i class="material-icons">wysiwyg</i></span>
				<span class="titre">{{ $t('trous') }}</span>
			</div>
			<div @click="creerPanneau('surlignage')" v-if="modules.includes('surlignage')" :title="$t('surlignage')">
				<span class="icone"><i class="material-icons">hdr_strong</i></span>
				<span class="titre">{{ $t('surlignage') }}</span>
			</div>
			<div @click="creerPanneau('pendu')" v-if="modules.includes('pendu')" :title="$t('pendu')">
				<span class="icone"><i class="material-icons">spellcheck</i></span>
				<span class="titre">{{ $t('pendu') }}</span>
			</div>
			<div @click="creerPanneau('cartes')" v-if="modules.includes('cartes')" :title="$t('cartes')">
				<span class="icone"><i class="material-icons">style</i></span>
				<span class="titre">{{ $t('cartes') }}</span>
			</div>
			<div @click="creerPanneau('tirage-texte')" v-if="modules.includes('tirage-texte')" :title="$t('tirageSortTexte')">
				<span class="icone"><i class="material-icons">shuffle</i></span>
				<span class="titre">{{ $t('tirageTexte') }}</span>
			</div>
			<div @click="creerPanneau('tirage-image')" v-if="modules.includes('tirage-image')" :title="$t('tirageSortImage')">
				<span class="icone"><i class="material-icons">collections</i></span>
				<span class="titre">{{ $t('tirageImage') }}</span>
			</div>
			<div @click="creerPanneau('tirage-audio')" v-if="modules.includes('tirage-audio')" :title="$t('tirageSortAudio')">
				<span class="icone"><i class="material-icons">subscriptions</i></span>
				<span class="titre">{{ $t('tirageAudio') }}</span>
			</div>
			<div @click="creerPanneau('histoire')" v-if="modules.includes('histoire')" :title="$t('histoire')">
				<span class="icone"><i class="material-icons">history_edu</i></span>
				<span class="titre">{{ $t('histoire') }}</span>
			</div>
			<div @click="creerPanneau('plateau')" v-if="modules.includes('plateau')" :title="$t('plateau')">
				<span class="icone"><i class="material-icons">grid_on</i></span>
				<span class="titre">{{ $t('plateau') }}</span>
			</div>
			<div @click="creerPanneau('des')" v-if="modules.includes('des')" :title="$t('des')">
				<span class="icone"><i class="material-icons">casino</i></span>
				<span class="titre">{{ $t('des') }}</span>
			</div>
			<div @click="creerPanneau('modalites')" v-if="modules.includes('modalites')" :class="{'actif': modalites}" :title="$t('modalitesTravail')">
				<span class="icone"><i class="material-icons">group_work</i></span>
				<span class="titre">{{ $t('modalites') }}</span>
			</div>
			<div @click="creerPanneau('groupes')" v-if="modules.includes('groupes')" :title="$t('groupes')">
				<span class="icone"><i class="material-icons">group</i></span>
				<span class="titre">{{ $t('groupes') }}</span>
			</div>
			<div @click="creerPanneau('chrono')" v-if="modules.includes('chrono')" :title="$t('chronometre')">
				<span class="icone"><i class="material-icons">timer</i></span>
				<span class="titre">{{ $t('chrono') }}</span>
			</div>
			<div @click="creerPanneau('rebours')" v-if="modules.includes('rebours')" :title="$t('compteRebours')">
				<span class="icone"><i class="material-icons">hourglass_empty</i></span>
				<span class="titre">{{ $t('rebours') }}</span>
			</div>
			<div @click="creerPanneau('horloge')" v-if="modules.includes('horloge')" :title="$t('horloge')">
				<span class="icone"><i class="material-icons">query_builder</i></span>
				<span class="titre">{{ $t('horloge') }}</span>
			</div>
			<div @click="creerPanneau('calendrier')" v-if="modules.includes('calendrier')" :title="$t('calendrier')">
				<span class="icone"><i class="material-icons">today</i></span>
				<span class="titre">{{ $t('calendrier') }}</span>
			</div>
			<div @click="creerPanneau('sonometre')" v-if="modules.includes('sonometre')" :title="$t('sonometre')">
				<span class="icone"><i class="material-icons">hearing</i></span>
				<span class="titre">{{ $t('volume') }}</span>
			</div>
			<div @click="creerPanneau('retroaction')" v-if="modules.includes('retroaction')" :class="{'actif': retroaction}" :title="$t('retroaction')">
				<span class="icone"><i class="material-icons">thumb_up</i></span>
				<span class="titre">{{ $t('retroaction') }}</span>
			</div>
			<div @click="ouvrirModale('grille')" v-if="modules.includes('grille') && Object.keys(grille).length === 0" :title="$t('grille')">
				<span class="icone"><i class="material-icons">view_module</i></span>
				<span class="titre">{{ $t('grille') }}</span>
			</div>
			<div @click="reinitialiserGrille" class="actif" v-else-if="modules.includes('grille') && Object.keys(grille).length > 0" :title="$t('grille')">
				<span class="icone"><i class="material-icons">view_module</i></span>
				<span class="titre">{{ $t('grille') }}</span>
			</div>
			<div class="separateur">
				<span>·</span>
			</div>
			<div @click="capturer" :title="$t('capturer')">
				<span class="icone"><i class="material-icons">camera</i></span>
				<span class="titre">{{ $t('capture') }}</span>
			</div>
			<div @click="annoter" v-if="!annotation" :title="$t('annoter')">
				<span class="icone"><i class="material-icons">rate_review</i></span>
				<span class="titre">{{ $t('annoter') }}</span>
			</div>
			<div @click="arreterAnnoter" class="actif" v-else :title="$t('annoter')">
				<span class="icone"><i class="material-icons">rate_review</i></span>
				<span class="titre">{{ $t('annoter') }}</span>
			</div>
			<div @click="entrerPleinEcran" v-if="!pleinEcran" :title="$t('mettrePleinEcran')">
				<span class="icone"><i class="material-icons">open_in_full</i></span>
				<span class="titre">{{ $t('ecran') }}</span>
			</div>
			<div @click="sortirPleinEcran" v-else :title="$t('sortirPleinEcran')">
				<span class="icone"><i class="material-icons">close_fullscreen</i></span>
				<span class="titre">{{ $t('ecran') }}</span>
			</div>
			<div @click="ouvrirMenu" :title="$t('options')">
				<span class="icone"><i class="material-icons">settings</i></span>
				<span class="titre">{{ $t('options') }}</span>
			</div>
			<div @click="ouvrirModale('info')" :title="$t('aPropos')">
				<span class="icone"><i class="material-icons">info</i></span>
				<span class="titre">{{ $t('aPropos') }}</span>
			</div>
		</nav>

		<span class="bouton-capture" v-if="lectureSeule" @click="capturer" :title="$t('capturer')" :data-html2canvas-ignore="true"><i class="material-icons">camera</i></span>

		<span class="bouton-annotation" v-if="!annotation && lectureSeule" @click="annoter" :title="$t('annoter')" :data-html2canvas-ignore="true"><i class="material-icons">rate_review</i></span>
		<span class="bouton-annotation vert" v-else-if="annotation && lectureSeule" @click="arreterAnnoter" :title="$t('annoter')" :data-html2canvas-ignore="true"><i class="material-icons">rate_review</i></span>

		<span class="bouton-plein-ecran" v-if="!pleinEcran && lectureSeule" @click="entrerPleinEcran" :title="$t('mettrePleinEcran')" :data-html2canvas-ignore="true"><i class="material-icons">open_in_full</i></span>
		<span class="bouton-plein-ecran" v-else-if="pleinEcran && lectureSeule" @click="sortirPleinEcran" :title="$t('sortirPleinEcran')" :data-html2canvas-ignore="true"><i class="material-icons">close_fullscreen</i></span>

		<span class="bouton-export" v-if="lectureSeule" @click="exporter" :title="$t('exporterEcran')" :data-html2canvas-ignore="true"><i class="material-icons">save</i></span>

		<span class="nav" v-if="nav && !lectureSeule" @click="nav = false" :title="$t('masquerOutils')" :data-html2canvas-ignore="true"><i class="material-icons">expand_more</i></span>
		<span class="nav" v-else-if="!nav && !lectureSeule" @click="nav = true" :title="$t('afficherOutils')" :data-html2canvas-ignore="true"><i class="material-icons">expand_less</i></span>

		<span class="bouton-cadenas orange" v-if="lectureSeule" @click="lectureSeule = false" :title="$t('deverrouiller')" :data-html2canvas-ignore="true"><i class="material-icons">lock</i></span>
		<span class="bouton-cadenas" v-else @click="lectureSeule = true" :title="$t('verrouiller')" :data-html2canvas-ignore="true"><i class="material-icons">lock_open</i></span>

		<template v-for="panneau in panneauxPage">
			<PCodeqr :panneau="panneau" :pages="pages" :nav="nav" :export="exportDonnees" :evenementClavier="evenementClavier" @afficher="afficherPanneau" @fermer="fermerPanneau" @export="modifierPanneau" v-if="panneau.type === 'codeqr'" :key="'codeqr_' + panneau.id" />
			<PTexte :panneau="panneau" :pages="pages" :nav="nav" :export="exportDonnees" :evenementClavier="evenementClavier" @afficher="afficherPanneau" @fermer="fermerPanneau" @export="modifierPanneau" v-else-if="panneau.type === 'texte'" :key="'texte_' + panneau.id" />
			<PTableau :panneau="panneau" :pages="pages" :nav="nav" :export="exportDonnees" :evenementClavier="evenementClavier" @afficher="afficherPanneau" @fermer="fermerPanneau" @export="modifierPanneau" v-else-if="panneau.type === 'tableau'" :key="'tableau_' + panneau.id" />
			<PImage :panneau="panneau" :pages="pages" :nav="nav" :export="exportDonnees" :evenementClavier="evenementClavier" @afficher="afficherPanneau" @fermer="fermerPanneau" @export="modifierPanneau" v-else-if="panneau.type === 'image'" :key="'image_' + panneau.id" />
			<PGalerie :panneau="panneau" :pages="pages" :nav="nav" :export="exportDonnees" :evenementClavier="evenementClavier" @afficher="afficherPanneau" @fermer="fermerPanneau" @export="modifierPanneau" v-else-if="panneau.type === 'galerie'" :key="'galerie_' + panneau.id" />
			<PDessin :panneau="panneau" :pages="pages" :nav="nav" :largeurPage="largeur" :hauteurPage="hauteur" :export="exportDonnees" :evenementClavier="evenementClavier" @afficher="afficherPanneau" @fermer="fermerPanneau" @export="modifierPanneau" v-else-if="panneau.type === 'dessin'" :key="'dessin_' + panneau.id" />
			<PDocument :panneau="panneau" :pages="pages" :nav="nav" :export="exportDonnees" :evenementClavier="evenementClavier" @afficher="afficherPanneau" @fermer="fermerPanneau" @export="modifierPanneau" v-else-if="panneau.type === 'document'" :key="'document_' + panneau.id" />
			<PAudio :panneau="panneau" :pages="pages" :nav="nav" :export="exportDonnees" :evenementClavier="evenementClavier" @afficher="afficherPanneau" @fermer="fermerPanneau" @export="modifierPanneau" v-else-if="panneau.type === 'audio'" :key="'audio_' + panneau.id" />
			<PSynthese :panneau="panneau" :pages="pages" :nav="nav" :export="exportDonnees" :evenementClavier="evenementClavier" @afficher="afficherPanneau" :listeVoix="listeVoix" @fermer="fermerPanneau" @export="modifierPanneau" v-else-if="panneau.type === 'synthese'" :key="'synthese_' + panneau.id" />
			<PVideo :panneau="panneau" :pages="pages" :nav="nav" :export="exportDonnees" :evenementClavier="evenementClavier" @afficher="afficherPanneau" @fermer="fermerPanneau" @export="modifierPanneau" v-else-if="panneau.type === 'video'" :key="'video_' + panneau.id" />
			<PWebcam :panneau="panneau" :pages="pages" :nav="nav" :export="exportDonnees" :evenementClavier="evenementClavier" @afficher="afficherPanneau" @fermer="fermerPanneau" @export="modifierPanneau" v-else-if="panneau.type === 'webcam'" :key="'webcam_' + panneau.id" />
			<PLien :panneau="panneau" :pages="pages" :nav="nav" :export="exportDonnees" :evenementClavier="evenementClavier" @afficher="afficherPanneau" @fermer="fermerPanneau" @export="modifierPanneau" v-else-if="panneau.type === 'lien'" :key="'lien_' + panneau.id" />
			<PIframe :panneau="panneau" :pages="pages" :nav="nav" :export="exportDonnees" :evenementClavier="evenementClavier" @afficher="afficherPanneau" @fermer="fermerPanneau" @export="modifierPanneau" v-else-if="panneau.type === 'iframe'" :key="'iframe_' + panneau.id" />
			<PNuage :panneau="panneau" :pages="pages" :nav="nav" :export="exportDonnees" :evenementClavier="evenementClavier" @afficher="afficherPanneau" @fermer="fermerPanneau" @export="modifierPanneau" v-else-if="panneau.type === 'nuage'" :key="'nuage_' + panneau.id" />
			<POrdre :panneau="panneau" :pages="pages" :nav="nav" :export="exportDonnees" :evenementClavier="evenementClavier" @afficher="afficherPanneau" @fermer="fermerPanneau" @export="modifierPanneau" v-else-if="panneau.type === 'ordre'" :key="'ordre_' + panneau.id" />
			<PImagesSequentielles :panneau="panneau" :pages="pages" :nav="nav" :export="exportDonnees" :evenementClavier="evenementClavier" @afficher="afficherPanneau" @fermer="fermerPanneau" @export="modifierPanneau" v-else-if="panneau.type === 'images-sequentielles'" :key="'images-sequentielles_' + panneau.id" />
			<PTrous :panneau="panneau" :pages="pages" :nav="nav" :export="exportDonnees" :evenementClavier="evenementClavier" @afficher="afficherPanneau" @fermer="fermerPanneau" @export="modifierPanneau" v-else-if="panneau.type === 'trous'" :key="'trous_' + panneau.id" />
			<PSurlignage :panneau="panneau" :pages="pages" :nav="nav" :export="exportDonnees" :evenementClavier="evenementClavier" @afficher="afficherPanneau" @fermer="fermerPanneau" @export="modifierPanneau" v-else-if="panneau.type === 'surlignage'" :key="'surlignage_' + panneau.id" />
			<PPendu :panneau="panneau" :pages="pages" :nav="nav" :export="exportDonnees" :evenementClavier="evenementClavier" @afficher="afficherPanneau" @fermer="fermerPanneau" @export="modifierPanneau" v-else-if="panneau.type === 'pendu'" :key="'pendu_' + panneau.id" />
			<PCartes :panneau="panneau" :pages="pages" :nav="nav" :export="exportDonnees" :evenementClavier="evenementClavier" @afficher="afficherPanneau" @fermer="fermerPanneau" @export="modifierPanneau" v-else-if="panneau.type === 'cartes'" :key="'cartes_' + panneau.id" />
			<PTirageTexte :panneau="panneau" :pages="pages" :nav="nav" :export="exportDonnees" :evenementClavier="evenementClavier" @afficher="afficherPanneau" @fermer="fermerPanneau" @export="modifierPanneau" v-else-if="panneau.type === 'tirage' || panneau.type === 'tirage-texte'" :key="'tirage-texte_' + panneau.id" />
			<PTirageImage :panneau="panneau" :pages="pages" :nav="nav" :export="exportDonnees" :evenementClavier="evenementClavier" @afficher="afficherPanneau" @fermer="fermerPanneau" @export="modifierPanneau" v-else-if="panneau.type === 'tirage-image'" :key="'tirage-image_' + panneau.id" />
			<PTirageAudio :panneau="panneau" :pages="pages" :nav="nav" :export="exportDonnees" :evenementClavier="evenementClavier" @afficher="afficherPanneau" @fermer="fermerPanneau" @export="modifierPanneau" v-else-if="panneau.type === 'tirage-audio'" :key="'tirage-audio_' + panneau.id" />
			<PHistoire :panneau="panneau" :pages="pages" :nav="nav" :export="exportDonnees" :evenementClavier="evenementClavier" @afficher="afficherPanneau" @fermer="fermerPanneau" @export="modifierPanneau" v-else-if="panneau.type === 'histoire'" :key="'histoire_' + panneau.id" />
			<PPlateau :panneau="panneau" :pages="pages" :nav="nav" :export="exportDonnees" :evenementClavier="evenementClavier" @afficher="afficherPanneau" @fermer="fermerPanneau" @export="modifierPanneau" v-else-if="panneau.type === 'plateau'" :key="'plateau_' + panneau.id" />
			<PDes :panneau="panneau" :pages="pages" :nav="nav" :export="exportDonnees" :evenementClavier="evenementClavier" @afficher="afficherPanneau" @fermer="fermerPanneau" @export="modifierPanneau" v-else-if="panneau.type === 'des'" :key="'des_' + panneau.id" />
			<PModalites :panneau="panneau" :pages="pages" :nav="nav" :export="exportDonnees" :evenementClavier="evenementClavier" @afficher="afficherPanneau" @fermer="fermerPanneau" @export="modifierPanneau" v-else-if="panneau.type === 'modalites'" :key="'modalites_' + panneau.id" />
			<PGroupes :panneau="panneau" :pages="pages" :nav="nav" :export="exportDonnees" :evenementClavier="evenementClavier" @afficher="afficherPanneau" @fermer="fermerPanneau" @export="modifierPanneau" v-else-if="panneau.type === 'groupes'" :key="'groupes_' + panneau.id" />
			<PChrono :panneau="panneau" :pages="pages" :nav="nav" :export="exportDonnees" :evenementClavier="evenementClavier" @afficher="afficherPanneau" @fermer="fermerPanneau" @export="modifierPanneau" v-else-if="panneau.type === 'chrono'" :key="'chrono_' + panneau.id" />
			<PRebours :panneau="panneau" :pages="pages" :nav="nav" :export="exportDonnees" :evenementClavier="evenementClavier" @afficher="afficherPanneau" @fermer="fermerPanneau" @export="modifierPanneau" v-else-if="panneau.type === 'rebours'" :key="'rebours_' + panneau.id" />
			<PHorloge :panneau="panneau" :pages="pages" :nav="nav" :export="exportDonnees" :evenementClavier="evenementClavier" :langue="langue" @afficher="afficherPanneau" @fermer="fermerPanneau" @export="modifierPanneau" v-else-if="panneau.type === 'horloge'" :key="'horloge_' + panneau.id" />
			<PCalendrier :panneau="panneau" :pages="pages" :nav="nav" :export="exportDonnees" :evenementClavier="evenementClavier" @afficher="afficherPanneau" @fermer="fermerPanneau" @export="modifierPanneau" v-else-if="panneau.type === 'calendrier'" :key="'calendrier_' + panneau.id" />
			<PRetroaction :panneau="panneau" :pages="pages" :nav="nav" :export="exportDonnees" :evenementClavier="evenementClavier" @afficher="afficherPanneau" @fermer="fermerPanneau" @export="modifierPanneau" v-else-if="panneau.type === 'retroaction'" :key="'retroaction_' + panneau.id" />
			<PSonometre :panneau="panneau" :pages="pages" :nav="nav" :export="exportDonnees" :evenementClavier="evenementClavier" @afficher="afficherPanneau" @fermer="fermerPanneau" @export="modifierPanneau" v-else-if="panneau.type === 'sonometre'" :key="'sonometre_' + panneau.id" />
		</template>

		<MGrille v-if="modale === 'grille'" />
		<MInfo v-else-if="modale === 'info'" />
		<MParametres v-if="menu" />

		<div id="pages" :class="{'noir': Object.keys(pages[page - 1].grille).length > 0 && (pages[page - 1].grille.couleur === 'blanc' || pages[page - 1].grille.couleur === 'gris')}" v-if="pages.length > 1" :data-html2canvas-ignore="true">
			<div>
				<span :class="{'selectionne': page === index}" @click="afficherPage(index)" v-for="index in pages.length" :key="'page_' + index" />
			</div>
		</div>
	</main>
</template>

<script>
import PCodeqr from '@/components/codeqr.vue'
import PTexte from '@/components/texte.vue'
import PTableau from '@/components/tableau.vue'
import PImage from '@/components/image.vue'
import PGalerie from '@/components/galerie.vue'
import PDessin from '@/components/dessin.vue'
import PDocument from '@/components/document.vue'
import PAudio from '@/components/audio.vue'
import PSynthese from '@/components/synthese.vue'
import PVideo from '@/components/video.vue'
import PWebcam from '@/components/webcam.vue'
import PLien from '@/components/lien.vue'
import PIframe from '@/components/iframe.vue'
import PNuage from '@/components/nuage.vue'
import POrdre from '@/components/ordre.vue'
import PImagesSequentielles from '@/components/images-sequentielles.vue'
import PTrous from '@/components/trous.vue'
import PSurlignage from '@/components/surlignage.vue'
import PPendu from '@/components/pendu.vue'
import PCartes from '@/components/cartes.vue'
import PTirageTexte from '@/components/tirage-texte.vue'
import PTirageImage from '@/components/tirage-image.vue'
import PTirageAudio from '@/components/tirage-audio.vue'
import PHistoire from '@/components/histoire.vue'
import PPlateau from '@/components/plateau.vue'
import PDes from '@/components/des.vue'
import PModalites from '@/components/modalites.vue'
import PGroupes from '@/components/groupes.vue'
import PChrono from '@/components/chrono.vue'
import PRebours from '@/components/rebours.vue'
import PHorloge from '@/components/horloge.vue'
import PCalendrier from '@/components/calendrier.vue'
import PRetroaction from '@/components/retroaction.vue'
import PSonometre from '@/components/sonometre.vue'
import MGrille from '@/components/grille.vue'
import MInfo from '@/components/info.vue'
import MParametres from '@/components/parametres.vue'
import Annotation from '@/components/annotation.vue'
import Chargement from '@/components/chargement.vue'
import html2canvas from 'html2canvas'
import fscreen from 'fscreen'
import { saveAs } from 'file-saver'
import imagesLoaded from 'imagesloaded'

export default {
	name: 'App',
	components: {
		PCodeqr,
		PTexte,
		PTableau,
		PImage,
		PGalerie,
		PDessin,
		PDocument,
		PAudio,
		PSynthese,
		PVideo,
		PWebcam,
		PLien,
		PIframe,
		PNuage,
		POrdre,
		PImagesSequentielles,
		PTrous,
		PSurlignage,
		PPendu,
		PCartes,
		PTirageTexte,
		PTirageImage,
		PTirageAudio,
		PHistoire,
		PPlateau,
		PDes,
		PModalites,
		PGroupes,
		PChrono,
		PRebours,
		PHorloge,
		PCalendrier,
		PRetroaction,
		PSonometre,
		MGrille,
		MInfo,
		MParametres,
		Annotation,
		Chargement
	},
	data () {
		return {
			chargement: true,
			alerte: false,
			largeur: 0,
			hauteur: 0,
			pages: [{ fond: './static/img/digitale.jpg', grille: {}, annotations: {}, annotation: false }],
			page: 1,
			chargementPage: false,
			modules: ['codeqr', 'texte', 'image', 'galerie', 'document', 'audio', 'video', 'lien', 'iframe', 'nuage', 'tirage-texte', 'tirage-image', 'histoire', 'plateau', 'des', 'modalites', 'groupes', 'chrono', 'rebours', 'horloge', 'calendrier', 'retroaction', 'grille'],
			panneaux: [],
			panneauxPage: [],
			langue: 'fr',
			pleinEcran: false,
			listeVoix: [],
			modale: '',
			menu: false,
			nav: true,
			exportDonnees: false,
			importDonnees: false,
			importTermine: false,
			retroaction: false,
			modalites: false,
			annotation: false,
			defilement: false,
			depart: 0,
			distance: 0,
			audio: '',
			audioInitialise: false,
			evenementClavier: { touche: '', id: '' },
			outilDeplacer: false,
			panneauAffiche: '',
			lectureSeule: false
		}
	},
	computed: {
		fond () {
			return this.pages[this.page - 1].fond
		},
		grille () {
			return this.pages[this.page - 1].grille
		},
		annotations () {
			return this.pages[this.page - 1].annotations
		}
	},
	watch: {
		page: function (page) {
			this.chargementPage = true
			this.annotation = false
			this.exportDonnees = true
			this.panneauxPage.forEach(function (panneau) {
				if (document.querySelector('#' + panneau.id)) {
					document.querySelector('#' + panneau.id).close()
				}
			})
			const panneaux = this.panneaux.filter(function (element) {
				return element.page === page
			})
			imagesLoaded('main', { background: true }, function () {
				this.panneauxPage = []
				this.$nextTick(function () {
					this.exportDonnees = false
					if (this.pages[page - 1].hasOwnProperty('annotation')) {
						this.annotation = this.pages[page - 1].annotation
					} else {
						this.annotation = false
					}
					this.retroaction = false
					this.modalites = false
					setTimeout(function () {
						this.panneauxPage.push(...panneaux)
						for (let i = 0; i < this.panneauxPage.length; i++) {
							if (this.panneauxPage[i].type === 'retroaction') {
								this.retroaction = true
							}
							if (this.panneauxPage[i].type === 'modalites') {
								this.modalites = true
							}
						}
						this.$nextTick(function () {
							if (this.lectureSeule === true) {
								const panneaux = document.querySelectorAll('.jsPanel')
								panneaux.forEach(function (panneau) {
									panneau.querySelector('.jsPanel-btn-close').style.display = 'none'
								})
							}
						}.bind(this))
						imagesLoaded('main', { background: true }, function () {
							this.chargementPage = false
						}.bind(this))
					}.bind(this), 150)
				}.bind(this))
			}.bind(this))
		},
		nav: function (nav) {
			if (nav) {
				this.hauteur = document.body.clientHeight - this.convertirRem(7.5)
			} else {
				this.hauteur = document.body.clientHeight
			}
		},
		lectureSeule: function (lectureSeule) {
			const panneaux = document.querySelectorAll('.jsPanel')
			if (lectureSeule === true) {
				panneaux.forEach(function (panneau) {
					if (panneau.querySelector('.jsPanel-btn-close')) {
						panneau.querySelector('.jsPanel-btn-close').style.display = 'none'
					}
					if (panneau.querySelector('.jsPanel-btn-send')) {
						panneau.querySelector('.jsPanel-btn-send').style.display = 'none'
					}
				})
				this.nav = false
			} else {
				panneaux.forEach(function (panneau) {
					if (panneau.querySelector('.jsPanel-btn-close')) {
						panneau.querySelector('.jsPanel-btn-close').style.display = 'block'
					}
					if (panneau.querySelector('.jsPanel-btn-send')) {
						panneau.querySelector('.jsPanel-btn-send').style.display = 'block'
					}
				})
				this.nav = true
			}
		}
	},
	mounted () {
		this.verifierDimensions()
		this.activerDefilementHorizontal()

		document.querySelector('#chargement').addEventListener('animationend', function () {
			this.chargement = false
		}.bind(this), false)

		const params = new URLSearchParams(document.location.search)

		const langues = ['fr', 'en', 'it', 'es', 'nl', 'de', 'hr']
		let langue = params.get('lang')
		if (langues.includes(langue) === true) {
			this.langue = langue
			localStorage.setItem('digiscreen_lang', langue)
		}
		const langueNavigateur = navigator.language.substring(0, 2)
		if (langues.includes(langue) === false && langues.includes(langueNavigateur) === true) {
			this.langue = langueNavigateur
		}
		if (localStorage.getItem('digiscreen_lang')) {
			this.langue = localStorage.getItem('digiscreen_lang')
		}
		this.$root.$i18n.locale = this.langue
		document.getElementsByTagName('html')[0].setAttribute('lang', this.langue)

		if (localStorage.getItem('digiscreen_modules')) {
			this.modules = JSON.parse(localStorage.getItem('digiscreen_modules'))
		}

		let pageAAfficher = 0
		const page = params.get('page')
		if (page && parseInt(page) !== '') {
			pageAAfficher = parseInt(page)
		}

		const dgs = params.get('dgs')
		if (dgs && dgs !== '') {
			this.importDonnees = true
			const xhr = new XMLHttpRequest()
			xhr.onload = function () {
				if (xhr.readyState === xhr.DONE && xhr.status === 200) {
					let donnees = xhr.responseText
					if (donnees !== '' && this.verifierJSON(donnees) === true) {
						donnees = JSON.parse(donnees)
						this.modules = donnees.modules
						this.panneaux = donnees.panneaux
						if (!langue || langues.includes(langue) === false) {
							this.langue = donnees.langue
							this.$root.$i18n.locale = donnees.langue
						}
						if (donnees.hasOwnProperty('nav')) {
							this.nav = donnees.nav
						}
						this.importTermine = true
						if (Object.keys(this.pages[0].annotations).length > 0) {
							this.annotation = true
						} else {
							this.annotation = false
						}
						this.$nextTick(function () {
							this.pages = donnees.pages
							if (pageAAfficher > 0 && pageAAfficher !== 1) {
								this.page = pageAAfficher
							} else {
								this.page = donnees.page
							}
							if (this.page === 1) {
								const panneaux = this.panneaux.filter(function (element) {
									return element.page === 1
								})
								this.panneauxPage = panneaux
								for (let i = 0; i < this.panneauxPage.length; i++) {
									if (this.panneauxPage[i].type === 'retroaction') {
										this.retroaction = true
									}
									if (this.panneauxPage[i].type === 'modalites') {
										this.modalites = true
									}
								}
							}
						}.bind(this))
					} else {
						this.importTermine = true
					}
					this.$nextTick(function () {
						document.querySelector('#import').addEventListener('animationend', function () {
							this.importDonnees = false
							this.importTermine = false
						}.bind(this))
					}.bind(this))
				}
			}.bind(this)
			xhr.open('POST', window.location.href.split('?')[0] + 'inc/recuperer_donnees_dgs.php', true)
			xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
			xhr.send('dgs=' + dgs)
		}

		this.audio = new Audio()
		this.audio.autoplay = true
		this.audio.src = 'data:audio/mpeg;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAA1N3aXRjaCBQbHVzIMKpIE5DSCBTb2Z0d2FyZQBUSVQyAAAABgAAAzIyMzUAVFNTRQAAAA8AAANMYXZmNTcuODMuMTAwAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsRbAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQMSkAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV'
		document.body.addEventListener('touchstart', function () {
			if (this.audioInitialise === false) {
				this.audio.play()
				this.audioInitialise = true
			}
		}.bind(this))
		document.body.addEventListener('click', function () {
			if (this.audioInitialise === false) {
				this.audio.play()
				this.audioInitialise = true
			}
		}.bind(this))

		this.recupererVoix()
		const synth = window.speechSynthesis
		if (synth && synth.onvoiceschanged !== undefined) {
			synth.onvoiceschanged = this.recupererVoix
		}

		document.addEventListener('keydown', function (event) {
			if (event.ctrlKey && event.key === 'k') {
				event.preventDefault()
				this.capturer()
			} else if (event.ctrlKey && event.key === 'm' && !this.menu) {
				event.preventDefault()
				this.ouvrirMenu()
			} else if (event.ctrlKey && event.key === 'm' && this.menu) {
				event.preventDefault()
				this.fermerMenu()
			} else if (event.ctrlKey && event.key === 'i') {
				event.preventDefault()
				if (this.modale === 'info') {
					this.fermerModale()
				} else {
					this.ouvrirModale('info')
				}
			} else if (event.ctrlKey && event.key === 'e' && !this.pleinEcran) {
				this.entrerPleinEcran()
			} else if (event.ctrlKey && event.key === 'e' && this.pleinEcran) {
				this.sortirPleinEcran()
			} else if (event.ctrlKey && (event.key === '*' || event.key === 'l')) {
				event.preventDefault()
				this.nav = !this.nav
			} else if (event.ctrlKey && event.key === 'ArrowLeft') {
				event.preventDefault()
				if (this.page === 1) {
					this.page = this.pages.length
				} else {
					this.page--
				}
			} else if (event.ctrlKey && event.key === 'ArrowRight') {
				event.preventDefault()
				if (this.page === this.pages.length) {
					this.page = 1
				} else {
					this.page++
				}
			} else if ((!this.annotation || (this.annotation && this.outilDeplacer)) && event.target.tagName.toLowerCase() !== 'input' && event.target.tagName.toLowerCase() !== 'textarea' && !event.target.closest('.pell-content') && (event.key === 'ArrowLeft' || event.key === 'ArrowRight' || event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'm' || event.key === 'f')) {
				event.preventDefault()
				if (this.panneauAffiche !== '') {
					this.evenementClavier = { touche: event.key, id: this.panneauAffiche }
				}
			} else if ((!this.annotation || (this.annotation && this.outilDeplacer)) && event.target.tagName.toLowerCase() !== 'input' && event.target.tagName.toLowerCase() !== 'textarea' && !event.target.closest('.pell-content') && event.key === 'Delete') {
				event.preventDefault()
				let type = ''
				this.panneauxPage.forEach(function (panneau) {
					if (this.panneauAffiche === panneau.id) {
						type = panneau.type
					}
				}.bind(this))
				if (this.panneauAffiche !== '' && type !== '') {
					this.fermerPanneau(this.panneauAffiche, type)
				}
			}
		}.bind(this), false)

		document.querySelector('main').addEventListener('dragover', function (event) {
			event.preventDefault()
			event.stopPropagation()
		}, false)

		document.querySelector('main').addEventListener('dragcenter', function (event) {
			event.preventDefault()
			event.stopPropagation()
		}, false)

		document.querySelector('main').addEventListener('drop', function (event) {
			event.preventDefault()
			event.stopPropagation()
			if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
				for (let i = 0; i < event.dataTransfer.files.length; i++) {
					if (event.dataTransfer.files[i].type.substring(0, 5) === 'image' || event.dataTransfer.files[i].type.substring(0, 5) === 'audio' || event.dataTransfer.files[i].type.substring(0, 5) === 'video') {
						const id = 'panneau_' + (new Date()).getTime() + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)
						const largeur = document.body.clientWidth / 2
						const hauteur = (document.body.clientHeight - this.convertirRem(7.5)) / 2
						const type = event.dataTransfer.files[i].type.substring(0, 5)
						let fichier, reader
						if (type === 'image') {
							reader = new FileReader()
							reader.readAsDataURL(event.dataTransfer.files[i])
							reader.onloadend = function (e) {
								const img = new Image()
								img.src = e.target.result
								img.onload = function () {
									if (img.width > 1200) {
										const canvas = document.createElement('canvas')
										const ratio = img.width / img.height
										const largeurCanvas = 1200
										const hauteurCanvas = 1200 / ratio
										canvas.width = largeurCanvas
										canvas.height = hauteurCanvas
										canvas.getContext('2d').drawImage(img, 0, 0, largeurCanvas, hauteurCanvas)
										fichier = canvas.toDataURL('image/jpeg', 0.85)
									} else {
										fichier = e.target.result
									}
									const panneau = { page: this.page, id: id, type: type, mode: 'lecture', statut: '', dimensions: {}, position: {}, contenu: { image: fichier, requete: '', page: 1, zoom: 1 }, w: 40, h: 30, x: largeur - this.convertirRem(20), y: hauteur - this.convertirRem(15) }
									this.panneaux.push(panneau)
									this.panneauxPage.push(panneau)
								}.bind(this)
							}.bind(this)
						} else if (type === 'audio') {
							reader = new FileReader()
							reader.readAsDataURL(event.dataTransfer.files[i])
							reader.onloadend = function (e) {
								const dataURL = e.target.result
								fichier = window.URL.createObjectURL(event.dataTransfer.files[i])
								const panneau = { page: this.page, id: id, type: type, mode: 'lecture', statut: '', dimensions: {}, position: {}, contenu: { audio: fichier, dataURL: dataURL, vitesse: 1 }, w: 40, h: 14, x: largeur - this.convertirRem(20), y: hauteur - this.convertirRem(7) }
								this.panneaux.push(panneau)
								this.panneauxPage.push(panneau)
							}.bind(this)
						} else if (type === 'video') {
							reader = new FileReader()
							reader.readAsDataURL(event.dataTransfer.files[i])
							reader.onloadend = function (e) {
								const dataURL = e.target.result
								fichier = window.URL.createObjectURL(event.dataTransfer.files[i])
								const panneau = { page: this.page, id: id, type: type, mode: 'lecture', statut: '', dimensions: {}, position: {}, contenu: { video: fichier, videoId: '', type: event.dataTransfer.files[i].type, dataURL: dataURL, debutMinutes: '', debutSecondes: '', finMinutes: '', finSecondes: '' }, w: 38, h: 31.5, x: largeur - this.convertirRem(19), y: hauteur - this.convertirRem(15.75) }
								this.panneaux.push(panneau)
								this.panneauxPage.push(panneau)
							}.bind(this)
						}
					}
				}
			}
		}.bind(this), false)

		fscreen.addEventListener('fullscreenchange', function () {
			if (fscreen.fullscreenElement === null) {
				this.pleinEcran = false
			} else {
				this.pleinEcran = true
			}
		}.bind(this))

		window.addEventListener('resize', this.verifierDimensions, false)

		window.addEventListener('beforeunload', function (event) {
			event.preventDefault()
			event.returnValue = ''
		}, false)

		window.addEventListener('paste', function (event) {
			if ((!this.annotation || (this.annotation && this.outilDeplacer)) && event.target.tagName.toLowerCase() !== 'input' && event.target.tagName.toLowerCase() !== 'textarea' && !event.target.closest('.pell-content')) {
				const items = event.clipboardData.files
				const largeur = document.body.clientWidth / 2
				const hauteur = (document.body.clientHeight - this.convertirRem(7.5)) / 2
				for (let i = 0; i < items.length; i++) {
					if (items[i].type.includes('image')) {
						const id = 'panneau_' + (new Date()).getTime() + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)
						let fichier
						const reader = new FileReader()
						reader.readAsDataURL(items[i])
						reader.onloadend = function (e) {
							const img = new Image()
							img.src = e.target.result
							img.onload = function () {
								if (img.width > 1200) {
									const canvas = document.createElement('canvas')
									const ratio = img.width / img.height
									const largeurCanvas = 1200
									const hauteurCanvas = 1200 / ratio
									canvas.width = largeurCanvas
									canvas.height = hauteurCanvas
									canvas.getContext('2d').drawImage(img, 0, 0, largeurCanvas, hauteurCanvas)
									fichier = canvas.toDataURL('image/jpeg', 0.85)
								} else {
									fichier = e.target.result
								}
								const panneau = { page: this.page, id: id, type: 'image', mode: 'lecture', statut: '', dimensions: {}, position: {}, contenu: { image: fichier, requete: '', page: 1, zoom: 1 }, w: 40, h: 30, x: largeur - this.convertirRem(20), y: hauteur - this.convertirRem(15) }
								this.panneaux.push(panneau)
								this.panneauxPage.push(panneau)
							}.bind(this)
						}.bind(this)
					}
				}
			}
		}.bind(this), false)
	},
	methods: {
		definirFond () {
			if (this.fond.substring(0, 1) === '#') {
				return { 'background-color': this.fond }
			} else if (this.fond.split('.').pop() === 'png') {
				return { 'background-image': 'url(' + this.fond + ')', 'background-size': 'auto', 'background-repeat': 'repeat' }
			} else {
				return { 'background-image': 'url(' + this.fond + ')' }
			}
		},
		creerPanneau (type) {
			if (type === 'retroaction' && this.retroaction === true) {
				for (let i = 0; i < this.panneauxPage.length; i++) {
					if (this.panneauxPage[i].type === 'retroaction') {
						this.fermerPanneau(this.panneauxPage[i].id, type)
						break
					}
				}
				return false
			} else if (type === 'modalites' && this.modalites === true) {
				for (let i = 0; i < this.panneauxPage.length; i++) {
					if (this.panneauxPage[i].type === 'modalites') {
						this.fermerPanneau(this.panneauxPage[i].id, type)
						break
					}
				}
				return false
			}
			const id = 'panneau_' + (new Date()).getTime()
			const largeur = document.body.clientWidth / 2
			const hauteur = (document.body.clientHeight - this.convertirRem(7.5)) / 2
			let panneau
			switch (type) {
			case 'codeqr':
				panneau = { page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, position: {}, contenu: '', w: 36, h: 46, x: largeur - this.convertirRem(18), y: hauteur - this.convertirRem(23) }
				break
			case 'texte':
				panneau = { page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, position: {}, contenu: '', w: 53, h: 46, x: largeur - this.convertirRem(26.5), y: hauteur - this.convertirRem(23) }
				break
			case 'tableau':
				panneau = { page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, position: {}, contenu: '', w: 50, h: 45, x: largeur - this.convertirRem(25), y: hauteur - this.convertirRem(22.5) }
				break
			case 'image':
				panneau = { page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, position: {}, contenu: '', w: 40, h: 27, x: largeur - this.convertirRem(20), y: hauteur - this.convertirRem(13.5) }
				break
			case 'galerie':
				panneau = { page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, position: {}, contenu: '', w: 60, h: 34, x: largeur - this.convertirRem(30), y: hauteur - this.convertirRem(17) }
				break
			case 'dessin':
				panneau = { page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, position: {}, contenu: '', w: 48, h: 35, x: largeur - this.convertirRem(24), y: hauteur - this.convertirRem(17.5) }
				break
			case 'document':
				panneau = { page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, position: {}, contenu: '', w: 40, h: 16, x: largeur - this.convertirRem(20), y: hauteur - this.convertirRem(8) }
				break
			case 'audio':
				panneau = { page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, position: {}, contenu: '', w: 40, h: 32, x: largeur - this.convertirRem(20), y: hauteur - this.convertirRem(16) }
				break
			case 'synthese':
				panneau = { page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, position: {}, contenu: '', w: 40, h: 41, x: largeur - this.convertirRem(20), y: hauteur - this.convertirRem(20.5) }
				break
			case 'video':
				panneau = { page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, position: {}, contenu: '', w: 40, h: 27, x: largeur - this.convertirRem(20), y: hauteur - this.convertirRem(13.5) }
				break
			case 'webcam':
				panneau = { page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, position: {}, contenu: '', w: 40, h: 22, x: largeur - this.convertirRem(20), y: hauteur - this.convertirRem(11) }
				break
			case 'lien':
				panneau = { page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, position: {}, contenu: '', w: 40, h: 28, x: largeur - this.convertirRem(20), y: hauteur - this.convertirRem(14) }
				break
			case 'iframe':
				panneau = { page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, position: {}, contenu: '', w: 40, h: 22, x: largeur - this.convertirRem(20), y: hauteur - this.convertirRem(11) }
				break
			case 'nuage':
				panneau = { page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, position: {}, contenu: '', w: 80, h: 59.5, x: largeur - this.convertirRem(40), y: hauteur - this.convertirRem(29.75) }
				break
			case 'ordre':
				panneau = { page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, position: {}, contenu: '', w: 46, h: 50.4, x: largeur - this.convertirRem(23), y: hauteur - this.convertirRem(25.2) }
				break
			case 'images-sequentielles':
				panneau = { page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, position: {}, contenu: '', w: 60, h: 34, x: largeur - this.convertirRem(30), y: hauteur - this.convertirRem(17) }
				break
			case 'trous':
				panneau = { page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, position: {}, contenu: '', w: 46, h: 48, x: largeur - this.convertirRem(23), y: hauteur - this.convertirRem(24) }
				break
			case 'surlignage':
				panneau = { page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, position: {}, contenu: '', w: 46, h: 36, x: largeur - this.convertirRem(23), y: hauteur - this.convertirRem(18) }
				break
			case 'pendu':
				panneau = { page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, position: {}, contenu: '', w: 40, h: 64, x: largeur - this.convertirRem(20), y: hauteur - this.convertirRem(32) }
				break
			case 'cartes':
				panneau = { page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, position: {}, contenu: '', w: 60, h: 50, x: largeur - this.convertirRem(30), y: hauteur - this.convertirRem(25) }
				break
			case 'tirage':
			case 'tirage-texte':
				panneau = { page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, position: {}, contenu: '', w: 46, h: 40, x: largeur - this.convertirRem(23), y: hauteur - this.convertirRem(20) }
				break
			case 'tirage-image':
				panneau = { page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, position: {}, contenu: '', w: 60, h: 40, x: largeur - this.convertirRem(30), y: hauteur - this.convertirRem(20) }
				break
			case 'tirage-audio':
				panneau = { page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, position: {}, contenu: '', w: 60, h: 40, x: largeur - this.convertirRem(30), y: hauteur - this.convertirRem(20) }
				break
			case 'histoire':
				panneau = { page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, position: {}, contenu: '', w: 40, h: 22, x: largeur - this.convertirRem(20), y: hauteur - this.convertirRem(11) }
				break
			case 'plateau':
				panneau = { page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, position: {}, contenu: '', w: 40, h: 50, x: largeur - this.convertirRem(20), y: hauteur - this.convertirRem(25) }
				break
			case 'des':
				panneau = { page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, position: {}, contenu: '', w: 40, h: 25.4, x: largeur - this.convertirRem(20), y: hauteur - this.convertirRem(12.7) }
				break
			case 'modalites':
				panneau = { page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, position: {}, contenu: '', w: 38, h: 56, x: largeur - this.convertirRem(19), y: hauteur - this.convertirRem(28) }
				this.modalites = true
				break
			case 'groupes':
				panneau = { page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, position: {}, contenu: '', w: 46, h: 42, x: largeur - this.convertirRem(23), y: hauteur - this.convertirRem(21) }
				break
			case 'chrono':
				panneau = { page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, position: {}, contenu: '', w: 48, h: 28.4, x: largeur - this.convertirRem(24), y: hauteur - this.convertirRem(14.2) }
				break
			case 'rebours':
				panneau = { page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, position: {}, contenu: '', w: 42, h: 32, x: largeur - this.convertirRem(21), y: hauteur - this.convertirRem(16) }
				break
			case 'horloge':
				panneau = { page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, position: {}, contenu: '', w: 40, h: 43.6, x: largeur - this.convertirRem(20), y: hauteur - this.convertirRem(21.8) }
				break
			case 'calendrier':
				panneau = { page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, position: {}, contenu: '', w: 40, h: 34, x: largeur - this.convertirRem(20), y: hauteur - this.convertirRem(17) }
				break
			case 'retroaction':
				panneau = { page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, position: {}, contenu: '', w: 36, h: 31, x: largeur - this.convertirRem(18), y: hauteur - this.convertirRem(15.5) }
				this.retroaction = true
				break
			case 'sonometre':
				panneau = { page: this.page, id: id, type: type, mode: '', statut: '', dimensions: {}, position: {}, contenu: '', w: 40, h: 24, x: largeur - this.convertirRem(20), y: hauteur - this.convertirRem(12) }
				break
			}
			this.panneaux.push(panneau)
			this.panneauxPage.push(panneau)
		},
		modifierPanneau (donnees) {
			this.panneaux.forEach(function (panneau, index) {
				if (panneau.id === donnees.id) {
					this.panneaux[index].titre = donnees.titre
					this.panneaux[index].mode = donnees.mode
					this.panneaux[index].statut = donnees.statut
					this.panneaux[index].dimensions = donnees.dimensions
					this.panneaux[index].position = donnees.position
					this.panneaux[index].contenu = donnees.contenu
					this.panneaux[index].w = donnees.w
					this.panneaux[index].h = donnees.h
					this.panneaux[index].x = donnees.x
					this.panneaux[index].y = donnees.y
				}
			}.bind(this))
		},
		afficherPanneau (id) {
			this.panneauAffiche = id
		},
		fermerPanneau (id, type) {
			const panneaux = this.panneaux
			panneaux.forEach(function (panneau, index) {
				if (panneau.id === id) {
					panneaux.splice(index, 1)
				}
			})
			this.panneaux = panneaux
			if (document.querySelector('#' + id)) {
				document.querySelector('#' + id).close()
			}
			if (type === 'retroaction') {
				this.retroaction = false
			} else if (type === 'modalites') {
				this.modalites = false
			}
		},
		ouvrirModale (modale) {
			this.modale = modale
		},
		fermerModale () {
			this.modale = ''
		},
		ouvrirMenu () {
			this.menu = true
		},
		fermerMenu () {
			this.menu = false
		},
		reinitialiserGrille () {
			this.pages[this.page - 1].grille = {}
		},
		capturer () {
			html2canvas(document.body, { useCORS: true }).then(function (canvas) {
				this.audio.src = './static/audio/photo.mp3'
				this.audio.play()
				saveAs(canvas.toDataURL('image/jpeg', 0.95).replace('image/jpeg', 'image/octet-stream'), 'capture_' + (new Date()).getTime() + '.jpg')
			}.bind(this))
		},
		annoter () {
			this.annotation = true
			this.pages[this.page - 1].annotation = true
			this.outilDeplacer = false
		},
		arreterAnnoter () {
			this.annotation = false
			this.pages[this.page - 1].annotation = false
			this.outilDeplacer = false
		},
		definirOutilDeplacer (valeur) {
			this.outilDeplacer = valeur
		},
		entrerPleinEcran () {
			fscreen.requestFullscreen(document.body)
		},
		sortirPleinEcran () {
			fscreen.exitFullscreen()
		},
		afficherPage (page) {
			this.page = page
		},
		importer (event) {
			const fichier = event.target.files[0]
			if (fichier === null || fichier.length === 0) {
				document.querySelector('#televerser').value = ''
				return false
			} else {
				this.importDonnees = true
				const page = this.page
				const reader = new FileReader()
				reader.onload = function (e) {
					if (this.verifierJSON(e.target.result) === false) {
						this.importTermine = true
						return false
					}
					const donnees = JSON.parse(e.target.result)
					this.pages = donnees.pages
					this.page = donnees.page
					this.modules = donnees.modules
					this.panneaux = donnees.panneaux
					this.langue = donnees.langue
					this.$root.$i18n.locale = donnees.langue
					if (donnees.hasOwnProperty('nav')) {
						this.nav = donnees.nav
					}
					if (donnees.hasOwnProperty('lectureSeule')) {
						this.lectureSeule = donnees.lectureSeule
					}
					this.importTermine = true
					if (page === this.page) {
						if (this.pages[this.page - 1].annotation === false) {
							this.annotation = false
						} else {
							this.annotation = true
						}
						this.retroaction = false
						this.modalites = false
						this.panneauxPage.forEach(function (panneau) {
							if (document.querySelector('#' + panneau.id)) {
								document.querySelector('#' + panneau.id).close()
							}
						})
						this.panneauxPage = []
						const panneauxPage = donnees.panneaux.filter(function (element) {
							return element.page === donnees.page
						})
						imagesLoaded('main', { background: true }, function () {
							setTimeout(function () {
								this.panneauxPage.push(...panneauxPage)
								for (let i = 0; i < this.panneauxPage.length; i++) {
									if (this.panneauxPage[i].type === 'retroaction') {
										this.retroaction = true
									}
									if (this.panneauxPage[i].type === 'modalites') {
										this.modalites = true
									}
								}
								if (donnees.hasOwnProperty('ecran') && donnees.ecran.largeur > document.body.clientWidth) {
									const zoom = Math.ceil((document.body.clientWidth / donnees.ecran.largeur) * 100)
									alert(this.$t('alerteEcran', { zoom: zoom }))
								}
								this.$nextTick(function () {
									if (this.lectureSeule === true) {
										const panneaux = document.querySelectorAll('.jsPanel')
										panneaux.forEach(function (panneau) {
											panneau.querySelector('.jsPanel-btn-close').style.display = 'none'
										})
									}
								}.bind(this))
							}.bind(this), 150)
						}.bind(this))
					}
				}.bind(this)
				reader.readAsText(fichier)
				document.querySelector('#televerser').value = ''
				this.$nextTick(function () {
					document.querySelector('#import').addEventListener('animationend', function () {
						this.importDonnees = false
						this.importTermine = false
					}.bind(this))
				}.bind(this))
			}
		},
		exporter () {
			const date = new Date()
			const annee = date.getFullYear()
			let mois = date.getMonth() + 1
			if (mois < 10) {
				mois = '0' + mois
			}
			let jour = date.getDate()
			if (jour < 10) {
				jour = '0' + jour
			}
			let heures = date.getHours()
			if (heures < 10) {
				heures = '0' + heures
			}
			let minutes = date.getMinutes()
			if (minutes < 10) {
				minutes = '0' + minutes
			}
			let secondes = date.getSeconds()
			if (secondes < 10) {
				secondes = '0' + secondes
			}
			const fichier = 'digiscreen_' + jour + '-' + mois + '-' + annee + '_' + heures + '-' + minutes + '-' + secondes
			this.exportDonnees = true
			this.$nextTick(function () {
				let donnees = {}
				donnees.pages = this.pages
				donnees.page = this.page
				donnees.modules = this.modules
				donnees.panneaux = this.panneaux
				donnees.langue = this.langue
				donnees.nav = this.nav
				donnees.lectureSeule = this.lectureSeule
				donnees.ecran = { largeur: this.largeur, hauteur: this.hauteur }
				const blob = new Blob([JSON.stringify(donnees)], { type: 'text/json;charset=utf-8' })
				saveAs(blob, fichier + '.dgs')
				this.exportDonnees = false
				this.fermerModale()
			}.bind(this))
		},
		modifierModule (event) {
			const module = event.target.value
			if (event.target.checked === true) {
				this.modules.push(module)
			} else {
				const index = this.modules.indexOf(module)
				this.modules.splice(index, 1)
			}
			localStorage.setItem('digiscreen_modules', JSON.stringify(this.modules))
		},
		recupererVoix () {
			const synth = window.speechSynthesis
			if (synth) {
				this.listeVoix = synth.getVoices().sort(function (a, b) {
					const nomA = a.name.toUpperCase()
					const nomB = b.name.toUpperCase()
					if (nomA < nomB) return -1
					else if (nomA == nomB) return 0
					else return +1
				})
			}
		},
		verifierJSON (json) {
			try {
				JSON.parse(json)
				return true
			} catch {
				return false
			}
		},
		verifierDimensions () {
			const largeur = window.innerWidth
			this.$nextTick(function () {
				this.largeur = document.body.clientWidth
				if (this.nav) {
					this.hauteur = document.body.clientHeight - this.convertirRem(7.5)
				} else {
					this.hauteur = document.body.clientHeight
				}
			}.bind(this))
			if (largeur < 1024) {
				this.alerte = true
			} else if (this.alerte) {
				this.alerte = false
				this.chargement = true
				this.$nextTick(function () {
					document.querySelector('#chargement').addEventListener('animationend', function () {
						this.chargement = false
					}.bind(this))
				}.bind(this))
			}
		},
		convertirRem (valeur) {
			const taille = window.getComputedStyle(document.querySelector('html'), null).getPropertyValue('font-size')
			return 'undefined' != typeof valeur && valeur > 0 ? parseFloat(taille) * valeur : parseFloat(taille)
		},
		activerDefilementHorizontal () {
			const nav = document.querySelector('nav')
			nav.addEventListener('mousedown', this.defilementHorizontalDebut)
			nav.addEventListener('mouseleave', this.defilementHorizontalFin)
			nav.addEventListener('mouseup', this.defilementHorizontalFin)
			nav.addEventListener('mousemove', this.defilementHorizontalEnCours)
		},
		defilementHorizontalDebut (event) {
			const nav = document.querySelector('nav')
			this.defilement = true
			this.depart = event.pageX - nav.offsetLeft
			this.distance = nav.scrollLeft
		},
		defilementHorizontalFin () {
			this.defilement = false
		},
		defilementHorizontalEnCours (event) {
			if (!this.defilement) {
				return false
			}
			event.preventDefault()
			const nav = document.querySelector('nav')
			const x = event.pageX - nav.offsetLeft
			const delta = (x - this.depart) * 1.5
			nav.scrollLeft = this.distance - delta
		}
	}
}
</script>

<style src="destyle.css/destyle.css"></style>
<style src="@/assets/css/style.css"></style>
<style src="@/assets/css/jspanel.css"></style>
<style src="@/assets/css/calendar.css"></style>
<style src="video.js/dist/video-js.css"></style>
<style src="tabulator-tables/dist/css/tabulator_simple.css"></style>
