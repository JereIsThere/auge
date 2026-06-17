# Auge 2 — Agent Milestones

Chronologische Liste der Meilensteine, erreicht durch die verschiedenen KI-Agenten.

---

## [17.06.2026] Neues Thema: Diabetes & CGM (in Arbeit)
**Agent:** Claude by Anthropic

### Achievements:
- **Neues Thema `diabetes`** (`status: 'in-arbeit'`, Kategorie `sonstiges`, Icon 🩺) — 3 Lektionen in 2 Gruppen + 1 Pfad, registriert in `themen/index.ts` und `app/page.tsx`.
- **Wiederverwendbare Komponente `MedizinHinweis`** (`components/lessons/MedizinHinweis.tsx`) — gelber Disclaimer-Banner für alle medizinischen Lektionen.
- **Lektion 1 — Insulinvergleich** (`InsulinVergleich.tsx`, interaktiv): Fiasp vs. NovoRapid vs. Humalog — auswählbare Karten mit Wirkbeginn / Peak / Dauer, Vergleichstabelle, DepthBoxes zu Hexamer-Mechanismus und Lyumjev.
- **Lektion 2 — Pen vs. Pumpe** (`PenVsPumpe.tsx`): Depot-Größe, Resorptionsfaktoren (Injektionsstelle, Lipohypertrophie, Wärme, Tiefe), DepthBox zu Closed-Loop.
- **Lektion 3 — Juggluco + xDrip+ Setup** (`JuglucoXdripSetup.tsx`): Schritt-für-Schritt-Anleitung für Dexcom G6 und G7, Broadcast-Verbindung zu Juggluco, DepthBox zu BYODA und AndroidAPS.

---

## [11.06.2026] Neues Thema: ML-Klassifikation (PlantVillage)
**Agent:** Claude by Anthropic

### Achievements:
- **Neues Voll-Thema `ml-klassifikation`** (`status: 'fertig'`, Kategorie `cs`, Icon 🤖) — 21 Lektionen in 6 Gruppen + 4 Pfaden (Überblick · Theorie-Deep-Dive · Praxis & Code · Tuning & Fallstricke), registriert in `themen/index.ts` und `app/page.tsx`. Für Uni-Projektarbeit: vier ML-Verfahren auf dem PlantVillage-Dataset (~54.000 Blatt-Fotos, 38 Klassen), je High-Level-Einstieg und In-Depth.
- **Grundlagen (4):** Bildklassifikation & PlantVillage · ML-Pipeline (Split/Leakage/Test-Set heilig) · Feature-Extraktion (HSV-Histogramme, Textur) · **Metriken interaktiv** (Confusion-Matrix-Demo mit Schwellwert-Regler, Precision/Recall/F1).
- **Logistic Regression (4):** **Intuition** (interaktiver Sigmoid-Plot) · Mathe (Cross-Entropy, Gradient Descent, Softmax) · Praxis (scikit-learn) · Tuning (C, Solver, Scaling-Falle).
- **SVM (4):** Intuition (Maximum-Margin-SVG) · **Kernel-Trick** (1D→2D-Lift-Visualisierung) · Praxis (LinearSVC vs. SVC/RBF, Skalierbarkeit) · Tuning (C & gamma).
- **Random Forest (4):** Entscheidungsbaum (Gini, SVG-Baum) · Vom Baum zum Wald (Bagging, OOB, Bias-Varianz) · Praxis (Feature Importance) · Tuning (n_estimators, OOB-Suche).
- **CNN (4, Keras/TensorFlow):** Intuition (Feature-Learning vs. -Engineering) · **Bausteine interaktiv** (Convolution-Filter live über ein Pixel-Gitter schieben) · Training (image_dataset_from_directory, Augmentation, EarlyStopping) · Transfer Learning (MobileNetV2 + **Domain-Shift-Falle**: 99 % Labor vs. ~31 % Feld).
- **Abschluss:** Großer Vergleich (8-Kriterien-Tabelle, Entscheidungshilfe) + Übungsaufgabe mit KI-Review-Prompt über alle vier Verfahren.
- **Neue Komponenten:** `components/kurse/ml-klassifikation/CodeBlock.tsx` (Python/Bash, dunkler Editor-Look) · `MlQuelle.tsx` (Quellen-Wrapper) · `ml.css` (Formel-Box, Vergleichstabelle, Slider-Demos) · `themen/ml-klassifikation/quellen.ts` (11 wiss. Quellen: Cox 1958, Cortes/Vapnik 1995, Breiman 2001, LeCun 1998, Krizhevsky 2012, Mohanty 2016 u.a.).

---

## [01.06.2026] Gemini Integration & Landing Page Refactor
**Agent:** Gemini (Google)

### Achievements:
- **Environment Setup:** Established `GEMINI.md` and `CLAUDE.md` with strict branching and PR mandates.
- **Layout Evolution:** Refactored the Landing Page from a single-column layout to a 2/3 (Main Content) and 1/3 (Live Feed Sidebar) grid.
- **Blog System:** Implemented a new "Live Feed" component with interactive blog articles.
- **Content Creation:** Authored initial blog articles for "Lina Logic" (KI-HTML) and "Marco Matrix" (Windows Basics).
- **Deployment Ready:** Verified build and prepared the `gemini` branch for its first Pull Request.

---

## [03.06.2026] Neues Thema: Windows besser nutzen
**Agent:** Yoshie2000 (Mensch)

### Achievements:
- **Neues Voll-Thema `windows`** (`status: 'fertig'`, Kategorie `cs`, Icon 🪟) — 9 Lektionen in 3 Pfaden, registriert in `themen/index.ts` und `app/page.tsx`.
- **Tastatur & Fenster (3):** Shortcuts (interaktive, filterbare Übersicht mit Suchfeld) · Fenster & virtuelle Desktops (interaktiver Snap-Layout-Visualizer) · Programme blitzschnell öffnen (Start-Such-Simulator + Win+R-Referenz + Taskleiste).
- **Terminal & PowerShell (4):** CMD/PowerShell/Terminal/WSL klar getrennt · PowerShell-Grundlagen (interaktiver Konsolen-Simulator, Verb-Noun, Aliase) · Navigieren & Dateien verwalten · Pipeline & Praxis (Where/Sort/Select, als Admin, Execution Policy).
- **Power-User & Übung (2):** Eingebaute Power-Tools (Task-Manager, Win+V, Win+Shift+S, PowerToys, winget) · Übungsaufgaben mit KI-Review-Prompts.
- **Neue wiederverwendbare Komponenten:** `Kbd`/`Combo` (Keycaps), `Terminal`/`TerminalSim` (Konsolen-Simulator), `CmdBlock` (kopierbar) + `windows.css`.

---

## [03.06.2026] Neues Thema: HTML & CSS
**Agent:** Claude by Anthropic

### Achievements:
- **Neues Voll-Thema `html-css`** (`status: 'fertig'`, Kategorie `cs`, Icon 🌐) — 13 Lektionen in 3 Pfaden, registriert in `themen/index.ts` und `app/page.tsx`.
- **Grundlagen (5):** Was HTML/CSS sind (interaktive „CSS an/aus"-Demo) · HTML-Grundgerüst & semantische Tags · CSS einbinden + Anatomie einer Regel · **Box-Modell interaktiv** (padding/border/margin-Regler + box-sizing) · **Kaskade/Spezifität interaktiv** (Spezifitäts-Rechner mit konkurrierenden Regeln).
- **Modernes Layout (4):** **Flexbox-Playground** (direction/justify/align/wrap live) · **Grid interaktiv** (Spalten/Gap/Span) · Position & Stacking (interaktiver position-Demo + z-index/Stacking-Context) · **Responsive** mit simuliertem Viewport-Regler.
- **KI-HTML lesen & reparieren (4):** KI-HTML erkennen (Fingerabdrücke) · schnell lesen (Struktur-zuerst-Toggle, DevTools) · **systematisch bugfixen** (interaktive Bug-Galerie der üblichen Verdächtigen + 5-Schritte-Verfahren) · Übungsaufgaben mit KI-Review-Prompts.
- **Neue wiederverwendbare Komponente:** `components/kurse/html-css/CodeBlock.tsx` (dunkler Editor-Look in beiden Themes, Copy-Button) + `html-css.css`.

---
