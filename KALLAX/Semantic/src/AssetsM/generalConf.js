const GetUID = () =>{
    const UserLoggedIn = (localStorage.getItem('UserIsLogged') !== null);
    if (UserLoggedIn)  { 
        return {Logged:true, UData : JSON.parse(localStorage.getItem('UserIsLogged'))} } 
    else { return {Logged:false, UData : {} }}

}

const GetPID = () =>{
    const UserLoggedIn = (localStorage.getItem('ProffAccount') !== null);
    if (UserLoggedIn)  { 
        return {Logged:true, UData : JSON.parse(localStorage.getItem('ProffAccount'))} } 
    else { return {Logged:false, UData : {} }}

}

const GetDefaultPosition = () =>{
    const SearchIn = (localStorage.getItem('SearchIn') !== null);
    if (SearchIn)  { 
        return(JSON.parse(localStorage.getItem('SearchIn')))
    } 
    //else { return {Logged:false, UData : {} }}

}

const GConf = {

    // main variables
    //soketLink : 'https://api.system.ansl.tn/API',
    ApiLink : 'https://api.system.ansl.tn/API/kallax', //https://api.system.ansl.tn/API/ 
    themeColor : '#139beb',
    UserData : GetUID(),
    ProfData : GetPID(),
    defaultPos: GetDefaultPosition(),
    TostErrorGonf : {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        //icon: "🚫"
    },
    TostSuucessGonf : {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored"
    },
    TostInternetGonf : {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored"
    },
    LeafleftIcon :  {
        iconUrl: require("leaflet/dist/images/position.gif"),
        iconRetinaUrl: require("leaflet/dist/images/position.gif"),
        iconSize: [10,10],
        shadowSize: [0,0],
        shadowUrl: '',
        shadowSize:   [0,0],
        iconAnchor:   [0,0],
        shadowAnchor: [0,0],
        popupAnchor:  [0,0]
    },
    TostErrorGonf : {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        icon: "🚫"
    },
    TostInternetGonf : {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        icon: "🚫"
    },
    TostSuucessGonf : {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        icon: "🚫"
    },
    LeafleftIcon : {
        iconUrl: require("leaflet/dist/images/position.gif"),
        iconRetinaUrl: require("leaflet/dist/images/position.gif"),
        iconSize: [10,10],
        shadowSize: [0,0],
        shadowUrl: '',
        shadowSize:   [0,0],
        iconAnchor:   [0,0],
        shadowAnchor: [0,0],
        popupAnchor:  [0,0]
    },

    
    proffListe : [
        {id:1, colL: 4 , color:'#ccdafc', tag:'Plombier',  link:'Plombier', genre:'Plombier', text:'Plombier', imageSrc:'Plombier.gif'},
        {id:2, colL: 4 , color:'#f8fccc', tag:'Électricien',  link:'Électricien', genre:'Électricien', text:'Électricien', imageSrc:'Électricien.gif'},
        {id:3, colL: 4 , color:'#e3e3e3', tag:'Serrurier',  link:'Serrurier', genre:'Serrurier', text:'Serrurier', imageSrc:'Serrurier.gif'},
        {id:3, colL: 4 , color:'#f799ff', tag:'Chauffagiste',  link:'Chauffagiste', genre:'Chauffagiste', text:'Chauffagiste', imageSrc:'Chauffagiste.gif'},
        {id:3, colL: 4 , color:'#bcf7be', tag:'Vitrier',  link:'Vitrier', genre:'Vitrier', text:'Vitrier', imageSrc:'Vitrier.gif'},
        // {id:3, colL: 4 , color:'#b5bcf7', tag:'Électroménager',  link:'Électroménager', genre:'Électroménager', text:'Électroménager', imageSrc:'Électroménager.gif'},
        {id:3, colL: 4 , color:'#4fff61', tag:'Jardinier',  link:'Jardinier', genre:'Jardinier', text:'Jardinier', imageSrc:'Jardinier.gif'},
        {id:3, colL: 6 , color:'#ffe278', tag:'Couvreur',  link:'Couvreur', genre:'Couvreur', text:'Femme de Ménage', imageSrc:'femme-de-menage.gif'},
        {id:3, colL: 6 , color:'#e8e8e8', tag:'Peinture',  link:'Peinture', genre:'Peinture', text:'Garde Enfant', imageSrc:'garde-enfant.gif'},
        // {id:3, colL: 4 , color:'#ffe278', tag:'Couvreur',  link:'Couvreur', genre:'Couvreur', text:'Couvreur', imageSrc:'Couvreur.gif'},
        // {id:3, colL: 4 , color:'#deb4fa', tag:'Menuisier',  link:'Menuisier', genre:'Menuisier', text:'Menuisier', imageSrc:'Menuisier.gif'},
        // {id:3, colL: 4 , color:'#fcffbd', tag:'Forgeron',  link:'Forgeron', genre:'Forgeron', text:'Forgeron', imageSrc:'Forgeron.gif'},
        // {id:3, colL: 4 , color:'#f5a87f', tag:'Peinture',  link:'Peinture', genre:'Peinture', text:'Peinture', imageSrc:'Peinture.gif'},
        // {id:3, colL: 4 , color:'#e8e8e8', tag:'Plâtrier',  link:'Plâtrier', genre:'Plâtrier', text:'Plâtrier', imageSrc:'Plâtrier.gif'},
    ],

    profTags : {
        Électricien : [
            {
                id: 1, text: "Panne électrique inconnue", value: "installation-electrique",
                description: "Installation de câblage électrique pour nouvelles constructions ou rénovations.",
                photo: "installation-electrique.png"
            },
            {
                id: 2, text: "Recherche de panne électrique", value: "depannage-electrique ",
                description: "Réparation de pannes et dysfonctionnements dans installations existantes.",
                photo: "depannage-electrique.jpg"
            },
            {
                id: 3,
                text: "Réparation de prise murale",
                value: "remplacement-fusibles-disjoncteurs",
                description: "Remplacement dispositifs de protection électrique défectueux.",
                photo: "remplacement-fusibles-disjoncteurs.jpg"
            },
        ],
        Plombier:[
            {
                id: 1,
                text: "Fuite Tuyau",
                value: "reparation-fuites-eau",
                description: "Réparation des fuites d'eau dans les tuyaux, les robinets, les chauffe-eau, etc.",
                photo: "reparation-fuites-eau.jpg"
            },
            {
                id: 2,
                text: "Débouchage WC",
                value: "detection-fuites",
                description: "Localisation et réparation des fuites invisibles dans les canalisations.",
                photo: "detection-fuites.png"
            },
            {
                id: 3,
                text: "Réparation Ballon d'eau Chaude",
                value: "reparation-toilettes",
                description: "Réparation des toilettes qui fuient, qui se bouchent ou qui ne fonctionnent pas correctement.",
                photo: "reparation-toilettes.png"
            },
        ],
        Serrurier:[
            {
                id: 1,
                text: "Ouverture porte simple fermée à clé",
                value: "ouverture-portes",
                description: "Ouverture de portes bloquées ou verrouillées, y compris les portes d'entrée, les portes de voiture, etc.",
                photo: "ouverture-portes.png"
            },
            {
                id: 2,
                text: "Ouverture porte blindée fermée à clé",
                value: "installation-serrures",
                description: "Installation de serrures de sécurité sur les portes d'entrée, les fenêtres, les portails, etc.",
                photo: ""
            },
            {
                id: 3,
                text: "Ouverture porte simple claquée",
                value: "reparation-serrures",
                description: "Réparation et ajustement des serrures endommagées ou défectueuses pour assurer la sécurité.",
                photo: ""
            },
        ],
        Chauffagiste:[
            {
                id: 1,
                text: "Réparation Chaudière Gaz",
                value: "installation-systemes-chauffage",
                description: "Installation de systèmes de chauffage central, de chaudières, de radiateurs, etc.",
                photo: ""
            },
            {
                id: 2,
                text: "Entretien Chaudière gaz",
                value: "reparation-chaudieres",
                description: "Réparation des chaudières à gaz, à fioul ou électriques pour assurer leur bon fonctionnement.",
                photo: ""
            },
            {
                id: 3,
                text: "Réparation Chaudière Fioul",
                value: "entretien-chaudieres",
                description: "Nettoyage, vérification et ajustement des chaudières pour garantir leur efficacité et leur sécurité.",
                photo: ""
            }
        ],
        Vitrier:[
            {
                id: 1,
                text: "Changement de vitre cassée double vitrage",
                value: "remplacement-vitres-cassees",
                description: "Remplacement de vitres cassées dans les fenêtres, les portes, les vérandas, etc.",
                photo: ""
            },
            {
                id: 2,
                text: "Changement de vitre cassée simple vitrage",
                value: "reparation-fenetres-endommagees",
                description: "Réparation des fenêtres fissurées, ébréchées ou avec des problèmes d'étanchéité.",
                photo: ""
            },
            {
                id: 3,
                text: "Remplacement d'une vitre fissurée",
                value: "installation-vitrages",
                description: "Installation de vitrages pour fenêtres, portes, vérandas, balcons, etc.",
                photo: ""
            }
        ],
        Jardinier:[
            {
                id: 1,
                text: "Désherbage et nettoyage rapide",
                value: "tonte-pelouse",
                description: "Tonte régulière de la pelouse pour maintenir une apparence soignée.",
                photo: ""
            },
            {
                id: 2,
                text: "Tailler en urgence les arbres et les arbustes",
                value: "taille-arbustes-haies",
                description: "Taille des arbustes et des haies pour les maintenir en forme et favoriser une croissance saine.",
                photo: ""
            },
            {
                id: 3,
                text: "Traiter les maladies des plantes en urgence",
                value: "entretien-parterres-fleurs",
                description: "Nettoyage, désherbage et ajout de terreau pour maintenir des parterres de fleurs attrayants.",
                photo: ""
            },
        ],
        Couvreur:[
            {
                id: 1,
                text: "Nettoyer les surfaces",
                value: "installation-toitures",
                description: "Installation de toitures neuves pour les constructions neuves ou les rénovations.",
                photo: ""
            },
            {
                id: 2,
                text: "Aspirer les sols",
                value: "reparation-toitures",
                description: "Réparation des fuites, des dommages causés par les intempéries et des autres problèmes de toiture.",
                photo: ""
            },
            {
                id: 3,
                text: "Pousser la serpillière",
                value: "remplacement-tuiles-ardoises",
                description: "Remplacement des tuiles ou des ardoises endommagées pour assurer l'étanchéité de la toiture.",
                photo: ""
            },
        ],
        Peinture:[
            {
                id: 1,
                text: "Peinture intérieure",
                value: "peinture-interieure",
                description: "Peinture des murs, des plafonds et des autres surfaces intérieures pour rafraîchir et embellir les espaces.",
                photo: ""
            },
            {
                id: 2,
                text: "Peinture extérieure",
                value: "peinture-exterieure",
                description: "Peinture des façades, des clôtures, des portes, des volets et des autres surfaces extérieures pour protéger et décorer.",
                photo: ""
            },
            {
                id: 3,
                text: "Peinture décorative",
                value: "peinture-decorative",
                description: "Application de peintures décoratives telles que les peintures à effet, les enduits décoratifs, etc.",
                photo: ""
            },
        ] 
    },
    profSousTag:{
        "refection-charpentes" : [
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
        ]
        
    },
    profTagsOld : {
        Électricien : [
            {
                id: 1, text: "Installations électriques", value: "installation-electrique",
                description: "Installation de câblage électrique pour nouvelles constructions ou rénovations.",
                photo: "installation-electrique.png"
            },
            {
                id: 2, text: "Dépannage électrique", value: "depannage-electrique ",
                description: "Réparation de pannes et dysfonctionnements dans installations existantes.",
                photo: "depannage-electrique.jpg"
            },
            {
                id: 3,
                text: "Remplacement fusibles et disjoncteurs",
                value: "remplacement-fusibles-disjoncteurs",
                description: "Remplacement dispositifs de protection électrique défectueux.",
                photo: "remplacement-fusibles-disjoncteurs.jpg"
            },
            {
                id: 4,
                text: "Installation luminaires",
                value: "installation-luminaires",
                description: "Installation de nouveaux luminaires, y compris lustres, appliques murales, etc.",
                photo: "installation-luminaires.jpg"
            },
            {
                id: 5,
                text: "Réparation prises et interrupteurs",
                value: "reparation-remplacement-prises-interrupteurs",
                description: "Réparation ou remplacement prises électriques et interrupteurs endommagés ou obsolètes.",
                photo: "reparation-remplacement-prises-interrupteurs.png"
            },
            {
                id: 6,
                text: "Installation éclairage extérieur",
                value: "installation-systemes-eclairage-exterieur",
                description: "Installation de lumières de sécurité, éclairage de jardin, etc.",
                photo: "installation-systemes-eclairage-exterieur.png"
            },
            {
                id: 7,
                text: "Installation systèmes de sécurité",
                value: "installation-systemes-securite",
                description: "Installation de caméras de surveillance, systèmes d'alarme, etc.",
                photo: "installation-systemes-securite.jpg"
            },
            {
                id: 8,
                text: "Mise à niveau panneau électrique",
                value: "mise-a-niveau-panneau-electrique",
                description: "Remplacement ou mise à niveau panneau de disjoncteurs pour répondre aux besoins actuels.",
                photo: "mise-a-niveau-panneau-electrique.png"
            },
            {
                id: 9,
                text: "Installation systèmes de câblage structuré",
                value: "installation-systemes-cablage-structure",
                description: "Installation de câblage pour réseaux informatiques et de communication.",
                photo: "installation-systemes-cablage-structure.png"
            },
            {
                id: 10,
                text: "Installation systèmes domotiques",
                value: "installation-systemes-domotiques",
                description: "Installation de systèmes automatisés pour contrôle à distance de l'éclairage, appareils électroménagers, etc.",
                photo: "installation-systemes-domotiques.png"
            },
            {
                id: 11,
                text: "Vérification conformité électrique",
                value: "verification-conformite-electrique",
                description: "Inspection et vérification conformité aux normes électriques locales et nationales.",
                photo: "verification-conformite-electrique.jpg"
            },
            {
                id: 12,
                text: "Maintenance électrique préventive",
                value: "maintenance-electrique-preventive",
                description: "Inspection régulière et entretien des installations électriques pour éviter pannes et assurer sécurité.",
                photo: "maintenance-electrique-preventive.jpg"
            }
        ],
        Plombier:[
            // {
            //     id: 1,
            //     text: "Débouchage de canalisations",
            //     value: "debouchage-canalisation",
            //     description: "Débouchage des canalisations obstruées dans les éviers, les toilettes, les douches, etc.",
            //     photo: "debouchage-canalisation.jpg"
            // },
            {
                id: 1,
                text: "Réparation de fuites d'eau",
                value: "reparation-fuites-eau",
                description: "Réparation des fuites d'eau dans les tuyaux, les robinets, les chauffe-eau, etc.",
                photo: "reparation-fuites-eau.jpg"
            },
            // {
            //     id: 3,
            //     text: "Installation de robinetterie",
            //     value: "installation-robinetterie",
            //     description: "Installation et remplacement de robinets, de mitigeurs et d'autres équipements de plomberie.",
            //     photo: "installation-robinetterie.jpg"
            // },
            // {
            //     id: 4,
            //     text: "Réparation et remplacement de chauffe-eau",
            //     value: "reparation-remplacement-chauffe-eau",
            //     description: "Réparation et remplacement des chauffe-eau électriques, à gaz ou solaires.",
            //     photo: "reparation-remplacement-chauffe-eau.png"
            // },
            {
                id: 2,
                text: "Détection de fuites",
                value: "detection-fuites",
                description: "Localisation et réparation des fuites invisibles dans les canalisations.",
                photo: "detection-fuites.png"
            },
            // {
            //     id: 6,
            //     text: "Installation de système de chauffage",
            //     value: "installation-systeme-chauffage",
            //     description: "Installation de systèmes de chauffage central, de radiateurs, de planchers chauffants, etc.",
            //     photo: "installation-systeme-chauffage.png"
            // },
            // {
            //     id: 7,
            //     text: "Installation de systèmes d'assainissement",
            //     value: "installation-systeme-assainissement",
            //     description: "Installation de systèmes d'assainissement tels que les fosses septiques, les stations de relevage, etc.",
            //     photo: "installation-systeme-assainissement.jpg"
            // },
            {
                id: 3,
                text: "Réparation de toilettes",
                value: "reparation-toilettes",
                description: "Réparation des toilettes qui fuient, qui se bouchent ou qui ne fonctionnent pas correctement.",
                photo: "reparation-toilettes.png"
            },
            // {
            //     id: 9,
            //     text: "Installation de salle de bains",
            //     value: "installation-salle-bains",
            //     description: "Installation de nouveaux équipements de salle de bains tels que baignoires, lavabos, douches, etc.",
            //     photo: "installation-salle-bains.png"
            // },
            // {
            //     id: 10,
            //     text: "Réparation de canalisations endommagées",
            //     value: "reparation-canalisation-endommagee",
            //     description: "Réparation des canalisations endommagées par des racines, des fissures, des corrosions, etc.",
            //     photo: ""
            // },
            // {
            //     id: 11,
            //     text: "Désembouage des radiateurs",
            //     value: "desembouage-radiateurs",
            //     description: "Nettoyage des radiateurs obstrués pour améliorer l'efficacité du chauffage.",
            //     photo: "reparation-canalisation-endommagee.jpg"
            // },
            // {
            //     id: 12,
            //     text: "Maintenance préventive",
            //     value: "maintenance-preventive",
            //     description: "Inspection régulière et entretien des systèmes de plomberie pour prévenir les pannes.",
            //     photo: "maintenance-preventive.png"
            // }
        ],
        Serrurier:[
            {
                id: 1,
                text: "Ouverture porte simple fermée à clé",
                value: "ouverture-portes",
                description: "Ouverture de portes bloquées ou verrouillées, y compris les portes d'entrée, les portes de voiture, etc.",
                photo: "ouverture-portes.png"
            },
            {
                id: 2,
                text: "Ouverture porte blindée fermée à clé",
                value: "installation-serrures",
                description: "Installation de serrures de sécurité sur les portes d'entrée, les fenêtres, les portails, etc.",
                photo: ""
            },
            {
                id: 3,
                text: "Ouverture porte simple claquée",
                value: "reparation-serrures",
                description: "Réparation et ajustement des serrures endommagées ou défectueuses pour assurer la sécurité.",
                photo: ""
            },
            {
                id: 4,
                text: "Changement de serrures",
                value: "changement-serrures",
                description: "Remplacement de serrures existantes par des serrures plus sécurisées ou pour des raisons de sécurité.",
                photo: ""
            },
            {
                id: 5,
                text: "Clés perdues ou cassées",
                value: "cles-perdues-cassees",
                description: "Fabrication de nouvelles clés pour remplacer les clés perdues ou cassées.",
                photo: ""
            },
            {
                id: 6,
                text: "Installation de systèmes de sécurité",
                value: "installation-systemes-securite",
                description: "Installation de systèmes de sécurité tels que des caméras de surveillance, des alarmes, etc.",
                photo: ""
            },
            {
                id: 7,
                text: "Réparation de portes endommagées",
                value: "reparation-portes-endommagees",
                description: "Réparation de portes endommagées suite à une effraction ou à une tentative d'effraction.",
                photo: ""
            },
            {
                id: 8,
                text: "Duplication de clés",
                value: "duplication-cles",
                description: "Duplication de clés pour permettre un accès à plusieurs personnes ou comme sauvegarde.",
                photo: ""
            },
            {
                id: 9,
                text: "Installation de coffres-forts",
                value: "installation-coffres-forts",
                description: "Installation de coffres-forts pour sécuriser les objets de valeur à domicile ou au bureau.",
                photo: ""
            },
            {
                id: 10,
                text: "Réparation de mécanismes de verrouillage",
                value: "reparation-mecanismes-verrouillage",
                description: "Réparation des mécanismes internes de verrouillage dans les portes et les fenêtres.",
                photo: ""
            },
            {
                id: 11,
                text: "Conseils en sécurité",
                value: "conseils-securite",
                description: "Fourniture de conseils sur les meilleures pratiques de sécurité et les solutions de sécurité adaptées.",
                photo: ""
            },
            {
                id: 12,
                text: "Maintenance préventive",
                value: "maintenance-preventive",
                description: "Inspection régulière et entretien des serrures et des systèmes de sécurité pour prévenir les pannes.",
                photo: ""
            }
        ],
        Chauffagiste:[
            {
                id: 1,
                text: "Installation de systèmes de chauffage",
                value: "installation-systemes-chauffage",
                description: "Installation de systèmes de chauffage central, de chaudières, de radiateurs, etc.",
                photo: ""
            },
            {
                id: 2,
                text: "Réparation de chaudières",
                value: "reparation-chaudieres",
                description: "Réparation des chaudières à gaz, à fioul ou électriques pour assurer leur bon fonctionnement.",
                photo: ""
            },
            {
                id: 3,
                text: "Entretien de chaudières",
                value: "entretien-chaudieres",
                description: "Nettoyage, vérification et ajustement des chaudières pour garantir leur efficacité et leur sécurité.",
                photo: ""
            },
            {
                id: 4,
                text: "Installation de radiateurs",
                value: "installation-radiateurs",
                description: "Installation de radiateurs traditionnels, radiateurs électriques ou planchers chauffants.",
                photo: ""
            },
            {
                id: 5,
                text: "Désembouage des radiateurs",
                value: "desembouage-radiateurs",
                description: "Nettoyage des radiateurs obstrués pour améliorer l'efficacité du chauffage.",
                photo: ""
            },
            {
                id: 6,
                text: "Installation de thermostats et de régulateurs",
                value: "installation-thermostats-regulateurs",
                description: "Installation de thermostats d'ambiance et de régulateurs de température pour un contrôle précis du chauffage.",
                photo: ""
            },
            {
                id: 7,
                text: "Dépannage de systèmes de chauffage",
                value: "depannage-systemes-chauffage",
                description: "Réparation des pannes et dysfonctionnements dans les systèmes de chauffage.",
                photo: ""
            },
            {
                id: 8,
                text: "Conversion de systèmes de chauffage",
                value: "conversion-systemes-chauffage",
                description: "Conversion de systèmes de chauffage au fioul en systèmes de chauffage au gaz ou électriques.",
                photo: ""
            },
            {
                id: 9,
                text: "Installation de systèmes de climatisation",
                value: "installation-systemes-climatisation",
                description: "Installation de systèmes de climatisation pour refroidir les espaces intérieurs.",
                photo: ""
            },
            {
                id: 10,
                text: "Vérification de la conformité aux normes",
                value: "verification-conformite-normes",
                description: "Inspection et vérification de la conformité des installations aux normes en vigueur.",
                photo: ""
            },
            {
                id: 11,
                text: "Conseils en économie d'énergie",
                value: "conseils-economie-energie",
                description: "Fourniture de conseils sur les meilleures pratiques pour économiser de l'énergie et réduire les coûts de chauffage.",
                photo: ""
            },
            {
                id: 12,
                text: "Maintenance préventive",
                value: "maintenance-preventive",
                description: "Inspection régulière et entretien des systèmes de chauffage pour prévenir les pannes.",
                photo: ""
            }
        ],
        Vitrier:[
            {
                id: 1,
                text: "Remplacement de vitres cassées",
                value: "remplacement-vitres-cassees",
                description: "Remplacement de vitres cassées dans les fenêtres, les portes, les vérandas, etc.",
                photo: ""
            },
            {
                id: 2,
                text: "Réparation de fenêtres endommagées",
                value: "reparation-fenetres-endommagees",
                description: "Réparation des fenêtres fissurées, ébréchées ou avec des problèmes d'étanchéité.",
                photo: ""
            },
            {
                id: 3,
                text: "Installation de vitrages",
                value: "installation-vitrages",
                description: "Installation de vitrages pour fenêtres, portes, vérandas, balcons, etc.",
                photo: ""
            },
            {
                id: 4,
                text: "Réparation de miroirs",
                value: "reparation-miroirs",
                description: "Réparation et réencadrement de miroirs endommagés.",
                photo: ""
            },
            {
                id: 5,
                text: "Installation de vitrines de magasin",
                value: "installation-vitrines-magasin",
                description: "Installation de vitrines pour magasins, restaurants, bureaux, etc.",
                photo: ""
            },
            {
                id: 6,
                text: "Fourniture de verre sur mesure",
                value: "fourniture-verre-sur-mesure",
                description: "Fourniture de verre coupé sur mesure pour des projets spécifiques.",
                photo: ""
            },
            {
                id: 7,
                text: "Réparation de portes vitrées",
                value: "reparation-portes-vitrees",
                description: "Réparation des portes vitrées qui ne ferment pas correctement ou qui sont endommagées.",
                photo: ""
            },
            {
                id: 8,
                text: "Installation de miroirs décoratifs",
                value: "installation-miroirs-decoratifs",
                description: "Installation de miroirs décoratifs dans les salles de bains, les chambres, etc.",
                photo: ""
            },
            {
                id: 9,
                text: "Fourniture et installation de pare-douches",
                value: "fourniture-installation-pare-douches",
                description: "Fourniture et installation de pare-douches sur mesure pour les salles de bains.",
                photo: ""
            },
            {
                id: 10,
                text: "Conseils en matière de vitrerie",
                value: "conseils-matiere-vitrerie",
                description: "Fourniture de conseils sur le choix des matériaux, des types de vitrage, etc.",
                photo: ""
            },
            {
                id: 11,
                text: "Réparation de baies vitrées",
                value: "reparation-baies-vitrees",
                description: "Réparation des baies vitrées endommagées ou qui fuient.",
                photo: ""
            },
            {
                id: 12,
                text: "Maintenance préventive",
                value: "maintenance-preventive",
                description: "Inspection régulière et entretien des vitrages pour prévenir les dommages.",
                photo: ""
            }
        ],
        // Électroménager:[
        //     {
        //         id: 1,
        //         text: "Réparation de lave-linge",
        //         value: "reparation-lave-linge",
        //         description: "Réparation de lave-linge pour résoudre les problèmes de fonctionnement, de bruit, etc.",
        //         photo: ""
        //     },
        //     {
        //         id: 2,
        //         text: "Réparation de lave-vaisselle",
        //         value: "reparation-lave-vaisselle",
        //         description: "Réparation de lave-vaisselle pour résoudre les problèmes de nettoyage, de vidange, etc.",
        //         photo: ""
        //     },
        //     {
        //         id: 3,
        //         text: "Réparation de réfrigérateurs",
        //         value: "reparation-refrigerateurs",
        //         description: "Réparation de réfrigérateurs pour résoudre les problèmes de température, de fuite, etc.",
        //         photo: ""
        //     },
        //     {
        //         id: 4,
        //         text: "Réparation de congélateurs",
        //         value: "reparation-congelateurs",
        //         description: "Réparation de congélateurs pour résoudre les problèmes de refroidissement, de givrage, etc.",
        //         photo: ""
        //     },
        //     {
        //         id: 5,
        //         text: "Réparation de fours",
        //         value: "reparation-fours",
        //         description: "Réparation de fours électriques ou à gaz pour résoudre les problèmes de température, d'allumage, etc.",
        //         photo: ""
        //     },
        //     {
        //         id: 6,
        //         text: "Réparation de cuisinières",
        //         value: "reparation-cuisinieres",
        //         description: "Réparation de cuisinières pour résoudre les problèmes de brûleurs, de fours, etc.",
        //         photo: ""
        //     },
        //     {
        //         id: 7,
        //         text: "Réparation de micro-ondes",
        //         value: "reparation-micro-ondes",
        //         description: "Réparation de micro-ondes pour résoudre les problèmes de chauffage, d'affichage, etc.",
        //         photo: ""
        //     },
        //     {
        //         id: 8,
        //         text: "Réparation de machines à café",
        //         value: "reparation-machines-cafe",
        //         description: "Réparation de machines à café pour résoudre les problèmes de brassage, de chauffage, etc.",
        //         photo: ""
        //     },
        //     {
        //         id: 9,
        //         text: "Réparation de robots de cuisine",
        //         value: "reparation-robots-cuisine",
        //         description: "Réparation de robots de cuisine pour résoudre les problèmes de moteurs, de lames, etc.",
        //         photo: ""
        //     },
        //     {
        //         id: 10,
        //         text: "Réparation de grille-pains",
        //         value: "reparation-grille-pains",
        //         description: "Réparation de grille-pains pour résoudre les problèmes de chauffage, de levage, etc.",
        //         photo: ""
        //     },
        //     {
        //         id: 11,
        //         text: "Réparation de centrales vapeur",
        //         value: "reparation-centrales-vapeur",
        //         description: "Réparation de centrales vapeur pour résoudre les problèmes de chauffage, de pression, etc.",
        //         photo: ""
        //     },
        //     {
        //         id: 12,
        //         text: "Réparation d'autres appareils électroménagers",
        //         value: "reparation-autres-appareils",
        //         description: "Réparation d'autres appareils électroménagers tels que les aspirateurs, les fers à repasser, etc.",
        //         photo: ""
        //     }
        // ],
        Jardinier:[
            {
                id: 1,
                text: "Tonte de pelouse",
                value: "tonte-pelouse",
                description: "Tonte régulière de la pelouse pour maintenir une apparence soignée.",
                photo: ""
            },
            {
                id: 2,
                text: "Taille des arbustes et des haies",
                value: "taille-arbustes-haies",
                description: "Taille des arbustes et des haies pour les maintenir en forme et favoriser une croissance saine.",
                photo: ""
            },
            {
                id: 3,
                text: "Entretien des parterres de fleurs",
                value: "entretien-parterres-fleurs",
                description: "Nettoyage, désherbage et ajout de terreau pour maintenir des parterres de fleurs attrayants.",
                photo: ""
            },
            {
                id: 4,
                text: "Plantation d'arbres, d'arbustes et de fleurs",
                value: "plantation-arbres-arbustes-fleurs",
                description: "Plantation d'arbres, d'arbustes et de fleurs pour ajouter de la beauté et de la diversité au jardin.",
                photo: ""
            },
            {
                id: 5,
                text: "Installation de système d'arrosage automatique",
                value: "installation-systeme-arrosage-automatique",
                description: "Installation de systèmes d'arrosage automatique pour assurer l'hydratation régulière des plantes.",
                photo: ""
            },
            {
                id: 6,
                text: "Débroussaillage et désherbage",
                value: "debroussaillage-désherbage",
                description: "Élimination des mauvaises herbes et des plantes envahissantes pour maintenir un jardin propre et ordonné.",
                photo: ""
            },
            {
                id: 7,
                text: "Aménagement paysager",
                value: "amenagement-paysager",
                description: "Conception et création de plans d'aménagement paysager pour optimiser l'utilisation de l'espace extérieur.",
                photo: ""
            },
            {
                id: 8,
                text: "Fertilisation du sol",
                value: "fertilisation-sol",
                description: "Application d'engrais et de compost pour enrichir le sol et favoriser la croissance des plantes.",
                photo: ""
            },
            {
                id: 9,
                text: "Taille des arbres",
                value: "taille-arbres",
                description: "Taille des branches des arbres pour éliminer les branches mortes, encourager la croissance et améliorer l'aspect esthétique.",
                photo: ""
            },
            {
                id: 10,
                text: "Nettoyage des allées et des terrasses",
                value: "nettoyage-allees-terrasses",
                description: "Nettoyage des allées et des terrasses pour éliminer les débris, la saleté et les déchets.",
                photo: ""
            },
            {
                id: 11,
                text: "Élagage",
                value: "elagage",
                description: "Élagage des branches des arbres pour contrôler la croissance et améliorer la structure.",
                photo: ""
            },
            {
                id: 12,
                text: "Installation de clôtures de jardin",
                value: "installation-clotures-jardin",
                description: "Installation de clôtures pour délimiter et sécuriser les espaces extérieurs.",
                photo: ""
            }
        ],
        Couvreur:[
            {
                id: 1,
                text: "Installation de toitures",
                value: "installation-toitures",
                description: "Installation de toitures neuves pour les constructions neuves ou les rénovations.",
                photo: ""
            },
            {
                id: 2,
                text: "Réparation de toitures",
                value: "reparation-toitures",
                description: "Réparation des fuites, des dommages causés par les intempéries et des autres problèmes de toiture.",
                photo: ""
            },
            {
                id: 3,
                text: "Remplacement de tuiles ou d'ardoises",
                value: "remplacement-tuiles-ardoises",
                description: "Remplacement des tuiles ou des ardoises endommagées pour assurer l'étanchéité de la toiture.",
                photo: ""
            },
            {
                id: 4,
                text: "Nettoyage et démoussage de toitures",
                value: "nettoyage-demoussage-toitures",
                description: "Nettoyage en profondeur et démoussage des toitures pour éliminer les débris et prévenir la croissance de la mousse.",
                photo: ""
            },
            {
                id: 5,
                text: "Installation de gouttières",
                value: "installation-gouttieres",
                description: "Installation de gouttières pour collecter et évacuer efficacement les eaux pluviales.",
                photo: ""
            },
            {
                id: 6,
                text: "Réparation de gouttières",
                value: "reparation-gouttieres",
                description: "Réparation des gouttières endommagées pour assurer un bon drainage des eaux de pluie.",
                photo: ""
            },
            {
                id: 7,
                text: "Isolation de toitures",
                value: "isolation-toitures",
                description: "Installation ou remplacement d'isolants pour améliorer l'efficacité énergétique de la maison.",
                photo: ""
            },
            {
                id: 8,
                text: "Installation de fenêtres de toit",
                value: "installation-fenetres-toit",
                description: "Installation de fenêtres de toit pour apporter plus de lumière naturelle à l'intérieur de la maison.",
                photo: ""
            },
            {
                id: 9,
                text: "Pose de bardages",
                value: "pose-bardages",
                description: "Installation de bardages pour protéger et embellir les murs extérieurs de la maison.",
                photo: ""
            },
            {
                id: 10,
                text: "Réfection de charpentes",
                value: "refection-charpentes",
                description: "Réparation ou remplacement des charpentes endommagées pour assurer la solidité de la toiture.",
                photo: ""
            },
            {
                id: 11,
                text: "Traitement hydrofuge",
                value: "traitement-hydrofuge",
                description: "Application d'un traitement hydrofuge pour protéger la toiture contre l'humidité et les infiltrations d'eau.",
                photo: ""
            },
            {
                id: 12,
                text: "Conseils en matière de toiture",
                value: "conseils-matiere-toiture",
                description: "Fourniture de conseils sur l'entretien préventif et les meilleures pratiques pour prolonger la durée de vie de la toiture.",
                photo: ""
            }
        ],
        // Menuisier:[
        //     {
        //         id: 1,
        //         text: "Fabrication de meubles sur mesure",
        //         value: "fabrication-meubles-sur-mesure",
        //         description: "Conception et fabrication de meubles personnalisés selon les besoins et les préférences du client.",
        //         photo: ""
        //     },
        //     {
        //         id: 2,
        //         text: "Installation de cuisines sur mesure",
        //         value: "installation-cuisines-sur-mesure",
        //         description: "Conception et installation de cuisines sur mesure adaptées à l'espace et aux exigences du client.",
        //         photo: ""
        //     },
        //     {
        //         id: 3,
        //         text: "Installation de placards et de dressings",
        //         value: "installation-placards-dressings",
        //         description: "Installation de placards et de dressings sur mesure pour optimiser le rangement.",
        //         photo: ""
        //     },
        //     {
        //         id: 4,
        //         text: "Pose de parquets et de revêtements de sol",
        //         value: "pose-parquets-revetements-sol",
        //         description: "Pose de parquets en bois, de revêtements stratifiés ou de carrelages pour embellir les sols.",
        //         photo: ""
        //     },
        //     {
        //         id: 5,
        //         text: "Fabrication et installation de portes et de fenêtres",
        //         value: "fabrication-installation-portes-fenetres",
        //         description: "Fabrication et installation de portes d'entrée, de portes intérieures, de fenêtres, etc.",
        //         photo: ""
        //     },
        //     {
        //         id: 6,
        //         text: "Fabrication et installation d'escaliers",
        //         value: "fabrication-installation-escaliers",
        //         description: "Conception et installation d'escaliers sur mesure en bois, en métal, en verre, etc.",
        //         photo: ""
        //     },
        //     {
        //         id: 7,
        //         text: "Rénovation de boiseries",
        //         value: "renovation-boiseries",
        //         description: "Réparation, restauration ou remplacement des boiseries endommagées ou vieillissantes.",
        //         photo: ""
        //     },
        //     {
        //         id: 8,
        //         text: "Aménagement de combles",
        //         value: "amenagement-combles",
        //         description: "Transformation des combles en espaces habitables, bureaux, chambres, etc.",
        //         photo: ""
        //     },
        //     {
        //         id: 9,
        //         text: "Installation de terrasses en bois",
        //         value: "installation-terrasses-bois",
        //         description: "Construction de terrasses en bois pour créer des espaces extérieurs fonctionnels et esthétiques.",
        //         photo: ""
        //     },
        //     {
        //         id: 10,
        //         text: "Fabrication et installation de bibliothèques",
        //         value: "fabrication-installation-bibliotheques",
        //         description: "Conception et installation de bibliothèques sur mesure pour ranger et exposer les livres et objets de décoration.",
        //         photo: ""
        //     },
        //     {
        //         id: 11,
        //         text: "Installation de bardages extérieurs",
        //         value: "installation-bardages-exterieurs",
        //         description: "Installation de bardages en bois ou en matériaux composites pour protéger et embellir les façades.",
        //         photo: ""
        //     },
        //     {
        //         id: 12,
        //         text: "Conception et installation de mobilier de jardin",
        //         value: "conception-installation-mobilier-jardin",
        //         description: "Conception et installation de mobilier de jardin sur mesure pour les terrasses et les espaces extérieurs.",
        //         photo: ""
        //     }
        // ],
        // Forgeron:[
        //     {
        //         id: 1,
        //         text: "Fabrication de pièces métalliques sur mesure",
        //         value: "fabrication-pieces-metal-sur-mesure",
        //         description: "Conception et fabrication de pièces métalliques personnalisées selon les besoins du client.",
        //         photo: ""
        //     },
        //     {
        //         id: 2,
        //         text: "Forgeage de ferronneries décoratives",
        //         value: "forgeage-ferronneries-decoratives",
        //         description: "Forgeage de ferronneries artistiques telles que des rampes d'escalier, des grilles, des balustrades, etc.",
        //         photo: ""
        //     },
        //     {
        //         id: 3,
        //         text: "Réparation de pièces métalliques",
        //         value: "reparation-pieces-metal",
        //         description: "Réparation de pièces métalliques endommagées ou usées pour restaurer leur fonctionnalité.",
        //         photo: ""
        //     },
        //     {
        //         id: 4,
        //         text: "Fabrication et installation de portails et de clôtures",
        //         value: "fabrication-installation-portails-clotures",
        //         description: "Conception, fabrication et installation de portails et de clôtures en métal sur mesure.",
        //         photo: ""
        //     },
        //     {
        //         id: 5,
        //         text: "Création d'outils de forge",
        //         value: "creation-outils-forge",
        //         description: "Fabrication d'outils spécialisés pour la forge afin de faciliter le travail du forgeron.",
        //         photo: ""
        //     },
        //     {
        //         id: 6,
        //         text: "Restauration de pièces anciennes",
        //         value: "restauration-pieces-anciennes",
        //         description: "Restauration de pièces métalliques anciennes ou historiques pour les préserver et les valoriser.",
        //         photo: ""
        //     },
        //     {
        //         id: 7,
        //         text: "Forgeage de couteaux et d'outils tranchants",
        //         value: "forgeage-couteaux-outils-tranchants",
        //         description: "Fabrication de couteaux, de ciseaux et d'autres outils tranchants en métal forgé à la main.",
        //         photo: ""
        //     },
        //     {
        //         id: 8,
        //         text: "Création d'œuvres d'art métalliques",
        //         value: "creation-oeuvres-art-metalliques",
        //         description: "Création d'œuvres d'art en métal telles que des sculptures, des statues, etc.",
        //         photo: ""
        //     },
        //     {
        //         id: 9,
        //         text: "Fabrication de mobilier en métal",
        //         value: "fabrication-mobilier-metal",
        //         description: "Conception et fabrication de mobilier en métal sur mesure, comme des tables, des chaises, etc.",
        //         photo: ""
        //     },
        //     {
        //         id: 10,
        //         text: "Personnalisation d'objets métalliques",
        //         value: "personnalisation-objets-metal",
        //         description: "Personnalisation d'objets métalliques existants avec des gravures, des ornements, etc.",
        //         photo: ""
        //     },
        //     {
        //         id: 11,
        //         text: "Installation de cheminées et de poêles",
        //         value: "installation-cheminees-poeles",
        //         description: "Fabrication et installation de cheminées et de poêles en métal pour chauffer les intérieurs.",
        //         photo: ""
        //     },
        //     {
        //         id: 12,
        //         text: "Formation et enseignement de la forge",
        //         value: "formation-enseignement-forge",
        //         description: "Organisation de cours et de formations pour enseigner les techniques de forge et de métallurgie.",
        //         photo: ""
        //     }
        // ],
        Peinture:[
            {
                id: 1,
                text: "Peinture intérieure",
                value: "peinture-interieure",
                description: "Peinture des murs, des plafonds et des autres surfaces intérieures pour rafraîchir et embellir les espaces.",
                photo: ""
            },
            {
                id: 2,
                text: "Peinture extérieure",
                value: "peinture-exterieure",
                description: "Peinture des façades, des clôtures, des portes, des volets et des autres surfaces extérieures pour protéger et décorer.",
                photo: ""
            },
            {
                id: 3,
                text: "Peinture décorative",
                value: "peinture-decorative",
                description: "Application de peintures décoratives telles que les peintures à effet, les enduits décoratifs, etc.",
                photo: ""
            },
            {
                id: 4,
                text: "Peinture de meubles",
                value: "peinture-meubles",
                description: "Peinture ou vernissage des meubles en bois pour leur donner une nouvelle apparence ou les protéger.",
                photo: ""
            },
            {
                id: 5,
                text: "Peinture de sols",
                value: "peinture-sols",
                description: "Application de peintures spéciales pour les sols intérieurs ou extérieurs pour les protéger et les décorer.",
                photo: ""
            },
            {
                id: 6,
                text: "Peinture industrielle",
                value: "peinture-industrielle",
                description: "Application de peintures spéciales pour les surfaces industrielles telles que les entrepôts, les usines, etc.",
                photo: ""
            },
            {
                id: 7,
                text: "Peinture anti-graffiti",
                value: "peinture-anti-graffiti",
                description: "Application de peintures spéciales résistantes aux graffitis pour protéger les surfaces urbaines.",
                photo: ""
            },
            {
                id: 8,
                text: "Réparation des surfaces avant peinture",
                value: "reparation-surfaces-avant-peinture",
                description: "Préparation des surfaces en comblant les fissures, en ponçant et en nettoyant avant l'application de la peinture.",
                photo: ""
            },
            {
                id: 9,
                text: "Peinture de ravalement",
                value: "peinture-ravalement",
                description: "Peinture des façades pour rénover et protéger les murs extérieurs des intempéries.",
                photo: ""
            },
            {
                id: 10,
                text: "Peinture de piscines",
                value: "peinture-piscines",
                description: "Application de peintures spéciales pour piscines pour les protéger et les rendre esthétiques.",
                photo: ""
            },
            {
                id: 11,
                text: "Peinture sur tous supports",
                value: "peinture-tous-supports",
                description: "Peinture sur tous types de surfaces telles que le bois, le métal, le plastique, etc.",
                photo: ""
            },
            {
                id: 12,
                text: "Conseils en couleur et en décoration",
                value: "conseils-couleur-decoration",
                description: "Fourniture de conseils sur le choix des couleurs et des finitions pour créer une ambiance harmonieuse.",
                photo: ""
            }
        ],
        // Plâtrier:[
        //     {
        //         id: 1,
        //         text: "Pose de plaques de plâtre",
        //         value: "pose-plaques-platre",
        //         description: "Installation de plaques de plâtre pour la construction ou la rénovation de cloisons et de plafonds.",
        //         photo: ""
        //     },
        //     {
        //         id: 2,
        //         text: "Enduisage et lissage des murs",
        //         value: "enduisage-lissage-murs",
        //         description: "Application d'enduit sur les murs pour les lisser et les préparer à la peinture ou à la décoration.",
        //         photo: ""
        //     },
        //     {
        //         id: 3,
        //         text: "Réalisation de faux plafonds",
        //         value: "realisation-faux-plafonds",
        //         description: "Création de faux plafonds en plaques de plâtre pour dissimuler les installations ou améliorer l'esthétique.",
        //         photo: ""
        //     },
        //     {
        //         id: 4,
        //         text: "Réparation des murs et des plafonds",
        //         value: "reparation-murs-plafonds",
        //         description: "Réparation des fissures, des trous et des autres dommages sur les murs et les plafonds.",
        //         photo: ""
        //     },
        //     {
        //         id: 5,
        //         text: "Isolation thermique et phonique",
        //         value: "isolation-thermique-phonique",
        //         description: "Installation de matériaux isolants pour améliorer l'isolation thermique et phonique des bâtiments.",
        //         photo: ""
        //     },
        //     {
        //         id: 6,
        //         text: "Création d'éléments décoratifs en plâtre",
        //         value: "creation-elements-decoratifs-platre",
        //         description: "Fabrication et installation d'éléments décoratifs en plâtre tels que des corniches, des rosaces, etc.",
        //         photo: ""
        //     },
        //     {
        //         id: 7,
        //         text: "Pose de carreaux de plâtre",
        //         value: "pose-carreaux-platre",
        //         description: "Pose de carreaux de plâtre pour l'isolation ou la décoration des murs intérieurs.",
        //         photo: ""
        //     },
        //     {
        //         id: 8,
        //         text: "Travaux d'agencement intérieur",
        //         value: "travaux-agencement-interieur",
        //         description: "Travaux de finition et d'agencement intérieur impliquant l'utilisation du plâtre.",
        //         photo: ""
        //     },
        //     {
        //         id: 9,
        //         text: "Application d'enduits décoratifs",
        //         value: "application-enduits-decoratifs",
        //         description: "Application d'enduits décoratifs tels que le stuc, le tadelakt, etc., pour embellir les surfaces.",
        //         photo: ""
        //     },
        //     {
        //         id: 10,
        //         text: "Restauration de plâtre ancien",
        //         value: "restauration-platre-ancien",
        //         description: "Restauration et rénovation des éléments en plâtre anciens pour leur redonner leur aspect d'origine.",
        //         photo: ""
        //     },
        //     {
        //         id: 11,
        //         text: "Conseils en matière de plâtrerie",
        //         value: "conseils-matiere-platrerie",
        //         description: "Fourniture de conseils sur les techniques et les matériaux de plâtrerie pour répondre aux besoins des clients.",
        //         photo: ""
        //     },
        //     {
        //         id: 12,
        //         text: "Travaux d'étanchéité",
        //         value: "travaux-etancheite",
        //         description: "Application de matériaux d'étanchéité pour protéger les surfaces des infiltrations d'eau.",
        //         photo: ""
        //     }
        // ],
    },
    //braedCrumb
    BreadCrumb:{
        stockAddArticle: [
            {id:1, name:'Stock', linkable:true, link:"/S/sk"},
            {id:2, name:'Ajouter Article', linkable:false}
        ],
        stockFamille: [
            {id:1, name:'Stock', linkable:true, link:"/S/sk"},
            {id:2, name:'Familles', linkable:false}
        ],
        stockBE: [
            {id:1, name:'Stock', linkable:true, link:"/S/sk"},
            {id:2, name:'Bon d\'entre', linkable:false}
        ],
        stockBS: [
            {id:1, name:'Stock', linkable:true, link:"/S/sk"},
            {id:2, name:'Bon de sortie', linkable:false}
        ],
        stockInfo: [
            {id:1, name:'Stock', linkable:true, link:"/S/sk"},
            {id:2, name:'Information', linkable:false}
        ],
        factureAjouter:[
            {id:1, name:'Factures', linkable:true, link:"/S/ft"},
            {id:2, name:'Ajouter Facture', linkable:false}
        ],
        factureInfo:[
            {id:1, name:'Factures', linkable:true, link:"/S/ft"},
            {id:2, name:'Info', linkable:false}
        ],
        factureEdit:[
            {id:1, name:'Factures', linkable:true, link:"/S/ft"},
            {id:2, name:'Modification', linkable:false}
        ],
        factureResumer:[
            {id:1, name:'Factures', linkable:true, link:"/S/ft"},
            {id:2, name:'Resumer', linkable:false}
        ],
        CamionAdd: [
            {id:1, name:'Camion', linkable:true, link:"/S/cm"},
            {id:2, name:'Ajouter Camion', linkable:false}
        ],
        CamionAddFond: [
            {id:1, name:'Camion', linkable:true, link:"/S/cm"},
            {id:2, name:'Ajouter Fond', linkable:false}
        ],
        CamionFondInfo: [
            {id:1, name:'Camion', linkable:true, link:"/S/cm"},
            {id:2, name:'Info', linkable:true, link:"/S/cm"},
            {id:3, name:'Fond', linkable:true, link:"/S/cm"},
            {id:4, name:'Voir', linkable:false}
        ],
        CamionEditFond: [
            {id:1, name:'Camion', linkable:true, link:"/S/cm"},
            {id:2, name:'Info', linkable:true, link:"/S/cm"},
            {id:3, name:'Fond', linkable:true, link:"/S/cm"},
            {id:4, name:'Modifier', linkable:false}
        ],
        CamionInv: [
            {id:1, name:'Camion', linkable:true, link:"/S/cm"},
            {id:2, name:'Inventaire Camion', linkable:false}
        ],
        CamionInfo: [
            {id:1, name:'Camion', linkable:true, link:"/S/cm"},
            {id:2, name:'Info', linkable:false}
        ],
        CamionArticleInfo: [
            {id:1, name:'Camion', linkable:true, link:"/S/cm"},
            {id:2, name:'Info', linkable:true, link:".."},
            {id:3, name:'Article', linkable:false}
        ],
        CamionFactureInfo: [
            {id:1, name:'Camion', linkable:true, link:"/S/cm"},
            {id:2, name:'Info', linkable:true, link:".."},
            {id:3, name:'Factures', linkable:true, link:".."},
            {id:4, name:'Voir', linkable:false}
        ],
        ClientAdd: [
            {id:1, name:'Client', linkable:true, link:"/S/cl"},
            {id:2, name:'Ajouter Client', linkable:false}
        ],
        ClientInfo: [
            {id:1, name:'Client', linkable:true, link:"/S/cl"},
            {id:2, name:'Info', linkable:false}
        ],
        ClientMap: [
            {id:1, name:'Client', linkable:true, link:"/S/cl"},
            {id:2, name:'Map', linkable:false}
        ],
        ClientRegion: [
            {id:1, name:'Client', linkable:true, link:"/S/cl"},
            {id:2, name:'Regions', linkable:false}
        ],
        RequestInfo: [
            {id:1, name:'Commandes', linkable:true, link:"/S/rq"},
            {id:2, name:'Info', linkable:false}
        ],
        RequestCalendar: [
            {id:1, name:'Commandes', linkable:true, link:"/S/rq"},
            {id:2, name:'Calendrier', linkable:false}
        ],
        RequestCompte: [
            {id:1, name:'Commandes', linkable:true, link:"/S/rq"},
            {id:2, name:'Comptes', linkable:false}
        ],
        RequestReg: [
            {id:1, name:'Commandes', linkable:true, link:"/S/rq"},
            {id:2, name:'Regrouppemment', linkable:false}
        ],
    },

    //SubNavs
    SubNavs: {
        request: [
            {id:1,  icon: 'check-circle', text: 'Accepté', link: '../g/accepte', dropD: false},
            {id:2,  icon: 'x-circle', text: 'Refusé', link: '../g/refusee', dropD: false},
            {id:3, icon: 'exclamation-circle', text: 'En Attent', link: '../g/en-attent', dropD: false },
        ],
        camion: [
            {id:1,  icon: 'plus-circle', text: 'Ajouter Camion', link: '../ajouter-c', dropD: false},
            {id:2,  icon: 'truck', text: 'Ajouter Fonds', link: '../ajouter-f', dropD: false},
            {id:3,  icon: 'sliders', text: 'Inventaire', link: '../inventaire', dropD: false},
        ],
        Stock: [
            {id:1,  icon: 'bookmark-plus', text: 'Nouveaux article', link: 'ajouter', dropD: false},
            {id:2, icon: 'tags', text: 'Famille', link: 'famille', dropD: false },
            {id:3, icon: 'box-arrow-in-up', text: 'Bond entre', link: 'be', dropD: false },
            {id:4, icon: 'box-arrow-up', text: 'Bond Sortie', link: 'bs', dropD: false },
            // {
            //     id: 3, icon: 'person', text: 'Bons', link: '#', dropD: true, dropDD:
            //         [
            //             { id: 1, icon: 'plus-circle', text: "Bon d'entre ", link: 'be' },
            //             { id: 2, icon: 'dash-circle', text: 'Bon de sortie', link: 'bs' }
            //        ]
            // },
        ],
        facture: [
            {id:1,  icon: 'receipt', text: 'Nouveaux Fcature', link: '../ajouter', dropD: false},
            {id:2,  icon: 'file-earmark-medical-fill', text: 'Resumer', link: '../resumer', dropD: false},
        ],
        client: [
            {id:1,  icon: 'person-plus-fill', text: 'Nouveaux Client', link: '../ajouter', dropD: false},
            {id:2,  icon: 'map-fill', text: 'Régions', link: '../regions', dropD: false},
            {id:3,  icon: 'pin-map-fill', text: 'Clients Map', link: '../map', dropD: false},
        ],
        Commande: [
            {id:1,  icon: 'person-plus-fill', text: 'Comptes', link: '../comptes', dropD: false},
            {id:2,  icon: 'collection-fill', text: 'Regroupemment', link: '../Regroupemment', dropD: false},
            {id:3,  icon: 'calendar-fill', text: 'Calendrier', link: '../calendrier', dropD: false},
        ],
    },
    
    //TableHead
    TableHead:{
        facture:['*','ID','Client','Jour','Totale','Stock','Voir'],
        request:['*','ID','Client', 'Passé le','Volu le','Totale','Etat','Voir'],
        stock:['*','Code', 'Nom', 'Genre','Stock','P.achat','P.vente','Voir'],
        camion:['*','Camion','Matricule', 'Chauffeur','Fond','Recette','Voir'],
        camionStock:['Code', 'Nom', 'Genre','Stock','Prix','Voir'],
        camionFacture:['ID','Client','Jour','Totale','Voir'],
        camionFond:['ID','Date','Totale', 'SDF','SCF','Voir'],
        client:['*','Nom','Matricule', 'Tel', 'Location','Adresse','Voir'],
        clientCommande:['ID', 'Passé le','Volu le','Totale','Etat','Voir'],
        clientFacture:['ID','Client','Jour','Totale','Voir'],
        clientFactureC:['ID','Client','Jour','Totale','Voir'],
        team:['Nom','Etat', 'Post','Commencé']

    },

 
}
 
export default GConf 