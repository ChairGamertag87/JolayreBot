# JolayreBot

Ce projet est un bot Discord multifonction conçu pour centraliser la modération, l'animation, l'économie et les logs d'un serveur communautaire.

Le bot est développé en JavaScript (Node.js) avec la librairie discord.js. Conformément aux standards actuels, il utilise les Slash Commands (/) pour toutes les interactions.

## Fonctionnalités Principales

### Moderation et Administration
Système complet pour gérer les membres et la sécurité du serveur.
* Gestion des roles : /addrole, /removerole.
* Sanctions : /ban, /kick, /mute (timeout), /unmute, /warn.
* Gestion des salons : /lock, /unlock, /clear.
* Logs : Historique des actions de modération.

### Bienvenue et Tracking
Gestion des arrivées des nouveaux membres.
* Message de bienvenue avec mention de l'utilisateur.
* Affichage de la date de création du compte pour identifier les comptes récents.
* Invite Tracker : Indication du membre ayant généré l'invitation utilisée.

### Systeme de Niveaux (XP)
Gamification de l'activité du serveur.
* Gain d'XP via l'activité écrite (messages) et vocale (temps passé en vocal).
* Commande /rank pour voir son niveau et sa progression.
* Configuration des salons ignorés pour éviter le spam.

### Economie et Casino
Système monétaire virtuel complet.
* Monnaie : Système de "Coins" gagnés via /daily et /work.
* Casino : Commandes pour parier (Pile ou Face, Machine à sous, Blackjack, Roulette).
* Boutique : /shop pour visualiser les items et /buy pour acheter des rôles automatiquement.
* Guide : Commande /help economy pour expliquer le fonctionnement.

### Utilitaires
Outils divers pour l'animation.
* /sondage : Création de sondages avec réactions automatiques.
* /annonce : Envoi de messages formatés (Embed) dans un salon spécifique.
* /userinfo : Affichage des informations d'un membre (Rôles, date d'arrivée, ID).
* /serverinfo : Statistiques du serveur.

### Gestion des Logs
Surveillance et archivage des événements du serveur.
* Messages : Suivi des suppressions et modifications.
* Vocal : Connexion, déconnexion, déplacement, partage d'écran.
* Utilisateurs : Changement de pseudo, photo de profil, ajout/retrait de rôles.
* Serveur : Création et suppression de salons ou de rôles.

---

## Architecture du Projet

Le projet suit une structure modulaire stricte pour séparer les commandes, les événements et la base de données.

```text
root/
├── .env                  # Variables d'environnement (Token, DB_URI, IDs) [cite: 63]
├── config.json           # Configuration générale (Couleurs, Emojis)
├── package.json          # Dépendances (discord.js, mongoose, etc.) [cite: 62]
├── index.js              # Point d'entrée principal (Shard Manager ou Main)
│
└── src/
    ├── commands/         # Gestionnaires des Slash Commands
    │   ├── moderation/   # ban.js, kick.js, mute.js, clear.js, lock.js
    │   ├── economy/      # daily.js, work.js, shop.js, buy.js
    │   ├── casino/       # coinflip.js, slots.js, blackjack.js, roulette.js
    │   ├── levels/       # rank.js, leaderboard.js
    │   └── utility/      # poll.js, announce.js, userinfo.js, serverinfo.js
    │
    ├── events/           # Gestionnaires d'événements (Event Handlers)
    │   ├── client/       # ready.js, interactionCreate.js (Logique Slash Cmds)
    │   ├── guild/        # guildMemberAdd.js (Bienvenue/Invite Tracker)
    │   ├── messages/     # messageCreate.js (XP), messageDelete.js (Logs)
    │   ├── voice/        # voiceStateUpdate.js (XP Vocal & Logs)
    │   └── logs/         # Events spécifiques aux logs (channelUpdate, roleUpdate)
    │
    ├── handlers/         # Chargeurs dynamiques
    │   ├── commandHandler.js
    │   ├── eventHandler.js
    │   └── databaseHandler.js
    │
    ├── database/         # Modèles de Base de Données (Schemas Mongoose) 
    │   ├── User.js       # Stockage Eco, XP, Warns
    │   ├── Guild.js      # Configuration serveur (Salons logs, Autoroles)
    │   └── Shop.js       # Items de la boutique
    │
    └── utils/            # Fonctions réutilisables
        ├── logger.js     # Système de formatage des logs dans les salons Discord
        ├── inviteTracker.js # Logique de suivi des invitations
        └── casinoLogic.js # Algorithmes des jeux
