# Digiscreen

Digiscreen est un fond d'écran interactif pour la classe en présence ou à distance. 

L'application est publiée sous licence GNU AGPLv3.
Sauf les fontes Abril Fat Face, Orbitron et Material Icons (Apache License Version 2.0) et la fonte HKGrotesk (Sil Open Font Licence 1.1)

Les symboles pictographiques utilisés dans le module Histoire sont la propriété du Gouvernement d'Aragon et ont été créés par Sergio Palao pour ARASAAC (https://arasaac.org), qui les distribuent sous Licence Creative Commons BY-NC-SA 4.0.

Les émojis utilisés dans le module Rétroaction proviennent du projet OpenMoji (https://openmoji.org) et sont publiés sous Licence Creative Commons BY-SA 4.0.

### Préparation et installation des dépendances
```
npm install
```

### Lancement du serveur de développement
```
npm run dev
```

### Compilation et minification des fichiers
```
npm run build
```

### Variables d'environnement (fichier .env à créer à la racine avant compilation)
```
VITE_GOOGLE_API_KEY (clé API Google pour Youtube)
VITE_PIXABAY_API_KEY (clé API Pixabay)
```

### Serveur PHP nécessaire pour l'API
```
php -S 127.0.0.1:8000 (pour le développement uniquement)
```

### Production
Le dossier dist peut être déployé directement sur un serveur PHP. Cette version compilée n'intègre pas les clés API Pixabay et Google pour YouTube.

### Démo
https://ladigitale.dev/digiscreen/

### Remerciements et crédits
Traduction en italien par Paolo Mauri (https://gitlab.com/maupao) et Roberto Marcolin (nilocram)

Traduction en espagnol par Fernando S. Delgado Trujillo (https://gitlab.com/fersdt)

Traduction en néerlandais par Erik Devlies

Traduction en allemand lors d'une action dans « la salle des profs » [#twitterlehrerzimmer](https://twitter.com/search?q=%23twitterlehrerzimmer) / [#twlz](https://twitter.com/search?q=%23twlz) par [@uivens](https://twitter.com/uivens) (Ulrich Ivens), [@eBildungslabor](https://twitter.com/eBildungslabor) (Nele Hirsch) et [@teachitalizer](https://twitter.com/teachitalizer) (Holger Skarba)

Traduction en croate par Ksenija Lekić (https://gitlab.com/Ksenija66L)

### Soutien
https://opencollective.com/ladigitale

