import type { Thema } from '@/types';

const thema: Thema = {
  slug: 'kryptografie',
  titel: 'Kryptografie',
  kategorie: 'cs',
  kurzbeschreibung:
    'Von Caesar bis Post-Quantum — interaktive Lektionen mit aufklappbaren Tiefen-Boxen.',
  beschreibung:
    'Kryptografie ist die Kunst, in einer Welt voller Lauscher, Fälscher und Hochstapler ' +
    'trotzdem sicher zu kommunizieren. Sie beantwortet drei Grundfragen: Kann jemand mitlesen? ' +
    'Wurde unterwegs etwas verändert? Mit wem rede ich überhaupt? Jede Lektion lässt sich ' +
    'anfassen — Slider verschieben, Hashes live berechnen, Schlüssel austauschen.',
  tags: ['krypto', 'sicherheit', 'tls', 'rsa', 'aes'],
  status: 'fertig',
  pfade: [
    {
      slug: 'neuling',
      titel: 'Komplett neu',
      beschreibung:
        'Noch nie mit Krypto in Berührung gekommen? Wir starten ganz am Anfang.',
      icon: '🌱',
      lektionenSlugs: ['einleitung', 'caesar', 'frequenz', 'hash'],
      akzent: 'from-emerald-500 to-teal-600',
    },
    {
      slug: 'entwickler',
      titel: 'Entwickler:in',
      beschreibung:
        'Du kennst es aus dem Job, möchtest die modernen Bausteine richtig verstehen.',
      icon: '💻',
      lektionenSlugs: ['symm-asymm', 'aes', 'diffie-hellman', 'tls', 'oauth'],
      akzent: 'from-blue-500 to-indigo-600',
    },
    {
      slug: 'tiefer-rein',
      titel: 'Tiefer rein',
      beschreibung:
        'Mathe, Geschichte, Stolperfallen — die nicht-trivialen Themen.',
      icon: '🧠',
      lektionenSlugs: ['kerckhoffs', 'modi', 'signaturen', 'ecc', 'post-quantum'],
      akzent: 'from-fuchsia-500 to-purple-600',
    },
  ],
  gruppen: [
    {
      titel: 'Grundlagen & Mindset',
      untertitel: 'Was Kryptografie überhaupt löst – und wovon sie nicht schützt.',
      lektionen: [
        {
          slug: 'einleitung',
          titel: 'Was ist Kryptografie?',
          icon: '📖',
          kurzbeschreibung: 'Vertraulichkeit · Integrität · Authentizität – die drei Grundfragen.',
          loader: () => import('@/components/kurse/kryptografie/Einleitung'),
        },
        {
          slug: 'kerckhoffs',
          titel: 'Angreifer & Kerckhoffs',
          icon: '🎯',
          kurzbeschreibung: 'Warum das Verfahren öffentlich sein darf – und muss.',
          loader: () => import('@/components/kurse/kryptografie/Kerckhoffs'),
        },
        {
          slug: 'entropie',
          titel: 'Zufall & Entropie',
          icon: '🎲',
          kurzbeschreibung: 'Wie schwer ist etwas zu erraten? Mit Passwort-Stärke-Rechner.',
          loader: () => import('@/components/kurse/kryptografie/Entropie'),
        },
      ],
    },
    {
      titel: 'Klassische Verfahren',
      untertitel: 'Wo Krypto historisch herkommt – und woran sie scheitert.',
      lektionen: [
        {
          slug: 'caesar',
          titel: 'Caesar-Cipher',
          icon: '🔡',
          kurzbeschreibung: 'Buchstaben verschieben – interaktiv mit Slider.',
          loader: () => import('@/components/kurse/kryptografie/CaesarCipher'),
        },
        {
          slug: 'xor',
          titel: 'XOR-Verschlüsselung',
          icon: '⊕',
          kurzbeschreibung: 'Bitweise XOR, Hex-Tabelle, Selbstinversität live.',
          loader: () => import('@/components/kurse/kryptografie/XorCipher'),
        },
        {
          slug: 'frequenz',
          titel: 'Häufigkeitsanalyse',
          icon: '📊',
          kurzbeschreibung: 'Buchstabenhäufigkeiten als Balken – Caesar damit knacken.',
          loader: () => import('@/components/kurse/kryptografie/FrequencyAnalysis'),
        },
        {
          slug: 'enigma-otp',
          titel: 'Enigma & One-Time-Pad',
          icon: '⚙️',
          kurzbeschreibung: 'Die einzige beweisbar sichere Chiffre – und warum sie kaum jemand nutzt.',
          loader: () => import('@/components/kurse/kryptografie/EnigmaOTP'),
        },
      ],
    },
    {
      titel: 'Symmetrische Krypto',
      untertitel: 'Ein gemeinsames Geheimnis – wie tauscht man es aus?',
      lektionen: [
        {
          slug: 'symm-asymm',
          titel: 'Symmetrisch vs. asymmetrisch',
          icon: '⚖️',
          kurzbeschreibung: 'Der wichtigste Unterschied in der modernen Krypto.',
          loader: () => import('@/components/kurse/kryptografie/SymmAsymm'),
        },
        {
          slug: 'aes',
          titel: 'AES',
          icon: '🧱',
          kurzbeschreibung: 'Die wichtigste Blockchiffre der Welt – live im Browser.',
          loader: () => import('@/components/kurse/kryptografie/Aes'),
        },
        {
          slug: 'modi',
          titel: 'Betriebsmodi & Padding',
          icon: '🔁',
          kurzbeschreibung: 'CBC, CTR, GCM – die Wahl ist wichtiger als die Chiffre.',
          loader: () => import('@/components/kurse/kryptografie/Modi'),
        },
      ],
    },
    {
      titel: 'Asymmetrische Krypto',
      untertitel: 'Schlüssel, die jeder kennen darf – und trotzdem funktionieren.',
      lektionen: [
        {
          slug: 'diffie-hellman',
          titel: 'Diffie-Hellman',
          icon: '🔑',
          kurzbeschreibung: 'Schlüsselaustausch über einen abhörbaren Kanal.',
          loader: () => import('@/components/kurse/kryptografie/DiffieHellman'),
        },
        {
          slug: 'rsa',
          titel: 'RSA',
          icon: '🔐',
          kurzbeschreibung: 'Asymmetrisch mit öffentlichem und privatem Schlüssel.',
          loader: () => import('@/components/kurse/kryptografie/Rsa'),
        },
        {
          slug: 'ecc',
          titel: 'Elliptische Kurven',
          icon: '🌐',
          kurzbeschreibung: 'Modernere Schwester von RSA – kürzere Schlüssel, gleiche Sicherheit.',
          loader: () => import('@/components/kurse/kryptografie/Ecc'),
        },
        {
          slug: 'signaturen',
          titel: 'Digitale Signaturen',
          icon: '✍️',
          kurzbeschreibung: 'ECDSA live: unterschreiben, manipulieren, verifizieren.',
          loader: () => import('@/components/kurse/kryptografie/Signaturen'),
        },
      ],
    },
    {
      titel: 'Hashes & Integrität',
      untertitel: 'Fingerabdrücke statt Originale.',
      lektionen: [
        {
          slug: 'hash',
          titel: 'Hash-Funktionen',
          icon: '#️⃣',
          kurzbeschreibung: 'SHA-256 live. Avalanche-Effekt und Einweg-Prinzip.',
          loader: () => import('@/components/kurse/kryptografie/HashFunction'),
        },
        {
          slug: 'hmac',
          titel: 'HMAC',
          icon: '🛡️',
          kurzbeschreibung: 'Nachrichten authentifizieren mit geheimem Schlüssel.',
          loader: () => import('@/components/kurse/kryptografie/Hmac'),
        },
        {
          slug: 'passwort',
          titel: 'Passwort-Hashing',
          icon: '🔒',
          kurzbeschreibung: 'Warum bcrypt/Argon2 – mit Kosten-Slider zum Spielen.',
          loader: () => import('@/components/kurse/kryptografie/PasswortHashing'),
        },
        {
          slug: 'merkle',
          titel: 'Merkle & Blockchains',
          icon: '🌳',
          kurzbeschreibung: 'Aus Hashes wird ein Baum – Git, IPFS, Bitcoin.',
          loader: () => import('@/components/kurse/kryptografie/Merkle'),
        },
      ],
    },
    {
      titel: 'Protokolle & Anwendung',
      untertitel: 'Wo das alles im echten Internet auftaucht.',
      lektionen: [
        {
          slug: 'tls',
          titel: 'TLS & PKI',
          icon: '🔏',
          kurzbeschreibung: 'Was hinter dem Schloss-Symbol wirklich passiert.',
          loader: () => import('@/components/kurse/kryptografie/Tls'),
        },
        {
          slug: 'oauth',
          titel: 'OAuth 2.0',
          icon: '🪪',
          kurzbeschreibung: 'Authorization-Code-Flow Schritt für Schritt.',
          loader: () => import('@/components/kurse/kryptografie/OAuth'),
        },
        {
          slug: 'post-quantum',
          titel: 'Post-Quantum',
          icon: '⚛️',
          kurzbeschreibung: 'Was passiert, wenn Quantencomputer RSA brechen.',
          loader: () => import('@/components/kurse/kryptografie/PostQuantum'),
        },
        {
          slug: 'quiz',
          titel: 'Quiz',
          icon: '🧪',
          kurzbeschreibung: 'Fragen zum Testen des Gelernten mit sofortigem Feedback.',
          loader: () => import('@/components/kurse/kryptografie/Quiz'),
        },
      ],
    },
  ],
};

export default thema;
