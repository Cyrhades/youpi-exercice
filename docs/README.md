# Documentations

Dans ce dossier, vous trouverez les différents fichiers de documentation (.md) qui seront utilisés pour générer les différentes archives du projet.

## Fichiers générés

| Nom du fichier 	| Description 	|
|------------------------	|-------------------------------------------------------------------------------------------------------------------------------------	|
| *enonce-easy.md* 	| L'énoncé classique, qui contiendra un maximum d'information afin de guider les élèves en difficulté 	|
| *enonce-medium.md* 	| L'énoncé intermédiaire, qui contiendra les instructions classiques, ainsi qu'une suggestion de méthodologie 	|
| *enonce-hard.md* 	| L'énoncé plus difficile, pour les élèves qui recherchent un challenge ! Il ne contient que l'énoncé, l'élève doit se débrouiller ;) 	|
| *enonce-sup-X.md* 	| Les énoncés d'exercices supplémentaires', par exemple : <ul><li>*enonce-sup-1.md*</li><li>*enonce-sup-2.md*</li><li>*enonce-sup-3.md*</li></ul> 	|
| *correction-step-X.md* 	| Les corrections partielles, le numéro varie à chaque étape, par exemple :   <ul><li>*correction-step-1.md*</li><li>*correction-step-2.md*</li></ul> 	|
| *correction.md* 	| Le corrigé complet 	|
| *correction-sup-X.md* 	| Les corrigés des exercices supplémentaires 	|
| *prof.md* 	| Les notions à aborder par le professeur au cours de l'exercice 	|

## Morcellage des énoncés

Afin d'éviter les répétitions et de faciliter la maintenance, les énoncés ne seront pas stockés tels quels, mais générés à partir de morceaux d'énoncés.

Ces morceaux seront assemblés en fonction des besoins (totalité pour énoncé facile, très réduit pour énoncé difficile, etc.)

Je recommande le morcellage suivant :

### Introduction

Elle comprend le résumé de l'exercice, que doit on produire, en 3 lignes maximum.

### Énoncé

Listage des différentes technologies utilisées, ainsi que les rôles quelles vont remplir.

### Méthodologie

Il s'agit ici de fournir un déroulé théorique de l'exercice.
L'ordre dans lequel nous recommandons d'aborder l'exercice (quelle techno en premier, puis priorisation des tâches, etc.)

### Recommandations / Attention

Lister les points importants de blocage ; par exemple PHP doit être lancé depuis un serveur local, en AJAX faire attention aux CORS, etc.

### Illustrations

Images d'inspiration (si pas de visuel) & rendu final du programme à créer

### Ressources

Explication du dossier assets/, et fourniture de la liste des ressources en ligne s'il y a :
- Noms des polices à utiliser
- Codes des icônes font-awesome
- etc.

### Théorie

Découverte des nouvelles technologies et/ou des nouvelles notions vues au cours de l'exercice

#### Liens recommandés

Cette partie pourra également contenir des liens recommandés, à aller voir en dehors des cours si la techno interesse les élèves

### Exercices supplémentaires

Contenus supplémentaires, pour les élèves les plus en avance.
Egalement proposés aux autres élèves s'il souhaite approfondir l'exercice en dehors de la formation

### Culture

Exemples d'utilisation, divers

## Exemple d'exercice

.. qui ressemble à cette mise en forme

http://blog.masamune.fr/3wa-exercice-js3-ajax/

## Recommandations

N'hésitez pas à utiliser des aides pour réaliser vos Markdown
- [Cheat sheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)
- [Générateur de tables](https://www.tablesgenerator.com/markdown_tables)
