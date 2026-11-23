# memorizeV

Einfache, kostenlose Vokabel-Karten-App (PWA) für das iPhone, optimiert für das iPhone 13 mini.

## Funktionen
- Karten mit Frage und Antwort erstellen, bearbeiten, löschen
- Ordner erstellen, umbenennen, löschen; Ordner können beliebig tief verschachtelt werden (Unterordner)
- Symbole für Ordner: Formen und Icons zu Schule, Berufe, Objekte (Standard ist der Kreis). Icons von [Lucide](https://lucide.dev) (ISC-Lizenz)
- Farben für Ordner und Karten (Karte ohne eigene Farbe übernimmt die Ordnerfarbe); Hauptordner haben einen vollen Farbpunkt, Unterordner nur den Rand
- Beim Erstellen bekommt jede Karte zufällig 0 bis 3 Hintergrund-Symbole (Position und Größe zufällig, danach fest)
- Vorlesen: Lautsprecher-Button bei Frage und Antwort, sofort über die Sprachausgabe des Geräts (Sprache pro Frage/Antwort in den Lern-Einstellungen)
- Schlaflernen (Mond-Button): nutzt neuronale Stimmen mit [Piper](https://github.com/rhasspy/piper) (WebAssembly, die Stimme jeder Sprache ca. 65 MB wird beim ersten Mal nach Rückfrage geladen und läuft danach offline). Liest die Frage vor, wartet doppelt so lange, liest die Antwort vor, wartet 2 Sekunden und macht endlos mit der nächsten Karte weiter, bis man auf Stoppen tippt. Der Bildschirm bleibt dabei an, wenn das Gerät es erlaubt
- Lernmodus: Karte aufdecken, "Gewusst" / "Nochmal"
- Import und Export von `.txt` Dateien (Dateien-App)

## Textformat
Beim Import werden zwei Formate erkannt:
- Abwechselnd Fragezeile, Antwortzeile (Leerzeilen egal). Ab einer Zeile mit nur `#` wird alles ignoriert.
- Eine Karte pro Zeile: `Frage;Antwort` oder `Frage<Tab>Antwort` (erkannt an der ersten Zeile).

Der Export schreibt `Frage<Tab>Antwort` pro Zeile.

## Entwicklung
- `npm test` startet die Unit-Tests (Node 20+)
- `npm start` startet einen lokalen Server auf http://localhost:8080 (Node, kein Python nötig)

## Architektur
- `js/domain` – reine Logik (Library, StudySession, Palette), keine UI
- `js/files` – Textformat und Datei-Import/-Export
- `js/speech` – Sprachausgabe (Gerät und Piper), Schlaflernen-Ablauf, Bildschirm wachhalten
- `js/storage` – Persistenz in localStorage
- `js/ui` – Bildschirme und Dialoge
