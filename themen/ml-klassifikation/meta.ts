import type { Thema } from '@/types';

const thema: Thema = {
  slug: 'ml-klassifikation',
  titel: 'ML-Klassifikation',
  kategorie: 'cs',
  kurzbeschreibung:
    'Random Forest, SVM, CNN & Logistic Regression – am PlantVillage-Dataset erklärt.',
  beschreibung:
    'Vier klassische Wege, einem Computer das Klassifizieren beizubringen — alle am selben ' +
    'Problem: kranke Pflanzenblätter auf Fotos erkennen (PlantVillage, ~54.000 Bilder, 38 Klassen). ' +
    'Jedes Verfahren bekommt den gleichen Bogen: Intuition → Mathematik → Python-Implementierung → ' +
    'Tuning & Fallstricke. Am Ende weißt du nicht nur wie jedes Verfahren funktioniert, sondern ' +
    'auch wann du welches nimmst.',
  tags: ['ml', 'python', 'scikit-learn', 'keras', 'klassifikation'],
  status: 'fertig',
  pfade: [
    {
      slug: 'ueberblick',
      titel: 'Überblick',
      beschreibung:
        'High-Level-Einstieg: jedes Verfahren einmal verstehen, ohne tief in Mathe oder Code zu gehen.',
      icon: '🌱',
      lektionenSlugs: [
        'einleitung',
        'pipeline',
        'logreg-intuition',
        'svm-intuition',
        'rf-ensemble',
        'cnn-intuition',
        'vergleich',
      ],
      akzent: 'from-emerald-500 to-teal-600',
    },
    {
      slug: 'theorie',
      titel: 'Theorie-Deep-Dive',
      beschreibung:
        'Die Mathematik hinter den Verfahren: Loss-Funktionen, Kernel-Trick, Gini, Convolutions.',
      icon: '🔬',
      lektionenSlugs: [
        'metriken',
        'logreg-mathe',
        'svm-kernel',
        'rf-baum',
        'rf-ensemble',
        'cnn-bausteine',
      ],
      akzent: 'from-violet-500 to-purple-600',
    },
    {
      slug: 'praxis',
      titel: 'Praxis & Code',
      beschreibung:
        'Python-Implementierungen auf PlantVillage: Feature-Extraktion, scikit-learn, Keras.',
      icon: '💻',
      lektionenSlugs: [
        'features',
        'logreg-praxis',
        'svm-praxis',
        'rf-praxis',
        'cnn-training',
        'cnn-transfer',
      ],
      akzent: 'from-blue-500 to-indigo-600',
    },
    {
      slug: 'tuning',
      titel: 'Tuning & Fallstricke',
      beschreibung:
        'Hyperparameter, typische Fehler und die Frage: welches Verfahren wann?',
      icon: '🔧',
      lektionenSlugs: [
        'logreg-tuning',
        'svm-tuning',
        'rf-tuning',
        'cnn-transfer',
        'vergleich',
      ],
      akzent: 'from-amber-500 to-orange-600',
    },
  ],
  gruppen: [
    {
      titel: 'Grundlagen',
      untertitel: 'Das Problem, die Pipeline, die Messlatte – gilt für alle vier Verfahren.',
      lektionen: [
        {
          slug: 'einleitung',
          titel: 'Bildklassifikation & PlantVillage',
          icon: '🌿',
          kurzbeschreibung:
            '54.000 Blatt-Fotos, 38 Klassen – das Problem, das alle vier Verfahren lösen.',
          loader: () => import('@/components/kurse/ml-klassifikation/Einleitung'),
        },
        {
          slug: 'pipeline',
          titel: 'Die ML-Pipeline',
          icon: '🔀',
          kurzbeschreibung:
            'Daten laden → Split → Preprocessing → Training → Evaluation – und warum die Reihenfolge zählt.',
          loader: () => import('@/components/kurse/ml-klassifikation/Pipeline'),
        },
        {
          slug: 'features',
          titel: 'Features: von Pixeln zu Vektoren',
          icon: '📐',
          kurzbeschreibung:
            'Farb-Histogramme, Texturen, Flatten – wie klassische Verfahren Bilder „sehen".',
          loader: () => import('@/components/kurse/ml-klassifikation/Features'),
        },
        {
          slug: 'metriken',
          titel: 'Metriken & Confusion Matrix',
          icon: '📊',
          kurzbeschreibung:
            'Accuracy lügt bei 38 Klassen – Precision, Recall, F1 interaktiv verstehen.',
          loader: () => import('@/components/kurse/ml-klassifikation/Metriken'),
        },
      ],
    },
    {
      titel: 'Logistic Regression',
      untertitel: 'Das einfachste Verfahren – und die beste Baseline.',
      lektionen: [
        {
          slug: 'logreg-intuition',
          titel: 'Intuition: Linie + Sigmoid',
          icon: '📈',
          kurzbeschreibung:
            'Eine gewichtete Summe, durch die Sigmoid gedrückt – mehr ist es nicht. Interaktiv.',
          loader: () => import('@/components/kurse/ml-klassifikation/LogRegIntuition'),
        },
        {
          slug: 'logreg-mathe',
          titel: 'Mathe: Cross-Entropy & Gradient Descent',
          icon: '🧮',
          kurzbeschreibung:
            'Warum Cross-Entropy statt MSE, wie der Gradient aussieht, was Softmax bei 38 Klassen macht.',
          loader: () => import('@/components/kurse/ml-klassifikation/LogRegMathe'),
        },
        {
          slug: 'logreg-praxis',
          titel: 'Praxis: scikit-learn auf PlantVillage',
          icon: '💻',
          kurzbeschreibung:
            'Komplettes Python-Skript: Features extrahieren, skalieren, trainieren, evaluieren.',
          loader: () => import('@/components/kurse/ml-klassifikation/LogRegPraxis'),
        },
        {
          slug: 'logreg-tuning',
          titel: 'Tuning: C, Solver & Fallstricke',
          icon: '🔧',
          kurzbeschreibung:
            'Regularisierung verstehen, Solver wählen, und warum vergessenes Skalieren alles ruiniert.',
          loader: () => import('@/components/kurse/ml-klassifikation/LogRegTuning'),
        },
      ],
    },
    {
      titel: 'Support Vector Machine',
      untertitel: 'Maximum Margin und der Kernel-Trick.',
      lektionen: [
        {
          slug: 'svm-intuition',
          titel: 'Intuition: die breiteste Straße',
          icon: '🛣️',
          kurzbeschreibung:
            'Nicht irgendeine Trennlinie – die mit dem größten Abstand. Support-Vektoren erklärt.',
          loader: () => import('@/components/kurse/ml-klassifikation/SvmIntuition'),
        },
        {
          slug: 'svm-kernel',
          titel: 'Der Kernel-Trick',
          icon: '🪄',
          kurzbeschreibung:
            'Nicht-linear trennbare Daten in höhere Dimensionen heben – ohne sie je zu berechnen.',
          loader: () => import('@/components/kurse/ml-klassifikation/SvmKernel'),
        },
        {
          slug: 'svm-praxis',
          titel: 'Praxis: SVC auf PlantVillage',
          icon: '💻',
          kurzbeschreibung:
            'SVC vs. LinearSVC, warum 54.000 Bilder für eine SVM richtig wehtun.',
          loader: () => import('@/components/kurse/ml-klassifikation/SvmPraxis'),
        },
        {
          slug: 'svm-tuning',
          titel: 'Tuning: C & gamma',
          icon: '🔧',
          kurzbeschreibung:
            'Das wichtigste Hyperparameter-Duo verstehen statt blind grid-searchen.',
          loader: () => import('@/components/kurse/ml-klassifikation/SvmTuning'),
        },
      ],
    },
    {
      titel: 'Random Forest',
      untertitel: 'Viele schwache Bäume, ein starker Wald.',
      lektionen: [
        {
          slug: 'rf-baum',
          titel: 'Der Entscheidungsbaum',
          icon: '🌳',
          kurzbeschreibung:
            'Gini-Impurity, Splits, Rekursion – der Baustein, aus dem der Wald besteht.',
          loader: () => import('@/components/kurse/ml-klassifikation/RfBaum'),
        },
        {
          slug: 'rf-ensemble',
          titel: 'Vom Baum zum Wald',
          icon: '🌲',
          kurzbeschreibung:
            'Bagging + Feature-Zufall = unkorrelierte Fehler. Warum das Ensemble besser ist.',
          loader: () => import('@/components/kurse/ml-klassifikation/RfEnsemble'),
        },
        {
          slug: 'rf-praxis',
          titel: 'Praxis: RandomForestClassifier',
          icon: '💻',
          kurzbeschreibung:
            'Training auf PlantVillage-Features + Feature Importance auslesen.',
          loader: () => import('@/components/kurse/ml-klassifikation/RfPraxis'),
        },
        {
          slug: 'rf-tuning',
          titel: 'Tuning: n_estimators & Co.',
          icon: '🔧',
          kurzbeschreibung:
            'Welche Parameter wirklich etwas bringen, OOB-Score als Gratis-Validierung.',
          loader: () => import('@/components/kurse/ml-klassifikation/RfTuning'),
        },
      ],
    },
    {
      titel: 'Convolutional Neural Network',
      untertitel: 'Das Verfahren, das seine Features selbst lernt.',
      lektionen: [
        {
          slug: 'cnn-intuition',
          titel: 'Warum CNNs Bilder gewinnen',
          icon: '👁️',
          kurzbeschreibung:
            'Wo handgebaute Features an ihre Grenzen stoßen – und was Convolution anders macht.',
          loader: () => import('@/components/kurse/ml-klassifikation/CnnIntuition'),
        },
        {
          slug: 'cnn-bausteine',
          titel: 'Bausteine: Conv, Pooling, ReLU',
          icon: '🧱',
          kurzbeschreibung:
            'Filter über Bilder schieben – interaktive Convolution-Demo auf einem Pixel-Gitter.',
          loader: () => import('@/components/kurse/ml-klassifikation/CnnBausteine'),
        },
        {
          slug: 'cnn-training',
          titel: 'Praxis: Keras auf PlantVillage',
          icon: '💻',
          kurzbeschreibung:
            'Komplettes Keras-Modell: Dataset-Loading, Augmentation, Training, Evaluation.',
          loader: () => import('@/components/kurse/ml-klassifikation/CnnTraining'),
        },
        {
          slug: 'cnn-transfer',
          titel: 'Transfer Learning & Overfitting',
          icon: '🔁',
          kurzbeschreibung:
            'Vortrainierte Netze nutzen, Overfitting erkennen – und die PlantVillage-Falle.',
          loader: () => import('@/components/kurse/ml-klassifikation/CnnTransfer'),
        },
      ],
    },
    {
      titel: 'Abschluss',
      untertitel: 'Alles nebeneinander – und eine Übung mit KI-Review.',
      lektionen: [
        {
          slug: 'vergleich',
          titel: 'Der große Vergleich',
          icon: '⚖️',
          kurzbeschreibung:
            'Wann welches Verfahren? Vergleichstabelle + Übungsaufgabe über alle vier.',
          loader: () => import('@/components/kurse/ml-klassifikation/Vergleich'),
        },
      ],
    },
  ],
};

export default thema;
