/**
 * Français (fr)
 */

export default {
  code: {
    copy: 'Copier le code',
    copied: 'Copié',
    copyError: 'Échec de la copie',
    maximize: 'Afficher en plein écran',
    restore: 'Restaurer l’affichage',
    preview: 'Aperçu dans une nouvelle fenêtre'
  },
  colorpicker: {
    clear: 'Effacer',
    confirm: 'OK'
  },
  dropdown: {
    noData: 'Aucune donnée disponible'
  },
  flow: {
    loadMore: 'Charger plus',
    noMore: 'Plus de données'
  },
  form: {
    select: {
      noData: 'Aucune donnée disponible',
      noMatch: 'Aucune correspondance',
      placeholder: 'Veuillez sélectionner'
    },
    validateMessages: {
      required: 'Ce champ est obligatoire',
      phone: 'Numéro de téléphone invalide',
      email: 'Adresse e-mail invalide',
      url: 'URL invalide',
      number: 'Uniquement des chiffres',
      date: 'Format de date invalide',
      identity: 'Numéro d’identification invalide'
    },
    verifyErrorPromptTitle: 'Avertissement'
  },
  layer: {
    confirm: 'Confirmer',
    cancel: 'Annuler',
    defaultTitle: 'Information',
    prompt: {
      InputLengthPrompt: 'Maximum {length} caractères'
    },
    photos: {
      noData: 'Aucune image',
      tools: {
        rotate: 'Faire pivoter',
        scaleX: 'Inverser horizontalement',
        zoomIn: 'Agrandir',
        zoomOut: 'Réduire',
        reset: 'Réinitialiser',
        close: 'Fermer'
      },
      viewPicture: 'Voir l’image originale',
      urlError: {
        prompt: 'L’adresse de l’image est invalide<br>Continuer avec la suivante ?',
        confirm: 'Suivante',
        cancel: 'Annuler'
      }
    }
  },
  laypage: {
    prev: 'Page précédente',
    next: 'Page suivante',
    first: 'Première',
    last: 'Dernière',
    total: 'Total {total} éléments',
    pagesize: 'éléments/page',
    goto: 'Aller à',
    page: 'page',
    confirm: 'Confirmer'
  },
  table: {
    sort: {
      asc: 'Croissant',
      desc: 'Décroissant'
    },
    noData: 'Aucune donnée',
    tools: {
      filter: {
        title: 'Filtrer les colonnes'
      },
      export: {
        title: 'Exporter',
        noDataPrompt: 'Aucune donnée à exporter',
        compatPrompt: 'L’exportation n’est pas supportée par IE, veuillez utiliser Chrome ou un autre navigateur moderne',
        csvText: 'Exporter au format CSV'
      },
      print: {
        title: 'Imprimer',
        noDataPrompt: 'Aucune donnée à imprimer'
      }
    },
    dataFormatError: 'Les données retournées sont invalides. Le code de réussite attendu est : "{statusName}": {statusCode}',
    xhrError: 'Erreur de requête : {msg}'
  },
  transfer: {
    noData: 'Aucune donnée',
    noMatch: 'Aucune correspondance',
    title: ['Liste 1', 'Liste 2'],
    searchPlaceholder: 'Recherche par mot-clé'
  },
  tree: {
    defaultNodeName: 'Sans nom',
    noData: 'Aucune donnée',
    deleteNodePrompt: 'Confirmer la suppression du nœud "{name}" ?'
  },
  upload: {
    fileType: {
      file: 'Fichier',
      image: 'Image',
      video: 'Vidéo',
      audio: 'Audio'
    },
    validateMessages: {
      fileExtensionError: 'Le {fileType} sélectionné contient un format non supporté',
      filesOverLengthLimit: 'Nombre maximum de fichiers : {length}',
      currentFilesLength: 'Vous avez sélectionné {length} fichiers',
      fileOverSizeLimit: 'La taille du fichier ne doit pas dépasser {size}'
    },
    chooseText: '{length} fichiers'
  },
  util: {
    timeAgo: {
      days: 'il y a {days} jours',
      hours: 'il y a {hours} heures',
      minutes: 'il y a {minutes} minutes',
      future: 'Futur',
      justNow: 'À l’instant'
    },
    toDateString: {
      meridiem: function(hours, minutes){
        var hm = hours * 100 + minutes;
        if (hm < 600) {
          return 'Tôt le matin';
        } else if (hm < 900) {
          return 'Matin';
        } else if (hm < 1100) {
          return 'Avant-midi';
        } else if (hm < 1300) {
          return 'Midi';
        } else if (hm < 1800) {
          return 'Après-midi';
        }
        return 'Soir';
      }
    }
  }
};
