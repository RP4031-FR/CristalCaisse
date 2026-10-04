> **CristalCaisse** est un système de caisse enregistreuse complet qui tient dans un seul fichier HTML.  
> Pas d'installation. Pas de connexion internet obligatoire. Pas d'abonnement. Ouvrez le fichier, travaillez.

---

## Ce qui est nouveau dans la version 4.0

### 🔷 Nouvelle identité — CristalCaisse

Le projet change de nom : **CaisseOS** devient **CristalCaisse**. Le mot « Cristal » est mis en avant dans un badge violet distinctif sur tous les écrans (connexion, barre de navigation, écran client). Toutes les mentions internes (tickets, sauvegardes, messages système) ont été mises à jour vers la nouvelle identité.

### 🔍 Scanner de codes-barres

Chaque article peut désormais recevoir un **code-barre** lors de sa création ou de sa modification. Une fois configuré, il suffit de scanner l'article avec une **douchette USB ou Bluetooth** (fonctionnant en émulation clavier, standard sur la quasi-totalité du matériel du marché) pour qu'il soit **directement ajouté au panier**, sans clic, sans recherche manuelle.

Le système détecte automatiquement la différence entre une frappe humaine et un scan (basé sur la vitesse de frappe), pour éviter tout déclenchement accidentel pendant la saisie normale.

### 🔒 Sécurité renforcée — hachage SHA-256 salé

Les mots de passe ne sont plus stockés en simple encodage réversible. CristalCaisse utilise désormais l'**API Web Crypto native du navigateur** pour hacher chaque mot de passe avec SHA-256 et un sel aléatoire unique par compte. Les comptes créés avec une ancienne version sont migrés automatiquement et silencieusement à la première connexion réussie, sans aucune action requise de l'utilisateur.

### 📜 Page de connexion défilable

Correction d'un défaut d'affichage : la page de connexion peut désormais défiler correctement sur les petits écrans ou lorsque le contenu (import de sauvegarde, panneau écran client) dépasse la hauteur visible.

---

## Table des matières

- [Présentation générale](#présentation-générale)
- [Fonctionnalités v4.0 — Détail complet](#fonctionnalités-v40--détail-complet)
  - [Identité CristalCaisse](#-identité-cristalcaisse)
  - [Scanner de codes-barres](#-scanner-de-codes-barres)
  - [Sécurité des mots de passe](#-sécurité-des-mots-de-passe)
- [Fonctionnalités v3.0](#fonctionnalités-v30)
  - [Écran client](#-écran-client)
  - [Pad numérique](#-pad-numérique)
  - [Import de sauvegarde](#-import-de-sauvegarde)
- [Fonctionnalités v2.0](#fonctionnalités-v20)
  - [Caisse POS](#-caisse-pos)
  - [Moyens de paiement](#-moyens-de-paiement)
  - [Cartes cadeaux](#-cartes-cadeaux)
  - [Programme de fidélité](#-programme-de-fidélité)
  - [Remboursements](#-remboursements)
  - [Tickets de caisse](#-tickets-de-caisse)
  - [Historique et statistiques](#-historique-et-statistiques)
  - [Réglages et multi-comptes](#-réglages-et-multi-comptes)
  - [Mode Noir et Blanc](#-mode-noir-et-blanc)
- [Architecture technique](#architecture-technique)
- [Modèle de données](#modèle-de-données)
- [Compatibilité matériel scanner](#compatibilité-matériel-scanner)
- [Cas d'usage par commerce](#cas-dusage-par-commerce)
- [Installation](#installation)
- [Sécurité et confidentialité](#sécurité-et-confidentialité)
- [Checklist de tests](#checklist-de-tests)
- [Contribuer](#contribuer)
- [Changelog complet](#changelog-complet)

---

## Présentation générale

CristalCaisse naît d'un constat simple : la plupart des solutions de caisse modernes imposent des contraintes inutiles aux commerçants indépendants — abonnement mensuel de 30 à 200 euros, serveur à maintenir, connexion internet permanente, formation technique.

CristalCaisse fait le choix inverse. Tout tient dans un seul fichier HTML de moins de 180 Ko. On l'ouvre dans un navigateur, on crée un compte en 30 secondes, et on commence à vendre. Les données restent sur l'appareil, dans le stockage local du navigateur, sans jamais transiter par un serveur tiers.

### Chiffres clés

| Indicateur | Valeur |
|:---|:---|
| Format | Un seul fichier `.html` |
| Taille | Moins de 180 Ko |
| Dépendances externes | 0 (police web uniquement) |
| Frameworks JavaScript | Aucun — Vanilla JS pur |
| Connexion internet requise | Non (hors chargement initial des polices) |
| Données envoyées à un serveur | Jamais |
| Chiffrement mot de passe | SHA-256 salé (Web Crypto API) |
| Temps d'installation | Zéro seconde |
| Prix | Gratuit, open-source |

---

## Fonctionnalités v4.0 — Détail complet

### 🔷 Identité CristalCaisse

Le renommage touche l'intégralité de l'interface et des artefacts générés :

- Logo sur la page de connexion, la barre de navigation et l'écran client, avec le mot **Cristal** dans un badge violet arrondi
- Pied de page des tickets imprimés
- Bon de remboursement
- Nom des fichiers de sauvegarde exportés
- Messages d'erreur et de confirmation liés à l'import de sauvegarde
- Canal de communication interne (écran client) renommé en cohérence

Le badge violet est construit en unités relatives (`em`), il s'adapte donc automatiquement à toutes les tailles de police utilisées dans l'application, du plus petit logo de la barre de navigation au très grand logo de l'écran d'accueil client.

### 🔍 Scanner de codes-barres

**Côté catalogue**

Un nouveau champ **Code barre** apparaît dans le formulaire de création et de modification d'article. Il accepte :
- Une saisie manuelle au clavier
- Un scan direct avec une douchette USB ou Bluetooth (le champ se remplit comme s'il s'agissait d'une frappe clavier classique)

Si un code-barre est déjà utilisé par un autre article, un avertissement s'affiche mais n'empêche pas l'enregistrement, pour ne pas bloquer des cas d'usage légitimes (variantes, doublons temporaires en cours de saisie).

Le code-barre, lorsqu'il est renseigné, s'affiche en police monospace sous chaque fiche article dans la grille de la caisse.

**Côté encaissement**

Un écouteur global analyse en permanence la frappe clavier lorsque l'utilisateur se trouve sur l'écran de caisse, sans qu'aucun clic préalable ne soit nécessaire. Le système :

1. Constitue un tampon de caractères au fur et à mesure de la frappe
2. Mesure l'intervalle de temps entre chaque caractère — un scanner de codes-barres tape systématiquement à une vitesse largement supérieure à la frappe humaine
3. Réinitialise le tampon si le délai entre deux caractères dépasse un seuil cohérent avec une frappe manuelle
4. À la réception du caractère de fin d'envoi (Entrée, standard sur tous les lecteurs), recherche le code correspondant dans le catalogue
5. Si l'article est trouvé, il est **ajouté au panier instantanément** avec une confirmation visuelle
6. Si aucun article ne correspond, un message d'erreur s'affiche avec le code scanné

Ce mécanisme fonctionne aussi bien lorsque le focus clavier n'est sur aucun champ particulier que lorsque le curseur se trouve dans la barre de recherche — dans ce dernier cas, le champ est automatiquement vidé après le scan pour rester prêt pour le suivant. La détection est désactivée automatiquement dès qu'une fenêtre modale est ouverte (paiement, ajout d'article, remboursement…), pour éviter toute interférence avec la saisie en cours.

### 🔒 Sécurité des mots de passe

**Ancien comportement** : les mots de passe étaient encodés en Base64, un encodage réversible en une seule ligne de code, n'offrant donc aucune protection réelle en cas d'accès aux données stockées.

**Nouveau comportement** : chaque mot de passe est haché avec l'algorithme **SHA-256**, précédé d'un **sel aléatoire de 16 octets généré par compte** via `crypto.getRandomValues()`. Le sel est stocké aux côtés du hash, mais le mot de passe en clair n'est jamais conservé sous aucune forme récupérable.

**Migration transparente** : les comptes créés avant cette mise à jour continuent de fonctionner normalement. Lors de la première connexion réussie après la mise à jour, le mot de passe est automatiquement re-haché selon le nouveau schéma, sans interruption de service et sans demander à l'utilisateur de le ressaisir ailleurs que sur l'écran de connexion habituel.

---

## Fonctionnalités v3.0

### 📺 Écran client

Un second affichage entièrement dédié au client, synchronisé en temps réel avec la caisse via l'API `BroadcastChannel` du navigateur, sans serveur ni réseau.

**Activation côté vendeur** : un bouton dans la barre de navigation génère un code de session à 6 caractères, à saisir sur l'écran client pour établir la connexion.

**Accès également depuis la page de connexion** : un client peut rejoindre une session sans que le vendeur ait besoin d'être connecté à son propre compte au moment de la configuration initiale.

**Cinq états d'affichage :**

| État | Ce qui est montré |
|:---|:---|
| Connexion | Saisie du code de session |
| Attente | Logo et nom de l'entreprise, animation d'accueil |
| Panier | Liste des articles en temps réel, total en très grand format, remise, fidélité, note |
| Paiement | Mode de paiement sélectionné, total, monnaie à rendre |
| Merci | Écran de remerciement 5 secondes, points fidélité gagnés |

**Portée** : fonctionne parfaitement sur un second écran du même ordinateur. Pour deux appareils distincts, ils doivent partager le même fichier via un serveur local sur le même réseau.

### 🔢 Pad numérique

Un clavier virtuel tactile accessible depuis le panier, avec quatre modes de saisie : **Quantité**, **Remise %**, **Prix**, **Note**. Idéal pour les écrans tactiles et les tablettes en caisse.

En mode Quantité ou Prix, une liste des articles du panier permet de sélectionner celui à modifier avant de saisir la nouvelle valeur au pavé. La touche point décimal est disponible pour les modes Prix et Note.

### 📂 Import de sauvegarde

Restauration complète d'un compte depuis un fichier `.json` exporté précédemment, directement depuis l'écran de connexion, par glisser-déposer ou sélection de fichier. Un aperçu détaillé (entreprise, nombre d'articles, transactions, cartes cadeaux, clients fidélité, date) s'affiche avant confirmation, avec connexion automatique après restauration.

---

## Fonctionnalités v2.0

### 🛒 Caisse POS

Grille d'articles responsive avec recherche instantanée (par nom, catégorie **ou code-barre**), filtres par catégorie, gestion de panier complète, remise en pourcentage, note de commande libre, gestion automatique du stock.

### 💳 Moyens de paiement

Quatre modes : **Carte Bancaire**, **Espèces** (avec calcul automatique de la monnaie), **Carte Cadeau** (vérification de solde en temps réel), **Paiement Mixte** (répartition libre entre les trois précédents).

### 🎁 Cartes cadeaux

Création avec montants raccourcis ou libres, code auto-généré ou personnalisé, bénéficiaire et occasion, recharge, historique d'utilisation, statuts visuels (Active, Partielle, Épuisée). Génération automatique d'un avoir sous forme de carte cadeau lors d'un remboursement.

### ⭐ Programme de fidélité

Points par euro dépensé, seuil et valeur de récompense entièrement paramétrables, classement automatique des clients, historique des 10 dernières transactions par client, ajustement manuel des points.

### ↩ Remboursements

Remboursement partiel ou total, sélection article par article avec quantités précises, trois modes (Espèces, CB, Avoir), restauration automatique du stock, déduction proportionnelle des points fidélité, badges visuels dans l'historique.

### 🧾 Tickets de caisse

Rendu fidèle au format thermique 80mm, numérotation séquentielle, détail complet des articles et du règlement, section fidélité, historique des remboursements, impression native du navigateur.

### 📊 Historique et statistiques

Tableau de bord avec ventes totales, chiffre d'affaires brut et net, panier moyen, remboursements, répartition par mode de paiement. Recherche et tri multi-critères. Export CSV compatible Excel français.

### ⚙️ Réglages et multi-comptes

Plusieurs comptes indépendants sur le même navigateur, session persistante, paramétrage complet de l'entreprise et du programme de fidélité, export de sauvegarde JSON, suppression de compte sécurisée.

### 🎨 Mode Noir et Blanc

Thème monochrome activable en un clic, conçu pour les terminaux fixes de comptoir et les environnements très éclairés.

---

## Architecture technique

```
CristalCaisse.html
│
├── ① CSS
│   ├── Reset & Variables CSS (thèmes dark + bw)
│   ├── Badge de marque (.brand-cristal)
│   ├── Composants UI (boutons, inputs, modals, toasts)
│   ├── Vues (auth, pos, cart, stats, gc, loyalty, refund, settings)
│   ├── Pad numérique
│   ├── Écran client (5 états)
│   └── Import backup
│
├── ② HTML
│   ├── #view-auth (Connexion / Inscription / Import / Accès écran client)
│   ├── #client-display (Écran client plein écran)
│   ├── #app
│   │   ├── #topbar (Logo · Entreprise · Nav · Écran client · Compte)
│   │   └── #main-content (Caisse · Historique · Cartes · Fidélité · Réglages)
│   └── Modals (Paiement, Article avec code-barre, Ticket, Remboursement,
│                Carte cadeau, Client fidélité, Écran client, Confirmation)
│
└── ③ JavaScript
    ├── STATE, STORAGE, SÉCURITÉ (hash SHA-256 salé)
    ├── AUTH (login, register, migration mot de passe)
    ├── IMPORT BACKUP
    ├── VIEWS, PRODUCTS (avec barcode), CART, PAYMENT
    ├── RECEIPTS, HISTORY, GIFT CARDS, LOYALTY, REFUNDS
    ├── SETTINGS
    ├── CLIENT DISPLAY (BroadcastChannel)
    ├── NUMERIC PAD
    ├── BARCODE SCANNER (détection HID par timing de frappe)
    └── UTILS
```

---

## Modèle de données

```typescript
interface Account {
  id: string;
  username: string;
  password: string;      // Hash SHA-256
  salt: string;           // Sel aléatoire 16 octets (hex)
  company: string;
  phone: string;
  footer: string;
  tva: number;
  showTva: boolean;
  bw: boolean;
  loyaltyRate: number;
  loyaltyThreshold: number;
  loyaltyReward: number;
  nextTicket: number;
  products: Product[];
  transactions: Transaction[];
  giftCards: GiftCard[];
  loyaltyCustomers: LoyaltyCustomer[];
}

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  emoji: string;
  stock: number | null;
  barcode: string | null;   // Nouveau — code-barre pour scan direct
}

interface Transaction {
  id: string;
  number: number;
  date: string;
  isRefund?: boolean;
  items: TransactionItem[];
  subtotal: number;
  discount: number;
  discountAmt: number;
  tva: number;
  tvaAmt: number;
  total: number;
  note: string;
  payment: Payment;
  loyaltyCustomerId: string | null;
  refunds?: Refund[];
}

interface GiftCard {
  code: string;
  amount: number;
  remaining: number;
  beneficiary: string;
  occasion: string;
  createdAt: string;
  lastUsed: string | null;
}

interface LoyaltyCustomer {
  id: string;
  name: string;
  phone: string;
  email: string;
  points: number;
  totalSpent: number;
  createdAt: string;
  history: LoyaltyHistory[];
}
```

---

## Compatibilité matériel scanner

CristalCaisse fonctionne avec **tout lecteur de codes-barres en mode émulation clavier (HID)**, c'est-à-dire la très grande majorité des douchettes vendues dans le commerce, qu'elles soient filaires (USB) ou sans fil (Bluetooth, 2.4 GHz avec dongle). Ces appareils « tapent » le code scanné comme le ferait un clavier physique, suivi d'une touche Entrée — aucun pilote, aucune configuration logicielle particulière n'est nécessaire.

| Type de lecteur | Compatibilité |
|:---|:---:|
| USB filaire (émulation clavier) | ✅ Plug & play |
| Bluetooth avec dongle USB | ✅ Plug & play |
| Bluetooth appairage direct | ✅ Fonctionne comme un clavier Bluetooth classique |
| Lecteur avec mode « port série » | ⚠️ Nécessite de basculer l'appareil en mode clavier via son manuel |
| Application scanner sur smartphone | ⚠️ Dépend de l'application (certaines émulent le clavier, d'autres non) |

---

## Cas d'usage par commerce

| Commerce | Fonctionnalités clés |
|:---|:---|
| 🥐 Boulangerie | Codes-barres sur produits industriels, espèces + monnaie automatique |
| ☕ Café / Salon de thé | Note de commande, fidélité clients réguliers, écran client au comptoir |
| 🍕 Restaurant | Paiement mixte, remboursement sur plat non livré, écran client en salle |
| 💇 Salon de coiffure | Fidélité avec récompenses, remboursement partiel |
| 🎁 Boutique cadeaux | Cartes cadeaux à montants variés, export CSV comptable |
| 📚 Librairie / Papeterie | Codes-barres ISBN, gestion stock précise, historique détaillé |
| 🧴 Institut / Spa | Fidélité, cartes cadeaux bien-être, écran client accueil |
| 🍦 Glacier / Food truck | Pad numérique tactile, espèces rapides, mode B&W en plein soleil |
| 🛒 Épicerie / Supérette | Scan rapide multi-articles, gestion stock par code-barre |

---

## Installation

### Utilisation locale (recommandée)

Téléchargez le fichier `CristalCaisse.html` et ouvrez-le dans votre navigateur. C'est tout.

### Serveur local pour l'écran client multi-appareils

```bash
cd dossier-contenant-cristalcaisse
python3 -m http.server 8080
# Accès caisse  : http://localhost:8080/CristalCaisse.html
# Accès client  : http://[IP-DE-VOTRE-MACHINE]:8080/CristalCaisse.html?mode=client
```

### Déploiement sur serveur statique

Le fichier est 100% statique, déployable sur n'importe quel hébergeur : GitHub Pages, Netlify, Vercel, hébergement mutualisé.

### Docker

```dockerfile
FROM nginx:alpine
COPY CristalCaisse.html /usr/share/nginx/html/index.html
EXPOSE 80
```

---

## Sécurité et confidentialité

- **Mots de passe** : hachés en SHA-256 avec sel aléatoire par compte, jamais stockés en clair ni sous forme réversible
- **Données de vente** : stockées exclusivement dans le `localStorage` du navigateur, jamais transmises à un serveur
- **Écran client** : la synchronisation `BroadcastChannel` reste strictement locale à l'appareil ou au réseau local, aucune donnée ne transite par internet
- **Recommandation** : effectuez des exports de sauvegarde JSON réguliers (Réglages → Télécharger toutes les données), le `localStorage` n'étant pas garanti de façon permanente par tous les navigateurs (nettoyage automatique possible en cas d'espace disque faible)
- **Appareil partagé** : utilisez systématiquement le bouton Déconnexion entre deux utilisateurs

---

## Checklist de tests

```
IDENTITÉ
  [ ] Logo "Cristal" affiché avec badge violet sur toutes les vues
  [ ] Badge correctement dimensionné sur petit logo (topbar) et grand logo (écran client idle)
  [ ] Mode B&W : badge passe en noir/blanc sans perte de lisibilité

CODES-BARRES
  [ ] Création d'article avec code-barre → enregistré correctement
  [ ] Code-barre dupliqué → avertissement affiché, enregistrement non bloqué
  [ ] Scan avec douchette USB, curseur nulle part → article ajouté au panier
  [ ] Scan avec curseur dans la barre de recherche → article ajouté, champ vidé
  [ ] Scan pendant qu'une modale est ouverte → aucune action déclenchée
  [ ] Frappe manuelle lente d'un code existant + Entrée → pas de faux déclenchement
  [ ] Code-barre inconnu scanné → message d'erreur affiché

SÉCURITÉ MOTS DE PASSE
  [ ] Nouveau compte → mot de passe haché avec sel présent
  [ ] Connexion avec ancien compte (sans champ salt) → connexion réussie
  [ ] Après cette connexion → compte migré silencieusement vers le nouveau schéma
  [ ] Changement de mot de passe → nouveau sel généré

PAGE DE CONNEXION
  [ ] Contenu complet visible et défilable sur petit écran
  [ ] Panneau import + panneau écran client accessibles sans coupure
```

---

## Contribuer

```bash
git clone https://github.com/votreuser/CristalCaisse.git
cd CristalCaisse
git checkout -b feature/nom-de-la-fonctionnalite
# Modifications dans CristalCaisse.html
git add CristalCaisse.html
git commit -m "feat: description"
git push origin feature/nom-de-la-fonctionnalite
```

### Convention de commits

| Préfixe | Usage |
|:---|:---|
| `feat:` | Nouvelle fonctionnalité |
| `fix:` | Correction de bug |
| `style:` | CSS/UI sans impact fonctionnel |
| `refactor:` | Restructuration du code |
| `docs:` | Documentation |
| `perf:` | Optimisation |
| `security:` | Renforcement sécurité |

---

## Changelog complet

### v4.0.0

**Nouvelles fonctionnalités**
- ✨ Renommage complet CaisseOS → CristalCaisse, badge violet sur « Cristal »
- ✨ Scanner de codes-barres : champ dédié à la création d'article, détection automatique de scan par timing de frappe, ajout direct au panier
- ✨ Sécurité : hachage SHA-256 salé des mots de passe (remplace l'ancien encodage Base64), migration automatique des comptes existants

**Corrections**
- 🐛 Page de connexion : défilement corrigé sur petits écrans et contenu long

### v3.0.0

- ✨ Écran client temps réel via BroadcastChannel — 5 états
- ✨ Pad numérique tactile — 4 modes (Quantité, Remise, Prix, Note)
- ✨ Import de sauvegarde JSON avec aperçu et connexion automatique

### v2.0.0

- ✨ Cartes cadeaux, programme de fidélité, remboursements
- ✨ Paiement CB, Espèces, Carte Cadeau, Mixte
- ✨ Multi-comptes, mode Noir et Blanc, export sauvegarde JSON

### v1.0.0

- 🎉 Version initiale : caisse, historique, réglages, session persistante

---


*CristalCaisse — Votre caisse, vos données, votre liberté.* 🔷
