# memorizeV

Einfache, kostenlose Vokabel-Karten-App (PWA) für das iPhone, optimiert für das iPhone 13 mini.

## Funktionen
- Karten mit Frage und Antwort erstellen, bearbeiten, löschen
- Ordner erstellen, umbenennen, löschen
- Farben für Ordner und Karten (Karte ohne eigene Farbe übernimmt die Ordnerfarbe)
- Lernmodus: Karte aufdecken, "Gewusst" / "Nochmal"
- Import und Export von `.txt` Dateien (Dateien-App)

## Textformat
Beim Import werden zwei Formate erkannt:
- Abwechselnd Fragezeile, Antwortzeile (Leerzeilen egal). Ab einer Zeile mit nur `#` wird alles ignoriert.
- Eine Karte pro Zeile: `Frage;Antwort` oder `Frage<Tab>Antwort` (erkannt an der ersten Zeile).

Der Export schreibt `Frage<Tab>Antwort` pro Zeile.

## Entwicklung
- `npm test` startet die Unit-Tests (Node 20+)
- `npm start` startet einen lokalen Server auf http://localhost:8080

## Architektur
- `js/domain` – reine Logik (Library, StudySession, Palette), keine UI
- `js/files` – Textformat und Datei-Import/-Export
- `js/storage` – Persistenz in localStorage
- `js/ui` – Bildschirme und Dialoge
