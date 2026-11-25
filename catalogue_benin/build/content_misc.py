# -*- coding: utf-8 -*-
"""Contenus généraux, annuaire, événements, circuits. Date de référence : 25 novembre 2026.
Règle : toute donnée non confirmée par une source identifiable est notée « À confirmer » ou « Non renseigné »."""

DATE_REF = "25 novembre 2026"

# Statuts de vérification
V_OK = "Vérifié par Welcome to Bénin"
V_SEC = "Source secondaire — à confirmer"
V_UNK = "Non vérifié"

# ───────────── Partie 1 : le pays en chiffres (faits stables) ─────────────
FAITS = [
 ("Nom officiel", "République du Bénin"),
 ("Capitale officielle", "Porto-Novo (siège du gouvernement : Cotonou)"),
 ("Superficie", "114 763 km²"),
 ("Façade maritime", "environ 120 km sur le golfe de Guinée"),
 ("Frontières", "Togo (ouest), Nigeria (est), Burkina Faso et Niger (nord)"),
 ("Langue officielle", "Français ; langues nationales : fon, yoruba, bariba (baatonu), dendi, ditammari, mina, etc."),
 ("Monnaie", "Franc CFA de l'Afrique de l'Ouest (XOF) — arrimé à l'euro (1 € = 655,957 F CFA)"),
 ("Indicatif / fuseau", "+229 · UTC+1 toute l'année (pas d'heure d'été)"),
 ("Indépendance", "1er août 1960 (ancien Dahomey)"),
 ("Départements", "12 départements"),
]

HISTOIRE = [
 ("XVIIᵉ siècle", "Les royaumes d'Allada, de Hogbonou (Porto-Novo) et du Dahomey (Abomey) se structurent sur le territoire actuel."),
 ("XVIIIᵉ siècle", "Le royaume du Dahomey étend son pouvoir, notamment sur la côte. Ouidah devient l'un des grands ports de la traite atlantique."),
 ("1892-1894", "Guerre entre la France et le royaume du Dahomey. Le roi Béhanzin est vaincu et exilé."),
 ("1960", "Indépendance de la République du Dahomey, rebaptisée Bénin en 1975."),
 ("1990", "Conférence nationale et transition démocratique, un jalon régional."),
 ("Aujourd'hui", "Un pays qui valorise son patrimoine mémoriel et culturel, avec des sites restaurés à Ouidah et des festivals de plus en plus suivis."),
]

ROYAUMES = ("Trois royaumes dominent le récit historique du Sud : celui d'Allada, berceau dynastique ; celui du Dahomey, bâtisseur de la capitale d'Abomey et de ses palais ; et celui de Hogbonou (Porto-Novo), tourné vers la lagune. "
            "Dans le Nord, l'empire baatonu de Nikki et ses cavaliers wasangari ont structuré le Borgou. Chaque entité a laissé des palais, des rites, des fêtes et une cuisine reconnaissables.")

PEUPLES = ("Les Fon, les Adja, les Yoruba, les Goun, les Tofinu, les Baatonu, les Otammari ou encore les Peuls composent un pays pluriel. "
           "Le français sert de langue de liaison ; les langues nationales sont partout présentes. Le vodun, pratiqué par une grande partie de la population, cohabite avec le christianisme et l'islam.")

# ───────────── Pratique ─────────────
PRATIQUE = [
 ("Formalités d'entrée", "Demande de visa en ligne (e-Visa) via le portail officiel du Bénin ; passeport valide requis. Les frais et la durée varient : consulter le site officiel avant de payer et se méfier des intermédiaires qui ajoutent des frais. Les ressortissants de la CEDEAO et certains pays africains bénéficient de régimes d'entrée spécifiques (à vérifier sur le portail).", "evisa.bj — portail officiel (à vérifier avant toute démarche)"),
 ("Santé", "Fièvre jaune : la vaccination est recommandée et fortement conseillée ; les sources divergent sur l'exigence du certificat à l'entrée (certains sites officiels indiquent un contrôle, d'autres non). Prévoir le certificat dans tous les cas. Paludisme : prophylaxie à discuter avec un médecin ; répulsifs et moustiquaire.", "Institut Pasteur — fiche pays ; diplomatie.gouv.fr — Santé"),
 ("Climat", "Sud : deux saisons des pluies (avril-juillet, plus marquée ; septembre-novembre) et deux saisons sèches. Nord : une seule saison des pluies (mai à octobre). L'harmattan, vent sec et poussiéreux, souffle de décembre à février. La période la plus confortable pour voyager est de novembre à mars.", "Estimation éditoriale à partir de guides de voyage reconnus"),
 ("Sécurité", "Se référer à la fiche « Conseils aux voyageurs » du ministère français des Affaires étrangères, ou à celle de son propre pays, avant le départ et la veille de chaque déplacement vers le Nord. Voir page d'avertissement dédiée.", "diplomatie.gouv.fr — Conseils aux voyageurs, Bénin"),
 ("Argent", "Franc CFA (XOF). Distributeurs dans les villes principales ; carte bancaire acceptée dans les grands hôtels ; espèces indispensables ailleurs. Le mobile money (MTN MoMo, Moov, Celtiis) est largement utilisé.", "Pratique courante — à vérifier localement"),
 ("Transports", "Taxis-motos (zémidjans) en ville ; taxis et minibus entre villes ; location de véhicule avec ou sans chauffeur. Conduire de nuit est déconseillé hors axes principaux.", "Guides de voyage ; prestataires cités en Partie 6"),
 ("Connectivité", "Réseaux mobiles locaux (MTN, Moov Africa, Celtiis), cartes SIM disponibles en ville avec pièce d'identité. Wi-Fi dans la plupart des hôtels de catégorie intermédiaire et supérieure.", "À vérifier auprès des opérateurs"),
 ("Aéroport", "Aéroport international Cardinal Bernardin Gantin (COO), quartier de Cadjehoun, environ 5 km du centre de Cotonou. Vols directs depuis Paris (Air France ; Corsair annoncée depuis Orly) et Bruxelles (Brussels Airlines) — liaisons à confirmer auprès des compagnies.", "FlightConnections ; sites des compagnies — à vérifier"),
 ("Urgences", "Pompiers : 118 · SAMU : 112 · Police républicaine : 116 et 117 selon l'ARCEP (numéros 117/166 parfois signalés indisponibles — vérifier). Brigade des mineurs : 160. En cas d'urgence médicale : se rapprocher d'une clinique privée (voir Partie 8).", "ARCEP Bénin (liste officielle des numéros courts) ; voyage.gc.ca"),
]

CONSEILS = [
 "Demandez toujours l'accord avant de photographier une personne, un sanctuaire ou une cérémonie.",
 "Les sites mémoriels (Route des Esclaves, Porte du Non-Retour) appellent une tenue sobre et un comportement respectueux.",
 "Convenez du prix des excursions, des pirogues et des taxis avant le départ.",
 "Gardez de petites coupures pour les gardiens de sites, les guides et les pourboires.",
 "Évitez les trajets de nuit hors des grands axes ; préférez un chauffeur expérimenté pour le Nord.",
 "N'allez pas à la baignade en mer : les courants du golfe de Guinée sont violents.",
 "Vérifiez les dates des événements auprès des organisateurs : plusieurs sont fixées à la lune ou sujettes à ajustement.",
]

# ───────────── Avertissement sécurité Nord (synthèse, daté) ─────────────
AVERT_NORD = dict(
 date="Selon la fiche du ministère français de l'Europe et des Affaires étrangères, actualisée le 21 avril 2026 (consultée par recherche le 25/11/2026)",
 points=[
  "« Formellement déconseillé » : zones frontalières avec le Burkina Faso et le Niger, la totalité des parcs nationaux de la Pendjari et du W, les zones qui les jouxtent, la ville de Banikoara et ses environs, la frontière nord-ouest avec le Togo.",
  "« Déconseillé sauf raison impérative » : centre du département de l'Atacora, y compris Tanguiéta, Natitingou, Boukoumbé et Kouandé.",
  "D'autres sources officielles (Royaume-Uni, Canada, Belgique) formulent des avis voisins. La situation évolue : seule la fiche officielle de votre pays, consultée juste avant le départ, fait foi.",
  "En conséquence, ce catalogue ne propose aucun circuit incluant la Pendjari ni le W, et présente les sites du Nord à titre d'information culturelle uniquement.",
 ])

# ───────────── Partie 4 : hébergements (annuaire vérifié) ─────────────
HEBERGEMENTS = [
 dict(nom="Sofitel Cotonou Marina Hotel & Spa", ville="Cotonou", adresse="Boulevard de la Marina — 081 BP 7300 Cotonou Aéroport", cat="Luxe (groupe Accor)",
  desc="Hôtel de luxe annoncé comme la première adresse Sofitel du pays ; spa, plusieurs restaurants et bars, à environ 5 km de l'aéroport.",
  chambres="Non renseigné", equip="Spa · Restaurants et bars · Salle de réunion (pages réunions d'affaires)", tarif="À confirmer sur le site officiel",
  tel="À confirmer (sources divergentes)", wa="Non renseigné", web="https://sofitel.accor.com/en/hotels/B845.html", resa="Via le site officiel Accor",
  src="Accor (all.accor.com), presse hôtelière", statut=V_SEC, photo="hotel_ambiance"),
 dict(nom="Novotel Cotonou Orisha", ville="Cotonou", adresse="À confirmer", cat="4★ (groupe Accor)",
  desc="Hôtel 4 étoiles à environ 100 m de la plage, avec piscine extérieure et salle de fitness ; restaurant partagé avec l'ibis voisin.",
  chambres="Non renseigné", equip="Piscine extérieure · Fitness · Restaurant", tarif="À confirmer",
  tel="À confirmer", wa="Non renseigné", web="https://all.accor.com/hotel/1826/index.fr.shtml", resa="Via le site officiel Accor",
  src="Accor (all.accor.com)", statut=V_SEC, photo="cotonou_plage"),
 dict(nom="ibis Cotonou", ville="Cotonou", adresse="À confirmer", cat="Économique / intermédiaire (groupe Accor)",
  desc="Hôtel de la marque ibis, mentionné par le site Accor à Cotonou. Informations détaillées non confirmées.",
  chambres="Non renseigné", equip="Non renseigné", tarif="À confirmer",
  tel="À confirmer", wa="Non renseigné", web="https://all.accor.com/a/en/destination/city/hotels-cotonou-v7367.html", resa="Via le site officiel Accor",
  src="Accor (all.accor.com)", statut=V_SEC, photo="cotonou_ville"),
 dict(nom="Villa St André", ville="Grand-Popo", adresse="Hounsoukoé, Grand-Popo", cat="Villa / guesthouse",
  desc="Villa de trois chambres près de la plage, avec salon, cuisine et quatre salles d'eau (dont une pour les visiteurs).",
  chambres="3 chambres · salon · cuisine", equip="Cuisine · 4 salles d'eau · près de la plage", tarif="Sur demande ; réserver au moins 48 h à l'avance",
  tel="+229 01 97 26 65 79", wa="Oui (via la fiche de l'annuaire)", web="Fiche sur welcometobenin.com", resa="Contact direct (arrivée dès 14 h, départ 11 h)",
  src="Welcome to Bénin (fiche « vérifié »)", statut=V_OK, photo="grandpopo"),
 dict(nom="Village Vacances Awalé Plage", ville="Grand-Popo", adresse="Ewe Condji, Grand-Popo", cat="Hôtel balnéaire",
  desc="Hôtel de bord de mer à Grand-Popo, listé parmi les hébergements familiaux de la ville par les plateformes de réservation.",
  chambres="Non renseigné", equip="Non renseigné", tarif="À confirmer",
  tel="À confirmer", wa="Non renseigné", web="Non renseigné", resa="Via plateformes de réservation",
  src="Booking.com (liste), recoupement à faire", statut=V_SEC, photo="grandpopo"),
 dict(nom="Auberge de Grand-Popo", ville="Grand-Popo", adresse="Grand-Popo", cat="Auberge",
  desc="Établissement décrit avec piscine extérieure, jardin, terrasse et parking gratuit ; règlement en espèces uniquement selon la plateforme.",
  chambres="Non renseigné", equip="Piscine · Jardin · Terrasse · Parking", tarif="À confirmer",
  tel="À confirmer", wa="Non renseigné", web="Non renseigné", resa="Via plateformes de réservation",
  src="Booking.com (liste), recoupement à faire", statut=V_SEC, photo="grandpopo"),
]

# ───────────── Partie 5 : gastronomie et restaurants ─────────────
PLATS = [
 ("Pâte et sauces", "La pâte, boule de maïs, de manioc ou d'igname, accompagne des sauces variées (gombo, feuilles, tomate, arachide). Le plat du quotidien dans tout le pays."),
 ("Amiwo", "Pâte de maïs rouge à l'huile de palme et à la tomate, souvent servie avec du poulet ou du poisson : une spécialité du Sud-Est."),
 ("Akassa", "Pâte de maïs fermentée, enveloppée de feuilles ; sert d'accompagnement aux sauces et ragoûts."),
 ("Wagasi", "Fromage peul traditionnel au lait de vache, rôti ou frit, souvent à base de feuilles de papayer pour la coagulation ; très apprécié dans le Nord."),
 ("Poisson braisé", "Capitaine, dorade ou machoiron grillés, servis avec piment, oignons et attiéké ou igname : le plat phare des maquis de la côte."),
 ("Grillades", "Brochettes de bœuf (tchigan), poulet braisé, porc ou mouton, assaisonnés d'épices locales."),
 ("Boissons locales", "Bissap (infusion d'hibiscus), jus de gingembre, bière de sorgho (tchoukoutou) ; le sodabi, eau-de-vie de palme, se consomme avec modération."),
]

RESTAURANTS = [
 dict(nom="Maquis Super Pili-Pili", ville="Cotonou", loc="Boulevard Saint-Michel", type="Maquis / cuisine béninoise", spec="Plats locaux", horaires="Non renseigné", prix="Non renseigné", contact="Non renseigné", src="Petit Futé (liste)", statut=V_SEC),
 dict(nom="Chez Amy", ville="Cotonou", loc="Quartier Ganhi", type="Cuisine africaine", spec="Non renseigné", horaires="Non renseigné", prix="Non renseigné", contact="Non renseigné", src="Petit Futé (liste)", statut=V_SEC),
 dict(nom="Jaaba Grill & Bar", ville="Cotonou", loc="À confirmer", type="Cuisine africaine et internationale", spec="Grillades", horaires="Non renseigné", prix="Non renseigné", contact="Non renseigné", src="Tripadvisor (liste)", statut=V_SEC),
 dict(nom="L'Imprévu", ville="Cotonou", loc="À confirmer", type="Cuisine italienne et française", spec="Non renseigné", horaires="Non renseigné", prix="Non renseigné", contact="Non renseigné", src="Tripadvisor / Trip.com (liste)", statut=V_SEC),
 dict(nom="Le Resto", ville="Cotonou", loc="À confirmer", type="Cuisine italienne et libanaise", spec="Non renseigné", horaires="Non renseigné", prix="Non renseigné", contact="Non renseigné", src="Tripadvisor (liste)", statut=V_SEC),
 dict(nom="Livingstone", ville="Cotonou", loc="À confirmer", type="Restaurant international", spec="Non renseigné", horaires="Non renseigné", prix="Non renseigné", contact="Non renseigné", src="Tripadvisor / Trip.com (liste)", statut=V_SEC),
]

# ───────────── Partie 6 : transport ─────────────
TRANSPORT = [
 dict(nom="Avis — agence de l'aéroport", ville="Cotonou", type="Location de véhicules (sans chauffeur)", vehicules="Selon disponibilité", capacite="Non renseigné", tarifs="À confirmer ; selon un agrégateur, environ 86 €/jour en moyenne à Cotonou (ordre de grandeur)", conditions="Protection vol obligatoire selon Avis", contact="Via avis.com", zones="Cotonou et alentours (à confirmer)", src="avis.com ; Kayak (ordre de prix)", statut=V_SEC),
 dict(nom="Bio Bangana Marouf", ville="Cotonou (Akpakpa)", type="Location sans chauffeur — journalière ou horaire", vehicules="Non renseigné", capacite="Non renseigné", tarifs="À partir de 25 000 F CFA (indicatif)", conditions="Cotonou et environs ; déplacements dans toutes les régions possibles", contact="+229 01 97 26 53 92 (WhatsApp)", zones="Cotonou, toutes régions du Bénin", src="Welcome to Bénin (fiche « vérifié »)", statut=V_OK),
 dict(nom="Adventure and Safari in Benin", ville="Porto-Novo (Avakpa)", type="Navette aéroport, excursions et circuits", vehicules="Non renseigné", capacite="Non renseigné", tarifs="Fixé selon la prestation", conditions="Paiement mobile money (MTN MoMo, Moov, Celtiis) ; facture normalisée", contact="+229 01 94 69 92 72", zones="Sud du Bénin (à confirmer)", src="Welcome to Bénin (fiche « vérifié »)", statut=V_OK),
 dict(nom="Taxis-motos (zémidjans)", ville="Partout", type="Transport urbain individuel", vehicules="Moto", capacite="1 passager", tarifs="Négociés ou à la course (à confirmer)", conditions="Casque non systématique ; prudence", contact="—", zones="Villes", src="Pratique courante", statut=V_UNK),
]

# ───────────── Partie 7 : agences et guides ─────────────
AGENCES = [
 dict(nom="Wonder Tours And Services", ville="Ouidah (Docomey)", pres="Agence de voyage généraliste basée à Ouidah ; personnel bilingue français/anglais ; adaptée aux familles.", services="Organisation d'excursions et de circuits ; facture normalisée ; mobile money", circuits="Non renseigné", tarifs="À partir de 47 500 F CFA (indicatif)", contact="+229 01 40 89 54 22", site="Fiche sur welcometobenin.com", resa="WhatsApp (selon fiche)", agrement="À confirmer — pas de numéro d'agrément publié", src="Welcome to Bénin", statut=V_OK),
 dict(nom="Adventure and Safari in Benin", ville="Porto-Novo (Avakpa)", pres="Agence réceptive basée à Porto-Novo ; navette aéroport (Cotonou-Cadjehoun) ; adaptée aux familles.", services="Excursions et circuits ; personnel bilingue ; mobile money ; facture normalisée", circuits="Non renseigné", tarifs="Fixé selon la prestation", contact="+229 01 94 69 92 72", site="Fiche sur welcometobenin.com", resa="WhatsApp (selon fiche)", agrement="À confirmer — pas de numéro d'agrément publié", src="Welcome to Bénin", statut=V_OK),
]
GUIDES_NOTE = ("Aucun guide agréé n'a pu être nommé de façon vérifiable à la date du 25 novembre 2026 : l'annuaire de référence est en cours d'enrichissement, "
               "et la liste officielle des guides agréés n'est pas publiée en ligne à notre connaissance. Contacter Bénin Tourisme (benintourisme.bj) ou le ministère du Tourisme pour obtenir un guide agréé.")

# ───────────── Partie 8 : services pratiques ─────────────
SERVICES = [
 dict(nom="Polyclinique Les Cocotiers", cat="Santé — clinique privée", ville="Cotonou (Cadjehoun)", adresse="04 BP 1227 Cadjehoun", tel="+229 21 30 14 31 / +229 21 30 14 20", src="Liste des établissements médicaux (gov.uk) ; presse économique", statut=V_SEC, note="Une communication du Trésor français évoque l'inauguration d'une polyclinique Les Cocotiers en septembre 2026 ; vérifier l'adresse et la ligne."),
 dict(nom="Clinique Serena", cat="Santé — clinique privée", ville="Cotonou", adresse="À confirmer", tel="À confirmer", src="GoAfrica (annuaire)", statut=V_SEC, note="Urgences annoncées 24 h/24."),
 dict(nom="Clinique Sevi", cat="Santé — clinique privée", ville="Cotonou", adresse="À confirmer", tel="À confirmer", src="GoAfrica (annuaire)", statut=V_SEC, note="Établissement pluridisciplinaire avec réanimation."),
 dict(nom="Centre National Hospitalier Universitaire (CNHU)", cat="Santé — hôpital public", ville="Cotonou", adresse="Avenue Jean-Paul II", tel="À confirmer", src="Wikipédia / annuaires", statut=V_SEC, note="Principal hôpital public."),
 dict(nom="Regus — centres d'affaires et coworking", cat="Coworking et salles de réunion", ville="Cotonou", adresse="Stade de l'Amitié, Kouhounou (selon Regus)", tel="Via regus.com", src="regus.com", statut=V_SEC, note="Postes de travail à la journée, salles de réunion à l'heure."),
 dict(nom="Spaces — espaces de travail", cat="Coworking et salles de réunion", ville="Cotonou", adresse="À confirmer", tel="Via spacesworks.com", src="spacesworks.com", statut=V_SEC, note="Salles de réunion et de conférence équipées."),
 dict(nom="Ambassade / Consulat de votre pays", cat="Assistance administrative", ville="Cotonou", adresse="Voir le site de votre ministère des Affaires étrangères", tel="—", src="Sites officiels nationaux", statut=V_UNK, note="À contacter pour toute assistance administrative ou en cas d'urgence."),
]
SERVICES_NOTE = ("Pharmacies, traduction, organisation de mariages, photographie, audiovisuel et immobilier : aucune offre de prestataire vérifiable n'a pu être documentée pour cette édition. "
                 "Ces rubriques restent ouvertes aux professionnels (voir page « Rejoindre le catalogue »).")

# ───────────── Partie 3 : expériences ─────────────
# type : "C" = commercialisée (prestataire identifié) ; "S" = suggestion de découverte (non commercialisée par un prestataire vérifié)
EXPERIENCES = [
 ("Excursion en pirogue à Ganvié", "Ganvié", "Navigation entre les habitations sur pilotis, marché flottant (le matin).", "3 à 4 h", "Embarcadère d'Abomey-Calavi", "S", "Prix à négocier avant départ ; guide local conseillé", "Prestataire : À confirmer"),
 ("Mangroves du Mono en pirogue", "Grand-Popo", "Balade guidée dans les palétuviers, observation d'oiseaux, salines traditionnelles.", "2 à 3 h", "Accès depuis Grand-Popo", "S", "À confirmer", "Prestataire : À confirmer"),
 ("Route des Esclaves & Porte du Non-Retour", "Ouidah", "Parcours de mémoire guidé, stations symboliques et plage.", "2 à 3 h", "Accès libre ; guide recommandé", "S", "À confirmer", "Wonder Tours And Services peut organiser des circuits (À confirmer)"),
 ("Découverte du vodun", "Ouidah", "Rencontre respectueuse avec des prêtres et gardiens de sanctuaires, forêt sacrée.", "Demi-journée", "Guide agréé conseillé", "S", "Dons ou pourboires", "Prestataire : À confirmer"),
 ("Visite des palais royaux d'Abomey", "Abomey", "Visite guidée du musée et des cours royales.", "2 à 3 h", "Billet d'entrée (tarif à confirmer)", "S", "À confirmer", "Prestataire : À confirmer"),
 ("Atelier de poterie", "Adjarra", "Observation et initiation au colombin auprès des potières ; cuisson à ciel ouvert.", "2 h", "Sur rendez-vous", "S", "À confirmer", "Prestataire : À confirmer"),
 ("Dégustation de poisson braisé", "Cotonou / Route des Pêches", "Repas face à l'océan dans un maquis de plage.", "1 à 2 h", "Libre", "S", "Voir fourchette de prix en Partie 5", "Voir restaurants"),
 ("Marchés : Dantokpa, Ganhi, Arts et Artisanat", "Cotonou", "Immersion et achats d'artisanat.", "2 à 3 h", "Libre ; accompagné conseillé", "S", "Marchandage d'usage", "—"),
 ("Street-art de Cotonou", "Cotonou", "Promenade des fresques le long du port.", "1 à 2 h", "Libre", "S", "Gratuit", "—"),
 ("Randonnée sur les collines", "Dassa-Zoumè", "Courtes ascensions et panoramas ; Pierre fendue.", "2 à 3 h", "Libre ; guide conseillé", "S", "À confirmer", "Prestataire : À confirmer"),
 ("Navette aéroport et excursions sur mesure", "Sud du Bénin", "Transferts et excursions organisées.", "Variable", "Sur devis", "C", "Fixé selon la prestation", "Adventure and Safari in Benin (+229 01 94 69 92 72)"),
 ("Circuits à partir de Ouidah", "Sud du Bénin", "Excursions et circuits organisés par l'agence.", "Variable", "Sur devis", "C", "À partir de 47 500 F CFA (indicatif)", "Wonder Tours And Services (+229 01 40 89 54 22)"),
 ("Safari en parc national", "Nord", "Observation de la faune dans les parcs de la Pendjari et du W.", "—", "—", "N", "Non proposé", "Zone formellement déconseillée (voir avertissement)"),
]

# ───────────── Partie 9 : événements (dates vérifiées au 25/11/2026) ─────────────
EVENEMENTS = [
 dict(nom="Cotonou Comedy Festival (2ᵉ édition)", lieu="Cotonou (Dôme du Sofitel Marina, Palais des Congrès, Institut français) et Abomey-Calavi", periode="1er au 6 décembre 2026", statut_date="Dates confirmées (presse officielle béninoise)",
  desc="Festival d'humour coproduit par le gouvernement du Bénin et le groupe JokeNation (créateurs du Montreux Comedy Festival). Spectacles gratuits (Tremplin du rire, Village du rire) et galas payants.",
  acces="Billetterie : cotonoucomedy.com (tarifs non communiqués dans nos sources)", orga="Gouvernement du Bénin (ADAC) · JokeNation", contact="cotonoucomedy.com", src="gouv.bj ; beninwebtv.bj", photo="cotonou_street", futur=True),
 dict(nom="WeLovEya Festival (5ᵉ édition)", lieu="Place de l'Amazone, Cotonou", periode="26 et 27 décembre 2026", statut_date="Dates annoncées (calendrier officiel du gouvernement)",
  desc="Festival de musiques urbaines et d'afrobeat, organisé par Moov Africa Bénin et la Fondation Eya. Programmation et billetterie 2026 : à consulter sur le site officiel.",
  acces="Billetterie : weloveyafestival.com (modalités à confirmer)", orga="Moov Africa Bénin · Fondation Eya", contact="weloveyafestival.com", src="beninwebtv.bj ; calendrier du gouvernement", photo="festival", futur=True),
 dict(nom="Vodun Days 2027", lieu="Ouidah", periode="2 au 9 janvier 2027 (annoncé par le gouvernement)", statut_date="Dates annoncées — programme détaillé à confirmer",
  desc="Grande célébration culturelle et spirituelle du vodun. Les éditions précédentes duraient trois jours en janvier ; l'édition 2027 est annoncée sur une semaine. Jours fériés officiels : 7 et 8 janvier 2027.",
  acces="Accès libre à la plupart des cérémonies publiques (à confirmer) ; stands sur candidature", orga="Gouvernement du Bénin", contact="gouv.bj / benin.bj", src="beninwebtv.bj (communication gouvernementale)", photo="ouidah_vodun", futur=True),
 dict(nom="Quintessence — Festival international du film de Ouidah", lieu="Ouidah", periode="Début janvier (dates 2027 à confirmer)", statut_date="Dates 2027 non confirmées",
  desc="Doyen des festivals de cinéma du Bénin, fondé en 2003 par le cinéaste Jean Odoutan ; projections en plein air.",
  acces="Projections publiques gratuites (selon organisateur)", orga="Jean Odoutan", contact="Non renseigné", src="Welcome to Bénin (à recouper)", photo="ouidah_vodun", futur=True),
 dict(nom="FInAB — Festival international des arts du Bénin", lieu="Cotonou", periode="Autour du 20 février (dates 2027 à confirmer)", statut_date="Dates 2027 non confirmées",
  desc="Plateforme pluridisciplinaire (arts plastiques, musique, danse, mode, théâtre, cinéma, littérature) avec le village Tokp'Art.",
  acces="Non renseigné", orga="Groupe Empire", contact="Non renseigné", src="Welcome to Bénin (à recouper)", photo="cotonou_street", futur=True),
 dict(nom="Festival des Masques de Porto-Novo", lieu="Porto-Novo", periode="Fin juillet ou début août (2027 à confirmer)", statut_date="Dates non confirmées",
  desc="Parade de masques (Guèlèdè, inscrit au patrimoine culturel immatériel de l'UNESCO ; Egungun, Zangbeto).",
  acces="Non renseigné", orga="À confirmer", contact="Non renseigné", src="Welcome to Bénin (à recouper)", photo="festival", futur=True),
 dict(nom="Ouidah Jazz Festival", lieu="Ouidah (Maison de la Culture)", periode="Fin août (dates 2027 à confirmer)", statut_date="Dates non confirmées",
  desc="Trois soirées de jazz et de rythmes afro-diasporiques.", acces="Non renseigné", orga="À confirmer", contact="Non renseigné", src="Welcome to Bénin (à recouper)", photo="festival", futur=True),
 dict(nom="JISTNA — Journée internationale du souvenir de la traite négrière et de son abolition", lieu="Ouidah (Porte du Non-Retour)", periode="23 août (chaque année)", statut_date="Date fixe annuelle (UNESCO)",
  desc="Cérémonie de recueillement sur la plage ; instituée par l'UNESCO.", acces="Ouvert au public", orga="À confirmer", contact="Non renseigné", src="UNESCO ; Welcome to Bénin", photo="ouidah_porte", futur=True),
 dict(nom="La Gaani", lieu="Nikki", periode="Date mobile (calendrier lunaire, lendemain du Maouloud)", statut_date="Date 2027 à confirmer ; zone Nord soumise à avis de sécurité",
  desc="Fête équestre et royale du peuple baatonu, avec parade de cavaliers wasangari. Voir avertissement sécurité avant tout déplacement.", acces="Non renseigné", orga="Cour impériale de Nikki", contact="Non renseigné", src="Welcome to Bénin (à recouper)", photo="nikki_gaani", futur=True),
 dict(nom="Black Travel Summit 2027", lieu="Cotonou (annoncé)", periode="Dates non annoncées", statut_date="Dates non annoncées",
  desc="Première édition africaine du sommet des professionnels afro-descendants du tourisme : annoncée en octobre 2026 ; partenaire local : Bénin Tourisme.", acces="Non renseigné", orga="Black Travel Summit · Bénin Tourisme", contact="blacktravelsummit.com ; benintourisme.bj", src="gouv.bj ; presse béninoise", photo="cotonou_ville", futur=True),
 dict(nom="Kaléta", lieu="Sud du Bénin (Ouidah, Porto-Novo, Cotonou)", periode="Fin d'année (tradition de Noël)", statut_date="Tradition annuelle, sans date fixe",
  desc="Tradition carnavalesque héritée des Afro-descendants du Brésil : danseurs masqués et percussions dans les rues.", acces="Libre (rue)", orga="Quartiers", contact="—", src="Welcome to Bénin", photo="festival", futur=True),
]

# ───────────── Partie 10 : circuits ─────────────
# Distances/durées routières : estimations éditoriales, hors imprévus (à confirmer avec un chauffeur local).
CIRCUITS = [
 dict(id="c24", titre="24 heures à Cotonou", duree="24 heures", theme="Découverte urbaine", route=["Cotonou"],
  jours=[("Matin", "Fidjrossè, petit-déjeuner face à l'océan ; Place des Amazones et Mur du Port."), ("Midi", "Poisson braisé sur la Route des Pêches."), ("Après-midi", "Marché des Arts et de l'Artisanat ; cathédrale ; corniche."), ("Soir", "Dîner et musique live en bord de mer.")],
  trajets="Tous les trajets intra-urbains < 40 min (hors embouteillages)", hebergement="Hôtels de Cotonou (voir Partie 4)", inclus="Non défini (circuit libre)", non_inclus="Tout", tarif="Sur demande"),
 dict(id="c3", titre="Week-end mémoire et lagune", duree="3 jours / 2 nuits", theme="Patrimoine et histoire", route=["Cotonou", "Ouidah", "Ganvié"],
  jours=[("Jour 1", "Arrivée à Cotonou ; Marina, Place des Amazones, marché des Arts."), ("Jour 2", "Ouidah : Route des Esclaves, Porte du Non-Retour, Temple des Pythons, Forêt de Kpassè, Fort portugais. Nuit à Ouidah ou retour Cotonou."), ("Jour 3", "Matinée à Ganvié en pirogue ; retour à Cotonou et départ.")],
  trajets="Cotonou–Ouidah : 45–60 min · Cotonou–Abomey-Calavi (embarcadère) : 30–60 min", hebergement="Cotonou ou Ouidah", inclus="À définir avec un prestataire", non_inclus="Vols, visas, repas non mentionnés", tarif="Sur demande"),
 dict(id="c5", titre="Du Sud royal à l'océan", duree="5 jours / 4 nuits", theme="Culture et traditions", route=["Cotonou", "Ouidah", "Grand-Popo", "Abomey", "Porto-Novo"],
  jours=[("Jour 1", "Cotonou."), ("Jour 2", "Ouidah, route vers Grand-Popo, nuit à Grand-Popo."), ("Jour 3", "Mangroves du Mono et Bouche du Roy ; Villa Karo."), ("Jour 4", "Route vers Abomey (3 h environ) ; palais royaux, Place Goho."), ("Jour 5", "Retour par Porto-Novo (musées) ; retour à Cotonou.")],
  trajets="Grand-Popo–Abomey : ~3 h · Abomey–Porto-Novo : ~2 h 30 · Porto-Novo–Cotonou : ~1 h", hebergement="Ouidah / Grand-Popo / Abomey / Porto-Novo (à confirmer)", inclus="À définir", non_inclus="À définir", tarif="Sur demande"),
 dict(id="c7", titre="Une semaine de la côte aux collines", duree="7 jours / 6 nuits", theme="Découverte du Sud et du Centre", route=["Cotonou", "Ouidah", "Grand-Popo", "Abomey", "Dassa-Zoumè", "Porto-Novo"],
  jours=[("Jour 1", "Cotonou."), ("Jour 2", "Ouidah."), ("Jour 3", "Grand-Popo, mangroves."), ("Jour 4", "Grand-Popo → Abomey."), ("Jour 5", "Abomey → Dassa-Zoumè (collines, grotte d'Arigbo)."), ("Jour 6", "Dassa-Zoumè → Porto-Novo (~4 h)."), ("Jour 7", "Porto-Novo → Cotonou.")],
  trajets="Abomey–Dassa : ~1 h 30 · Dassa–Porto-Novo : ~4 h", hebergement="À confirmer", inclus="À définir", non_inclus="À définir", tarif="Sur demande"),
 dict(id="c10", titre="Dix jours entre mémoire et collines", duree="10 jours / 9 nuits", theme="Voyage de découverte des origines", route=["Cotonou", "Ouidah", "Grand-Popo", "Abomey", "Dassa-Zoumè", "Porto-Novo"],
  jours=[("Jours 1-2", "Cotonou, immersion urbaine."), ("Jours 3-4", "Ouidah : parcours mémoriel, rencontres avec des guides historiens."), ("Jours 5-6", "Grand-Popo, temps de repos."), ("Jour 7", "Abomey et palais."), ("Jours 8-9", "Dassa-Zoumè et Porto-Novo."), ("Jour 10", "Retour Cotonou.")],
  trajets="Voir circuits 5 et 7 jours", hebergement="À confirmer", inclus="À définir", non_inclus="À définir", tarif="Sur demande",
  note="Pour les voyageurs de la diaspora : se renseigner auprès des autorités béninoises sur le programme de nationalité « My Afro Origins » (information relayée par l'annuaire de référence, à vérifier sur le site officiel)."),
 dict(id="c14", titre="Quatorze jours : Sud, Centre et Nord culturel", duree="14 jours / 13 nuits", theme="Grande traversée", route=["Cotonou", "Ouidah", "Abomey", "Dassa-Zoumè", "Parakou"],
  jours=[("Jours 1-5", "Circuit du Sud (voir circuit 5 jours)."), ("Jours 6-7", "Dassa-Zoumè."), ("Jours 8-9", "Route vers Parakou (musée en plein air)."), ("Jours 10-13", "Retour progressif vers le Sud : repos à Grand-Popo."), ("Jour 14", "Cotonou.")],
  trajets="Dassa–Parakou : ~3 h · Parakou–Cotonou : 6–7 h", hebergement="À confirmer", inclus="À définir", non_inclus="À définir", tarif="Sur demande",
  note="Ce circuit ne comprend volontairement ni Natitingou, ni Boukoumbé, ni la Pendjari : zones concernées par les avis de sécurité (voir page d'avertissement)."),
]
CIRCUITS_THEMES = [
 ("Plages et détente", "Grand-Popo (3 nuits) + Fidjrossè : plage, mangroves, lectures, pas de programme imposé."),
 ("Gastronomie", "Cotonou, Ouidah, Grand-Popo : marchés (Ganhi, Dantokpa), maquis, poisson braisé."),
 ("Voyage familial", "Cotonou, Ganvié, Ouidah (musées), Grand-Popo (plage et pirogue)."),
 ("Voyage premium", "Hôtels de luxe de Cotonou (Sofitel…), chauffeur privé, guide spécialisé : sur devis."),
 ("Nature et aventure", "Collines de Dassa, mangroves du Mono ; le Nord : sous réserve des avis officiels."),
 ("Safari", "Non proposé à la date de publication (parcs formellement déconseillés par certaines autorités)."),
]

# ───────────── Sources documentaires ─────────────
SOURCES = [
 ("Welcome to Bénin (référence fonctionnelle)", "https://welcometobenin.com/fr", "Structure, rubriques, attractions, événements, annuaire. Non reproduit : textes, identité visuelle, photographies."),
 ("Wikimedia Commons (photographies)", "https://commons.wikimedia.org/", "Licences individuelles : voir crédits photographiques."),
 ("Ministère de l'Europe et des Affaires étrangères (France) — Conseils aux voyageurs, Bénin : sécurité", "https://www.diplomatie.gouv.fr/fr/information-par-pays/benin/conseils-aux-voyageurs-securite", "Zones déconseillées (fiche actualisée le 21/04/2026 selon la page)."),
 ("Ministère de l'Europe et des Affaires étrangères (France) — Santé", "https://www.diplomatie.gouv.fr/fr/information-par-pays/benin/conseils-aux-voyageurs-sante", "Recommandations sanitaires."),
 ("Institut Pasteur — Recommandations par pays : Bénin", "https://www.pasteur.fr/fr/votre-sante/voyages-et-sante/recommandations-sanitaires-par-pays/benin", "Santé du voyageur."),
 ("Portail officiel e-Visa du Bénin", "https://evisa.bj", "Formalités d'entrée (le site officiel fait foi)."),
 ("Gouvernement du Bénin (gouv.bj)", "https://www.gouv.bj", "Calendrier officiel, communiqués (Vodun Days 2027, Cotonou Comedy Festival, Black Travel Summit)."),
 ("Benin Web TV", "https://beninwebtv.bj", "Presse locale : dates d'événements, numéros d'urgence (ARCEP)."),
 ("ARCEP Bénin — numéros courts d'urgence", "https://beninwebtv.bj/larcep-benin-publie-la-liste-officielle-des-numeros-courts-durgence-et-dassistance/", "Pompiers 118, SAMU 112, police 116/117."),
 ("African Parks — Pendjari", "https://africanparks.org/the-parks/pendjari/visit-park", "Page opérateur ; à croiser avec les avis de sécurité."),
 ("Accor — hôtels de Cotonou", "https://all.accor.com/a/en/destination/city/hotels-cotonou-v7367.html", "Sofitel Cotonou Marina, Novotel Cotonou Orisha, ibis Cotonou."),
 ("Avis — Cotonou", "https://www.avis.com/fr/locations/af/bp/cotonou/coo", "Agence de l'aéroport, horaires et conditions."),
 ("UNESCO — Palais royaux d'Abomey (1985) ; complexe W-Arly-Pendjari (2017)", "https://whc.unesco.org/", "Patrimoine mondial."),
 ("Wikipédia — pages Bénin, Ouidah, Abomey, Cotonou", "https://fr.wikipedia.org/wiki/B%C3%A9nin", "Faits généraux, recoupement."),
 ("Petit Futé — restaurants au Bénin", "https://www.petitfute.com/p106-benin/c1165-restaurants", "Listes de restaurants (secondaire)."),
 ("Tripadvisor — restaurants au Bénin", "https://www.tripadvisor.fr/Restaurants-g293764-Benin.html", "Listes (secondaire)."),
 ("Regus / Spaces — coworking à Cotonou", "https://www.regus.com/en/bj/cotonou/coworking", "Espaces de travail (secondaire)."),
 ("GOV.UK — Benin: list of medical facilities", "https://www.gov.uk/government/publications/benin-doctors/benin-list-of-medical-facilities", "Établissements médicaux (secondaire)."),
]
