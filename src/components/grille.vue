<template>
	<div class="conteneur-modale">
		<div class="modale">
			<header>
				<span class="titre">{{ $t('grille') }}</span>
				<span class="fermer" role="button" tabindex="0" @click="$parent.fermerModale"><i class="material-icons">close</i></span>
			</header>
			<div class="conteneur modale-grille">
				<div class="contenu">
					<div class="grille">
						<div class="colonnes">
							<label>{{ $t('nombreColonnes') }} (max. 5)</label>
							<input type="number" :value="colonnes" :min="2" :max="5" @input="colonnes = $event.target.value">
						</div>
						<div class="lignes">
							<label>{{ $t('nombreLignes') }} (max. 5)</label>
							<input type="number" :value="lignes" :min="1" :max="5" @input="lignes = $event.target.value">
						</div>
					</div>
					<div class="fond">
						<label>{{ $t('couleurFond') }}</label>
						<div class="couleurs">
							<span class="blanc" :class="{'selectionne': couleur === 'blanc'}" role="button" tabindex="0" @click="couleur = 'blanc'" />
							<span class="gris" :class="{'selectionne': couleur === 'gris'}" role="button" tabindex="0" @click="couleur = 'gris'" />
							<span class="vert" :class="{'selectionne': couleur === 'vert'}" role="button" tabindex="0" @click="couleur = 'vert'" />
							<span class="bleu" :class="{'selectionne': couleur === 'bleu'}" role="button" tabindex="0" @click="couleur = 'bleu'" />
							<span class="jaune" :class="{'selectionne': couleur === 'jaune'}" role="button" tabindex="0" @click="couleur = 'jaune'" />
							<span class="rouge" :class="{'selectionne': couleur === 'rouge'}" role="button" tabindex="0" @click="couleur = 'rouge'" />
							<span class="transparent" :class="{'selectionne': couleur === 'transparent'}" role="button" tabindex="0" @click="couleur = 'transparent'" />
						</div>
					</div>
					<span class="bouton" role="button" tabindex="0" @click="generer">{{ $t('valider') }}</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'MGrille',
	data () {
		return {
			colonnes: 2,
			lignes: 1,
			couleur: 'blanc'
		}
	},
	methods: {
		generer () {
			if (this.colonnes >= 2 && this.colonnes <= 5 && this.lignes >= 1 && this.lignes <= 5) {
				this.$parent.pages[this.$parent.page - 1].grille = { colonnes: this.colonnes, lignes: this.lignes, couleur: this.couleur }
				this.$parent.fermerModale()
			}
		}
	}
}
</script>

<style>
.modale-grille .grille {
	display: flex;
    justify-content: space-evenly;
    margin-bottom: 2rem;
}

.modale-grille .couleurs {
	display: flex;
    justify-content: space-evenly;
}

.modale-grille .couleurs span {
	display: inline-block;
	width: 4rem;
	height: 4rem;
	border: 2px solid #aaa;
	border-radius: 50%;
	cursor: pointer;
}

.modale-grille .couleurs span.selectionne {
	border: 0.4rem solid #444;
}

.modale-grille .couleurs span.gris {
	background: #ddd;
}

.modale-grille .couleurs span.bleu {
	background: #97fdff;
}

.modale-grille .couleurs span.vert {
	background: #9ffbc9;
}

.modale-grille .couleurs span.jaune {
	background: #eeec8e;
}

.modale-grille .couleurs span.rouge {
	background: #fcbcc9;
}

.modale-grille .couleurs span.transparent {
	background-image: url('@/assets/img/transparent.png');
	background-repeat: no-repeat;
	background-size: cover;
	background-position: center;
}
</style>
