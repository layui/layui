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
    preview: 'Aperçu dans une nouvelle fenêtre',
  },
  colorpicker: {
    clear: 'Effacer',
    confirm: 'OK',
  },
  dropdown: {
    noData: 'Aucune donnée disponible',
  },
  flow: {
    loadMore: 'Charger plus',
    noMore: 'Plus de données',
  },
  form: {
    select: {
      noData: 'Aucune donnée disponible',
      noMatch: 'Aucune correspondance',
      placeholder: 'Veuillez sélectionner',
    },
    validateMessages: {
      required: 'Ce champ est obligatoire',
      phone: 'Numéro de téléphone invalide',
      email: 'Adresse e-mail invalide',
      url: 'URL invalide',
      number: 'Uniquement des chiffres',
      date: 'Format de date invalide',
      identity: 'Numéro d’identification invalide',
    },
    verifyErrorPromptTitle: 'Avertissement',
  },
  laydate: {
    months: [
      'Janv',
      'Févr',
      'Mars',
      'Avr',
      'Mai',
      'Juin',
      'Juil',
      'Août',
      'Sept',
      'Oct',
      'Nov',
      'Déc',
    ],
    weeks: ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'],
    time: ['Heure', 'Minute', 'Seconde'],
    literal: {
      year: '',
    },
    selectDate: 'Sélec. date',
    selectTime: 'Sélec. heure',
    startTime: 'Heure de début',
    endTime: 'Heure de fin',
    // Recommandé en version abrégée en raison de l’espace limité du composant
    tools: {
      confirm: 'OK',
      clear: 'Eff.',
      now: 'Ajd.',
      reset: 'Réinit.',
    },
    rangeOrderPrompt:
      'L’heure de fin ne peut pas être antérieure à l’heure de début\nVeuillez recommencer',
    invalidDatePrompt: 'Date ou heure hors plage valide\n',
    formatErrorPrompt:
      'Format de date invalide\nLe format attendu est :\n{format}\n',
    autoResetPrompt: 'Il a été réinitialisé pour vous',
    preview: 'Résultat sélectionné actuel',
  },
  layer: {
    confirm: 'Confirmer',
    cancel: 'Annuler',
    defaultTitle: 'Information',
    prompt: {
      InputLengthPrompt: 'Maximum {length} caractères',
    },
    photos: {
      noData: 'Aucune image',
      tools: {
        rotate: 'Faire pivoter',
        scaleX: 'Inverser horizontalement',
        zoomIn: 'Agrandir',
        zoomOut: 'Réduire',
        reset: 'Réinitialiser',
        close: 'Fermer',
      },
      viewPicture: 'Voir l’image originale',
      urlError: {
        prompt:
          'L’adresse de l’image est invalide,\nContinuer avec la suivante ?',
        confirm: 'Suivante',
        cancel: 'Annuler',
      },
    },
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
    confirm: 'Confirmer',
  },
  table: {
    sort: {
      asc: 'Croissant',
      desc: 'Décroissant',
    },
    noData: 'Aucune donnée',
    tools: {
      filter: {
        title: 'Filtrer les colonnes',
      },
      export: {
        title: 'Exporter',
        noDataPrompt: 'Aucune donnée à exporter',
        compatPrompt:
          'L’exportation n’est pas supportée par IE, veuillez utiliser Chrome ou un autre navigateur moderne',
        csvText: 'Exporter au format CSV',
      },
      print: {
        title: 'Imprimer',
        noDataPrompt: 'Aucune donnée à imprimer',
      },
    },
    dataFormatError:
      'Les données retournées sont invalides. Le code de réussite attendu est : "{statusName}": {statusCode}',
    xhrError: 'Erreur de requête : {msg}',
  },
  transfer: {
    noData: 'Aucune donnée',
    noMatch: 'Aucune correspondance',
    title: ['Liste 1', 'Liste 2'],
    searchPlaceholder: 'Recherche par mot-clé',
  },
  tree: {
    defaultNodeName: 'Sans nom',
    noData: 'Aucune donnée',
    deleteNodePrompt: 'Confirmer la suppression du nœud "{name}" ?',
  },
  upload: {
    fileType: {
      file: 'Fichier',
      image: 'Image',
      video: 'Vidéo',
      audio: 'Audio',
    },
    validateMessages: {
      fileExtensionError:
        'Le {fileType} sélectionné contient un format non supporté',
      filesOverLengthLimit: 'Nombre maximum de fichiers : {length}',
      currentFilesLength: 'Vous avez sélectionné {length} fichiers',
      fileOverSizeLimit: 'La taille du fichier ne doit pas dépasser {size}',
    },
    chooseText: '{length} fichiers',
  },
  util: {
    timeAgo: {
      days: 'il y a {days} jours',
      hours: 'il y a {hours} heures',
      minutes: 'il y a {minutes} minutes',
      future: 'Futur',
      justNow: 'À l’instant',
    },
    toDateString: {
      meridiem: (hours, minutes) => (hours < 12 ? 'AM' : 'PM'),
    },
  },
};
