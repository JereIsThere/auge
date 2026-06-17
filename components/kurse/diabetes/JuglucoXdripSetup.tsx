import { DepthBox } from "@/components/lessons/DepthBox";
import { MedizinHinweis } from "@/components/lessons/MedizinHinweis";
import "@/components/lessons/lesson.css";

export default function JuglucoXdripSetup() {
  return (
    <div className="lesson-card">
      <h2>Setup: Juggluco + xDrip+ für Dexcom G6/G7</h2>
      <MedizinHinweis />
      <p className="lesson-description">
        xDrip+ liest den Dexcom-Sensor direkt per Bluetooth aus — ohne die offizielle Dexcom-App.
        Juggluco empfängt die Daten und integriert sie in Loops oder dient als Sekundärdisplay.
        Diese Anleitung führt Schritt für Schritt durch die Einrichtung beider Apps unter Android.
      </p>

      <div className="info-box">
        <strong>Was ist was?</strong>
        <ul style={{ paddingLeft: "18px", marginTop: "8px", lineHeight: 1.7, fontSize: "0.9rem" }}>
          <li>
            <strong>xDrip+:</strong> Open-Source-CGM-App. Liest Dexcom G6/G7 direkt per
            Bluetooth, ohne offizielle Dexcom-App. Gibt Daten offen an andere Apps weiter.
          </li>
          <li>
            <strong>Juggluco:</strong> Primär für FreeStyle Libre via NFC, kann aber Daten
            von xDrip+ empfangen und an AndroidAPS oder Loop weitergeben.
          </li>
        </ul>
      </div>

      <h3>Voraussetzungen</h3>
      <ol className="step-list">
        <li>Android-Smartphone (kein iOS), Android 8.0 oder neuer, Bluetooth LE</li>
        <li>Dexcom G6 oder G7 Sensor aktiv oder Sensorstart geplant</li>
        <li>
          Installation aus unbekannten Quellen erlauben:{" "}
          <em>Einstellungen → Apps → Sonderrechte → Unbekannte Apps installieren</em>
        </li>
      </ol>

      <h3>Schritt 1 — xDrip+ installieren</h3>
      <ol className="step-list">
        <li>
          xDrip+ herunterladen — nicht im Play Store, sondern direkt von GitHub:{" "}
          <code>github.com/NightscoutFoundation/xDrip/releases</code>{" "}
          (neueste APK aus dem Release-Bereich)
        </li>
        <li>
          APK installieren und App öffnen. Beim ersten Start alle Berechtigungen erteilen:
          Standortzugriff und Bluetooth sind für den BLE-Scan zwingend nötig, auch wenn
          keine GPS-Nutzung geplant ist.
        </li>
      </ol>

      <h3>Schritt 2 — Datenquelle konfigurieren</h3>
      <ol className="step-list">
        <li>
          Datenquelle einstellen:{" "}
          <em>Hamburger-Menü → Einstellungen → Hardware-Datenquelle</em>
        </li>
        <li>
          <strong>Dexcom G6:</strong> Eintrag{" "}
          <em>Dexcom G6 / 505</em> wählen. Anschließend die Transmitter-ID eingeben unter{" "}
          <em>Einstellungen → G5/G6 Debug → Transmitter-Seriennummer</em> (6-stellig, z.B.{" "}
          <code>8G1234</code>, steht auf dem Transmitter selbst). Sensor starten und ca. 2 Stunden
          Aufwärmzeit abwarten, dann auf Aufforderung zweimal kalibrieren.
        </li>
        <li>
          <strong>Dexcom G7:</strong> Eintrag <em>Dexcom G7</em> wählen (ab xDrip+ 2023.x
          verfügbar). Keine Transmitter-ID nötig — der G7 koppelt sich automatisch.
          Aufwärmzeit: 30 Minuten. Kein Kalibrieren nötig (G7 ist ab Werk kalibriert).
        </li>
      </ol>

      <h3>Schritt 3 — Broadcast für Juggluco aktivieren</h3>
      <ol className="step-list">
        <li>
          In xDrip+:{" "}
          <em>Einstellungen → Inter-App-Einstellungen → Kompatiblen Broadcast aktivieren</em>{" "}
          (Häkchen setzen). xDrip+ sendet nun jeden Messwert als lokalen Android-Broadcast.
        </li>
      </ol>

      <h3>Schritt 4 — Juggluco installieren und verbinden</h3>
      <ol className="step-list">
        <li>
          Juggluco aus dem Play Store installieren oder APK von{" "}
          <code>www.juggluco.nl</code> herunterladen (für Beta-Versionen).
        </li>
        <li>
          App öffnen, Verbindungsmenü aufrufen:{" "}
          <em>Linke Seite antippen → Verbindungen</em>
        </li>
        <li>
          xDrip+ als Datenquelle hinzufügen:{" "}
          <em>Verbindungen → xDrip+ → Empfangen von xDrip+ aktivieren</em>.
          Juggluco hört jetzt auf den Broadcast von xDrip+.
        </li>
        <li>
          Test: In xDrip+ einen Wert manuell eingeben oder auf den nächsten Messwert warten
          — er sollte innerhalb von Sekunden auch in Juggluco erscheinen.
        </li>
        <li>
          Optional — an AndroidAPS weitergeben:{" "}
          <em>Juggluco → Verbindungen → AndroidAPS → Aktivieren</em>.
          Juggluco übermittelt dann CGM-Daten direkt an den Loop-Algorithmus.
        </li>
      </ol>

      <DepthBox variant="why" title="Warum xDrip+ statt der offiziellen Dexcom-App?">
        Die offizielle Dexcom-App sperrt Daten in ein geschlossenes Ökosystem. xDrip+
        spricht dieselben Bluetooth-Protokolle an, gibt die Daten aber offen weiter — an
        Nightscout, AndroidAPS, Juggluco, Garmin-Uhren oder Apple Watch. Das macht xDrip+
        zur zentralen Schaltstelle im DIY-Diabetes-Management.
      </DepthBox>

      <DepthBox variant="mistake" title="Haeufige Fehler beim Setup">
        <strong>Bluetooth-Berechtigung fehlt:</strong> Android verlangt für BLE-Scans den
        Standortzugriff — auch ohne GPS-Nutzung. Ohne diese Berechtigung findet xDrip+
        den Sensor nicht. Lösung: In den App-Einstellungen explizit erteilen.
        {" "}<strong>Transmitter schon mit offizieller App gekoppelt:</strong> Bluetooth
        erlaubt nur eine aktive Verbindung gleichzeitig. Kopplung zuerst in der
        Dexcom-App trennen.
        {" "}<strong>Neuere G6-Transmitter:</strong> Seriennummern ab 80XXXX und 8GXXXX
        haben eine neue Firmware, die das direkte Auslesen durch Drittanbieter blockiert.
        Lösung: BYODA verwenden (siehe DepthBox unten).
      </DepthBox>

      <DepthBox variant="deeper" title="BYODA fuer neuere G6-Transmitter">
        Ab Transmitter-Generation 80XXXX und 8GXXXX blockiert Dexcom das direkte Auslesen
        durch Drittanbieter. Lösung: BYODA (Build Your Own Dexcom App) — eine modifizierte
        Version der offiziellen Dexcom-App, die xDrip+ als Datenempfänger akzeptiert.
        Die BYODA-Anleitung findet sich im xDrip+ Wiki sowie in der deutschen
        Diabetes-Community (Looping Deutschland auf Facebook).
      </DepthBox>

      <DepthBox variant="related" title="Haengt zusammen mit: Nightscout und AndroidAPS">
        Juggluco + xDrip+ ist oft der erste Schritt zu einem vollständigen DIY-Loop.
        Nightscout (Open-Source Cloud-Dashboard) empfängt die Daten und macht sie für
        Eltern, Partner oder Ärzte sichtbar. AndroidAPS nutzt die CGM-Daten, um
        automatisch Insulindosen zu berechnen und die Pumpe anzusteuern —
        ein vollständiges geschlossenes System ohne kommerzielle Einschränkungen.
      </DepthBox>
    </div>
  );
}
