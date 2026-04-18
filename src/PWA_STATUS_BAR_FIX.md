# PWA Status Bar Color Fix - v12.9.4

## Problem
Die iOS PWA Status Bar zeigt nicht die richtigen Hintergrundfarben:
- Light Mode: Status Bar ist schwarz (sollte #F1F1F1sein)
- Dark Mode: Status Bar ist hellgrau (sollte #9C9C9C sein)

## Root Cause
iOS cached die PWA Meta Tags und Manifest beim ersten Install. Änderungen an diesen Tags werden in bereits installierten PWAs NICHT übernommen.

## Fix Applied

### 1. Meta Tags Simplified (`/public/index.html`)
```html
<!-- VORHER: -->
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">

<!-- JETZT: -->
<meta name="apple-mobile-web-app-status-bar-style" content="default">
```

**Warum `default`?**
- `default` = Status bar nimmt die Farbe des Body-Hintergrunds an
- `black-translucent` = Transparent/translucent, funktioniert nur mit safe-area-insets
- `black` = Immer schwarz (nicht was wir wollen)

### 2. Manifest Theme Color (`/public/manifest.json`)
```json
{
  "theme_color": "#F1F1F1",
  "background_color": "#F1F1F1"
}
```

### 3. Dynamic Theme Color Update (`/App.tsx`)
```typescript
useEffect(() => {
  const statusBarColor = isDarkMode ? '#9C9C9C' : '#F1F1F1';
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');
  if (themeColorMeta) {
    themeColorMeta.content = statusBarColor;
  }
}, [isDarkMode]);
```

## ⚠️ WICHTIG: PWA Neu-Installation Erforderlich!

iOS cached alle PWA Meta Tags beim ersten "Add to Home Screen". Um die Änderungen zu sehen:

### Schritt-für-Schritt Anleitung:

1. **PWA vom Homescreen löschen**
   - Lange auf das Juicebox Icon drücken
   - "App entfernen" wählen
   - Bestätigen

2. **Safari Cache leeren** (optional aber empfohlen)
   - Einstellungen → Safari → Verlauf und Websitedaten löschen

3. **PWA neu installieren**
   - Safari öffnen
   - Zu deiner Juicebox URL navigieren
   - Share Button (🔼) → "Zum Home-Bildschirm"
   - Installieren

4. **App neu öffnen**
   - Jetzt sollte die Status Bar die richtige Farbe haben!

## Erwartetes Verhalten

### Light Mode (#F1F1F1)
```
┌─────────────────────────┐
│ 🔋 9:41 📶   #F1F1F1    │ ← Status Bar (heller Hintergrund)
├─────────────────────────┤
│                         │
│     App Content         │
│     #F1F1F1             │
└─────────────────────────┘
```

### Dark Mode (#9C9C9C)
```
┌─────────────────────────┐
│ 🔋 9:41 📶   #9C9C9C    │ ← Status Bar (grauer Hintergrund)
├─────────────────────────┤
│                         │
│     App Content         │
│     #9C9C9C             │
└─────────────────────────┘
```

## Alternative: Web Clip Update (Fortgeschritten)

Falls neu installieren nicht möglich ist, kann man versuchen:

1. Im Safari die PWA-URL öffnen (nicht die installierte App)
2. Manifest Meta Tags sollten dort aktualisiert werden
3. Dann "Add to Home Screen" nochmal (überschreibt die alte Installation)

## Technical Details

### iOS PWA Status Bar Styles

| Style | Beschreibung | Use Case |
|-------|--------------|----------|
| `default` | Weiße Status Bar mit schwarzem Text | ✅ Helle Apps (#F1F1F1) |
| `black` | Schwarze Status Bar mit weißem Text | Sehr dunkle Apps |
| `black-translucent` | Translucent, Content extends behind | Full-screen Experiences |

### Why `default` is Best for Juicebox

- Passt zu unserem hellen Background (#F1F1F1)
- Funktioniert out-of-the-box ohne safe-area-inset Komplexität
- iOS rendert automatisch die richtige Text-Farbe (schwarz auf hell)
- Einfacher als `black-translucent` (kein Content overlap)

### Dark Mode Limitation

⚠️ iOS erlaubt KEINE dynamische Änderung von `apple-mobile-web-app-status-bar-style` in installierten PWAs!

Das bedeutet:
- Die Status Bar Style wird beim ersten Install festgelegt
- Dark Mode Wechsel ändert NICHT den Status Bar Style
- Nur die `theme-color` kann dynamisch geändert werden (Android)

**Workaround für Dark Mode:**
- Der `default` Style passt sich automatisch an den Body-Hintergrund an
- Wenn Body #9C9C9C ist, sollte auch die Status Bar diese Farbe haben
- Der Text in der Status Bar bleibt schwarz (iOS default)

## Testing Checklist

- [ ] PWA vom Homescreen gelöscht
- [ ] Safari Cache geleert (optional)
- [ ] PWA neu installiert ("Add to Home Screen")
- [ ] App geöffnet
- [ ] Light Mode: Status Bar ist #F1F1F1 ✓
- [ ] Dark Mode toggle
- [ ] Dark Mode: Status Bar ist #9C9C9C ✓
- [ ] Lock Screen Controls funktionieren (Previous/Next Station)

## Version

This fix is included in **v12.9.4**

## Related Issues

- v12.8.2: Initial attempt with `black-translucent` (didn't work)
- v12.9.4: Simplified to `default` style with proper background colors
