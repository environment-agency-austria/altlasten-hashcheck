# Altlasten geometry-hash Beispielapplikation

## Überblick und Hintergrund

Werden Altlsten verordnet, so wird einerseits der Link ins Altlasten-GIS als auch ein Prüfschlüssel veröffentlicht.
Dank dieses Prüfschlüssels ist es auch später möglich, sicherzustellen, dass die Geometrie welche im Altlasten-GIS dargestellt wird, der Geometrie entspricht, welche verordnet wurde.

Dieses Tool stellt eine Beispiel-Implementierung bereit, die aufzeigen soll, wie eine gegebene Geometrie+Prüfschlüssel-Kombination auf Korrektheit überprüft werden kann.

## Berechnungsvorschrift

Die Geometrie im GeoJSON-Format wird mittels SHA-256 ge-hashed und anschließend Base64-URL kodiert, siehe [https://github.com/environment-agency-austria/altlasten-hashcheck/blob/main/main.js Funktion sha256Base64.](https://github.com/environment-agency-austria/altlasten-hashcheck/blob/main/main.js#L38C16-L38C28)

Bei Teilflächen wird die Prüfsumme stehts aus der Kombination der Geometrien von Haupt- und Teilflächen gebildet.
