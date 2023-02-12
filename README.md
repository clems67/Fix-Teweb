L'extention "fix teweb" a pour objectif de faciliter la saisie des codes BU et des choix des projects.

Pour activer l'extension :
les "3 dots" => more tools => extensions => active Developer mode => load unpaked => select folder with every files

Pour ajouter ses BU favoris :
va dans le fichier "data_bu.html" => sélectionne le bu qui t'intéresse et copie tout le champ option => colle-le dans popup.html puis dans <select id="BUnb">

Pour ajouter ses projets favoris :
ajoute une activité dans TeWeb => sélectionne un bu => inspecteur (click droit "inspect" "Elements") => recherche le champ manuellement
(form => containerwrap => container => continue de chercher)

Info pour comprendre le code :
Les interactions dans popup.html sont traités dans le popup.js et les infos sont envoyées vers le main.js pour qu'il puisse modifier la page html de l'utilisateur.
Pour voir la console du popup il faut click-droit dans le popup et inspect.
