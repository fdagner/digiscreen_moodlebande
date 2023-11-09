<template>
	<div class="conteneur-modale">
		<div class="modale">
			<header>
				<span class="titre">{{ $t('aProposDigiscreen') }}</span>
				<span class="fermer" role="button" tabindex="0" @click="$parent.fermerModale"><i class="material-icons">close</i></span>
			</header>
			<div class="conteneur">
				<div class="contenu">
					<p><b>Digiscreen</b> {{ $t('digiscreen') }} <span><a href="https://ladigitale.dev/" target="_blank" rel="noreferrer"><u><b>La Digitale</b></u></a></span>.</p>
					<p class="contact">{{ $t('contact') }} <a href="https://ladigitale.dev/emmanuel-zimmert.html" target="_blank" rel="noreferrer">Emmanuel ZIMMERT</a> // ez[at]ladigitale.dev</p>
					<p><a href="https://opencollective.com/ladigitale" target="_blank" rel="noreferrer">{{ $t('soutien') }}</a></p>
					<p class="credits">{{ new Date().getFullYear() }} - <a href="https://ladigitale.dev" target="_blank" rel="noreferrer">La Digitale</a> - <a href="https://codeberg.org/ladigitale/digiscreen" target="_blank" rel="noreferrer">{{ $t('codeSource') }}</a> - <a href="https://codeberg.org/ladigitale/digiscreen/releases" target="_blank" rel="noreferrer">v{{ version }}</a> - <span class="hub" @click="ouvrirHub"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#001d1d" width="36px" height="36px"><path d="M0 0h24v24H0z" fill="none"/><path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z"/></svg></span></p>
				</div>
			</div>
		</div>
		<div id="hub" :class="{'ouvert': hub}">
			<span @click="fermerHub"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fff" width="36px" height="36px"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg></span>
			<iframe src="https://ladigitale.dev/hub.html"></iframe>
		</div>
	</div>
</template>

<script>
export default {
	name: 'MInfo',
	data () {
		return {
			hub: false,
			version: app_version
		}
	},
	methods: {
		ouvrirHub () {
			this.hub = true
		},
		fermerHub () {
			this.hub = false
		}
	}
}
</script>

<style scoped>
p.credits {
	display: flex;
	justify-content: center;
	align-items: center;
}

p.credits a {
	margin: 0 5px;
}

p.credits .hub {
	font-size: 0;
	cursor: pointer;
}

#hub {
	position: fixed;
	visibility: hidden;
	opacity: 0;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
	z-index: 100000;
}

#hub.ouvert {
	visibility: visible;
	opacity: 1;
    animation: fonduEntrant linear 0.1s;
}

#hub iframe {
	width: 100%;
    height: 100%;
}

#hub span {
	font-size: 0;
	color: #fff;
	position: absolute;
	top: 15px;
	right: 15px;
	cursor: pointer;
}

@media screen and (max-width: 599px) {
	#hub span {
		top: 5px;
		right: 5px;
	}
	
	#hub span svg {
		width: 24px;
		height: 24px;
	}
}
</style>
