const GConf = {

    //soketLink : 'https://api.system.ansl.tn/API',
    ApiLink : 'https://api.system.ansl.tn/API/kallax', //https://api.system.ansl.tn/API/ 
    themeColor : '#139beb',
    //UserData : GetUID(),
    //ProfData : GetPID(),
    //defaultPos: GetDefaultPosition(),

    proffListe : [
      {id:1, colL: 4 , width:'30%',  color:'#e3ebfc', tag:'Plombier',  link:'Plombier', genre:'Plombier', text:'Plombier', imageSrc:'Plombier.gif'},
      {id:2, colL: 4 , width:'30%',  color:'#e3ebfc', tag:'Électricien',  link:'Électricien', genre:'Électricien', text:'Électricien', imageSrc:'Électricien.gif'},
      {id:3, colL: 4 , width:'30%',  color:'#e3ebfc', tag:'Serrurier',  link:'Serrurier', genre:'Serrurier', text:'Serrurier', imageSrc:'Serrurier.gif'},
      {id:4, colL: 4 , width:'30%',  color:'#e3ebfc', tag:'Chauffagiste',  link:'Chauffagiste', genre:'Chauffagiste', text:'Chauffagiste', imageSrc:'Chauffagiste.gif'},
      {id:5, colL: 4 , width:'30%',  color:'#e3ebfc', tag:'Vitrier',  link:'Vitrier', genre:'Vitrier', text:'Vitrier', imageSrc:'Vitrier.gif'},
      {id:6, colL: 4 , width:'30%',  color:'#e3ebfc', tag:'Jardinier',  link:'Jardinier', genre:'Jardinier', text:'Jardinier', imageSrc:'Jardinier.gif'},
      {id:7, colL: 6 , width:'47%',  color:'#e3ebfc', tag:'Couvreur',  link:'Couvreur', genre:'Couvreur', text:'Femme de Ménage', imageSrc:'femme-de-menage.gif'},
      {id:8, colL: 6 , width:'47%',   color:'#e3ebfc', tag:'Peinture',  link:'Peinture', genre:'Peinture', text:'Garde Enfant', imageSrc:'garde-enfant.gif'},
    ],

    profTags : {
        Électricien : [
            {
              id: 1,
              text: 'Panne électrique inconnue',
              value: 'panne-electrique-inconnue',
              description: [
                'Dépannage rapide',
                'Analyse approfondie',
                'Réparation spécialisée',
                'Diagnostic précis',
                'Intervention 24/7'
              ],
              photo: 'reparation-remplacement-prises-interrupteurs.png'
            },
            {
              id: 2,
              text: 'Recherche de panne électrique',
              value: 'recherche-panne-electrique',
              description: [
                'Inspection minutieuse',
                'Identification précise',
                'Réparation spécialisée',
                'Diagnostic rapide',
                'Service d\'urgence'
              ],
              photo: 'depannage-electrique.jpg'
            },
            {
              id: 3,
              text: 'Réparation de prise murale',
              value: 'reparation-prise-murale',
              description: [
                'Remplacement',
                'Remise aux normes'
              ],
              photo: 'installation-electrique.png'
            },
            {
              id: 4,
              text: 'Autres',
              value: 'autres',
              description: [
                'Installation de nouveaux circuits électriques',
                'Réparation de disjoncteurs',
                'Vérification de la mise à la terre',
                'Remplacement de luminaires',
                'Installation de prises spécifiques'
              ],
              photo: 'maintenance-electrique-preventive.jpg'
            }
        ],
        Plombier:[
            {
              id: 1,
              text: 'Fuite Tuyau',
              value: 'reparation-fuites-eau',
              description: [
                'Réparation de fuites de tuyaux',
                'Réparation de fuites de robinets',
                'Réparation de fuites de chauffe-eau'
              ],
              photo: 'reparation-canalisation-endommagee.jpg'
            },
            {
              id: 2,
              text: 'Débouchage WC',
              value: 'debouchage-wc',
              description: [
                'Débouchage mécanique',
                'Débouchage chimique',
                'Hydrojetting',
                'Inspection par caméra',
                'Réparation de tuyaux',
                'Entretien préventif'
              ],
              photo: 'installation-robinetterie.jpg'
            },
            {
              id: 3,
              text: 'Réparation Ballon d\'eau Chaude',
              value: 'reparation-ballon-eau-chaude',
              description: [
                'Réparation de ballon d\'eau chaude',
                'Remplacement de résistance',
                'Entretien annuel',
                'Installation de nouveaux ballons',
                'Diagnostic de panne'
              ],
              photo: 'reparation-remplacement-chauffe-eau.png'
            },
            {
              id: 3,
              text: 'Autres',
              value: 'autres-plomberie',
              description: [
                'Installation de nouveaux équipements sanitaires',
                'Réparation de fuites dans les canalisations extérieures',
                'Installation de systèmes de filtration d\'eau',
                'Réparation de fuites dans les piscines',
                'Détection et réparation de fuites souterraines'
              ],
              photo: 'installation-systeme-assainissement.jpg'
            }
        ],
        Serrurier:[
            {
              id: 1,
              text: 'Ouverture porte simple fermée à clé',
              value: 'ouverture-portes',
              description: [
                'Ouverture de porte claquée',
                'Ouverture de porte verrouillée',
                'Ouverture de porte normale'
              ],
              photo: 'ouverture-portes.png'
            },
            {
              id: 2,
              text: 'Ouverture porte blindée fermée à clé',
              value: 'installation-serrures',
              description: [
                'Installation de serrures de sécurité',
                'Renforcement de porte',
                'Installation de porte blindée'
              ],
              photo: ''
            },
            {
              id: 3,
              text: 'Ouverture porte simple claquée',
              value: 'reparation-serrures',
              description: [
                'Réparation et ajustement de serrures',
                'Remplacement de cylindre de serrure',
                'Installation de verrous supplémentaires'
              ],
              photo: ''
            },
            {
              id: 4,
              text: 'Autres',
              value: 'autres-serrurier',
              description: [
                'Duplication de clés',
                'Réparation de mécanisme de fermeture',
                'Installation de systèmes de contrôle d\'accès',
                'Ouverture de coffres-forts',
                'Installation de volets roulants'
              ],
              photo: ''
            }
        ],
        Chauffagiste:[
            {
              id: 1,
              text: 'Réparation Chaudière Gaz',
              value: 'installation-systemes-chauffage',
              description: [
                'Installation de chaudière gaz',
                'Installation de chauffage central',
                'Installation de radiateurs'
              ],
              photo: ''
            },
            {
              id: 2,
              text: 'Entretien Chaudière gaz',
              value: 'reparation-chaudieres',
              description: [
                'Entretien préventif',
                'Contrôle de sécurité',
                'Nettoyage des brûleurs'
              ],
              photo: ''
            },
            {
              id: 3,
              text: 'Réparation Chaudière Fioul',
              value: 'entretien-chaudieres',
              description: [
                'Réparation de chaudière fioul',
                'Remplacement de pièces défectueuses',
                'Réglage du brûleur'
              ],
              photo: ''
            },
            {
              id: 4,
              text: 'Autres',
              value: 'autres-chauffagiste',
              description: [
                'Installation de pompes à chaleur',
                'Installation de planchers chauffants',
                'Réparation de radiateurs électriques',
                'Conversion de systèmes de chauffage'
              ],
              photo: ''
            }
        ],
        Vitrier:[
            {
              id: 1,
              text: 'Changement de vitre cassée double vitrage',
              value: 'remplacement-vitres-cassees',
              description: [
                'Remplacement de vitre double vitrage',
                'Réparation de fenêtre double vitrage',
                'Installation de double vitrage'
              ],
              photo: ''
            },
            {
              id: 2,
              text: 'Changement de vitre cassée simple vitrage',
              value: 'reparation-fenetres-endommagees',
              description: [
                'Réparation de vitre simple vitrage',
                'Réparation de fenêtre simple vitrage',
                'Installation de vitre simple vitrage'
              ],
              photo: ''
            },
            {
              id: 3,
              text: 'Remplacement d\'une vitre fissurée',
              value: 'installation-vitrages',
              description: [
                'Installation de vitrage pour fenêtre',
                'Installation de vitrage pour porte',
                'Installation de vitrage pour véranda'
              ],
              photo: ''
            },
            {
              id: 4,
              text: 'Autres',
              value: 'autres-vitrier',
              description: [
                'Installation de miroirs sur mesure',
                'Réparation de verrières',
                'Installation de vitrage pour meubles',
                'Vitrification de parquets',
                'Installation de films de protection solaire'
              ],
              photo: ''
            }
        ],
        Jardinier:[
            {
              id: 1,
              text: 'Désherbage et nettoyage rapide',
              value: 'tonte-pelouse',
              description: [
                'Tonte de pelouse',
                'Désherbage des massifs',
                'Nettoyage des allées'
              ],
              photo: ''
            },
            {
              id: 2,
              text: 'Tailler en urgence les arbres et les arbustes',
              value: 'taille-arbustes-haies',
              description: [
                'Taille d\'arbustes',
                'Taille de haies',
                'Élagage d\'arbres'
              ],
              photo: ''
            },
            {
              id: 3,
              text: 'Traiter les maladies des plantes en urgence',
              value: 'entretien-parterres-fleurs',
              description: [
                'Traitement des maladies des plantes',
                'Fertilisation des parterres de fleurs',
                'Arrosage régulier'
              ],
              photo: ''
            },
            {
              id: 4,
              text: 'Autres',
              value: 'autres-jardinier',
              description: [
                'Aménagement paysager',
                'Installation de système d\'irrigation',
                'Entretien de potagers',
                'Plantation d\'arbres et de fleurs',
                'Taille d\'arbres fruitiers'
              ],
              photo: ''
            }
        ],
        Couvreur:[
            {
              id: 1,
              text: 'Nettoyage régulier des espaces de vie',
              value: 'nettoyage-espaces-vie',
              description: [
                'Nettoyage des sols',
                'Poussière et surfaces',
                'Nettoyage des sanitaires'
              ],
              photo: ''
            },
            {
              id: 2,
              text: 'Nettoyage de printemps complet',
              value: 'nettoyage-printemps',
              description: [
                'Nettoyage des fenêtres',
                'Nettoyage des meubles',
                'Nettoyage des tapis'
              ],
              photo: ''
            },
            {
              id: 3,
              text: 'Nettoyage après déménagement',
              value: 'nettoyage-demenagement',
              description: [
                'Nettoyage des sols',
                'Nettoyage des placards',
                'Nettoyage des appareils électroménagers'
              ],
              photo: ''
            },
            {
              id: 4,
              text: 'Autres',
              value: 'autres-femme-menage',
              description: [
                'Nettoyage de dernière minute',
                'Nettoyage de locaux professionnels',
                'Nettoyage en cas d\'urgence familiale'
              ],
              photo: ''
            }
        ],
        Peinture:[
            {
              id: 1,
              text: 'Garde occasionnelle',
              value: 'garde-occasionnelle',
              description: [
                'Surveillance des enfants',
                'Jeux et activités',
                'Préparation des repas'
              ],
              photo: ''
            },
            {
              id: 2,
              text: 'Garde régulière',
              value: 'garde-reguliere',
              description: [
                'Aide aux devoirs',
                'Promenades à l\'extérieur',
                'Bain et mise au lit'
              ],
              photo: ''
            },
            {
              id: 3,
              text: 'Garde d\'urgence',
              value: 'garde-urgence',
              description: [
                'Garde de nuit en cas d\'urgence',
                'Garde en cas de maladie de l\'enfant',
                'Garde en cas d\'imprévu familial'
              ],
              photo: ''
            },
            {
              id: 4,
              text: 'Autres',
              value: 'autres-baby-sitter',
              description: [
                'Accompagnement aux activités extrascolaires',
                'Garde partagée',
                'Garde pendant les événements spéciaux'
              ],
              photo: ''
            }
        ] 
    },
    profSousTag:{
        "refection-charpentes-old" : [
                {
                    id: 1,
                    text: "Diagnostic de l'état de la charpente",
                    value: "refection-charpentes",
                    desc: "Inspection approfondie de la charpente pour évaluer son état, identifier les dommages éventuels et déterminer les travaux nécessaires."
                },
                {
                    id: 2,
                    text: "Remplacement des éléments endommagés",
                    value: "refection-charpentes",
                    desc: "Remplacement des pièces de la charpente qui sont endommagées ou pourries, telles que les poutres, les chevrons ou les liteaux."
                },
                {
                    id: 3,
                    text: "Renforcement de la structure",
                    value: "refection-charpentes",
                    desc: "Renforcement de la charpente en ajoutant des éléments structurels supplémentaires pour améliorer sa solidité et sa stabilité."
                },
                {
                    id: 4,
                    text: "Traitement contre les insectes et les champignons",
                    value: "refection-charpentes",
                    desc: "Application de traitements préventifs ou curatifs contre les insectes xylophages et les champignons qui peuvent endommager la charpente."
                },
                {
                    id: 5,
                    text: "Réparation des assemblages",
                    value: "refection-charpentes",
                    desc: "Réparation ou renforcement des assemblages de la charpente, tels que les tenons et les mortaises, pour assurer leur solidité."
                },
                {
                    id: 6,
                    text: "Isolation thermique et phonique",
                    value: "refection-charpentes",
                    desc: "Installation d'isolants thermiques et phoniques entre les éléments de la charpente pour améliorer le confort thermique et acoustique."
                },
                {
                    id: 7,
                    text: "Étanchéité de la toiture",
                    value: "refection-charpentes",
                    desc: "Vérification et réparation de l'étanchéité de la toiture pour prévenir les infiltrations d'eau et protéger la charpente contre l'humidité."
                },
                {
                    id: 8,
                    text: "Amélioration de la ventilation",
                    value: "refection-charpentes",
                    desc: "Installation de dispositifs de ventilation pour assurer une circulation d'air adéquate dans l'espace sous-toiture et prévenir les problèmes d'humidité."
                },
                {
                    id: 9,
                    text: "Protection contre les incendies",
                    value: "refection-charpentes",
                    desc: "Application de revêtements ou de produits ignifuges pour protéger la charpente contre les risques d'incendie."
                },
                {
                    id: 10,
                    text: "Peinture ou finition",
                    value: "refection-charpentes",
                    desc: "Finition esthétique de la charpente avec une peinture protectrice ou un revêtement décoratif pour améliorer son apparence et sa durabilité."
                }
            
        ],
        "depannage-systemes-chauffage" : [
            {
                id: 1,
                text: "Diagnostic de panne",
                value: "depannage-systemes-chauffage",
                desc: "Analyse de la panne du système de chauffage pour identifier la cause sous-jacente du dysfonctionnement."
            },
            {
                id: 2,
                text: "Réparation des équipements",
                value: "depannage-systemes-chauffage",
                desc: "Réparation des composants défectueux ou endommagés du système de chauffage pour restaurer son bon fonctionnement."
            },
            {
                id: 3,
                text: "Entretien préventif",
                value: "depannage-systemes-chauffage",
                desc: "Révision périodique du système de chauffage pour détecter et prévenir les pannes potentielles avant qu'elles ne surviennent."
            },
            {
                id: 4,
                text: "Désembouage des radiateurs",
                value: "depannage-systemes-chauffage",
                desc: "Nettoyage des circuits de chauffage pour éliminer les dépôts de boue et améliorer l'efficacité de la circulation de l'eau."
            },
            {
                id: 5,
                text: "Remplacement des pièces défectueuses",
                value: "depannage-systemes-chauffage",
                desc: "Remplacement des pièces usées ou défectueuses du système de chauffage pour restaurer sa performance."
            },
            {
                id: 6,
                text: "Réglage et optimisation",
                value: "depannage-systemes-chauffage",
                desc: "Ajustement des paramètres du système de chauffage pour optimiser son efficacité énergétique et sa performance."
            },
            {
                id: 7,
                text: "Dépannage des chaudières",
                value: "depannage-systemes-chauffage",
                desc: "Intervention spécialisée pour diagnostiquer et réparer les problèmes de fonctionnement des chaudières."
            },
            {
                id: 8,
                text: "Réparation des fuites",
                value: "depannage-systemes-chauffage",
                desc: "Localisation et réparation des fuites dans le circuit de chauffage pour éviter les pertes de chaleur et les dommages."
            },
            {
                id: 9,
                text: "Purge des radiateurs",
                value: "depannage-systemes-chauffage",
                desc: "Élimination de l'air emprisonné dans les radiateurs pour assurer un chauffage uniforme dans tout le système."
            },
            {
                id: 10,
                text: "Diagnostic des problèmes de circulation",
                value: "depannage-systemes-chauffage",
                desc: "Identification et résolution des problèmes de circulation d'eau dans le système de chauffage pour assurer un chauffage efficace."
            }
        ],
        "refection-charpentes" : [
            {
              id: 1,
              text: 'Débouchage mécanique',
              value: 'Débouchage',
              desc: 'Utilisation de techniques manuelles pour déloger les obstructions.'
            },
            {
              id: 2,
              text: 'Débouchage chimique',
              value: 'Débouchage',
              desc: 'Utilisation de produits chimiques pour dissoudre les obstructions.'
            },
            {
              id: 3,
              text: 'Hydrojetting',
              value: 'Débouchage',
              desc: 'Utilisation d\'un jet d\'eau à haute pression pour nettoyer les tuyaux.'
            },
            {
              id: 4,
              text: 'Inspection par caméra',
              value: 'Débouchage',
              desc: 'Utilisation de caméras pour localiser précisément l\'obstruction.'
            },
            {
              id: 5,
              text: 'Réparation de tuyaux',
              value: 'Débouchage',
              desc: 'Service pour remplacer ou réparer les parties endommagées des tuyaux.'
            },
            {
              id: 6,
              text: 'Entretien préventif',
              value: 'Débouchage',
              desc: 'Programme de maintenance pour éviter les obstructions futures.'
            },
            {
              id: 7,
              text: 'Remplacement des toilettes',
              value: 'Débouchage',
              desc: 'Service de remplacement des toilettes anciennes ou endommagées.'
            }
        ]
        
    },

}
 
export default GConf 