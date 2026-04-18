# Code Cleanup Log

## Files Removed

### Legacy Components
- AudioPlayer.tsx - deprecated audio handler
- DrinkSvgComponents.tsx - replaced by drinks/svgs structure
- FaviconGenerator.tsx - PWA specific, not used
- IconCreator.tsx - legacy icon system
- IconGenerator.tsx - legacy icon system  
- IconService.tsx - legacy icon system
- PwaIcon.tsx - legacy PWA system
- PwaIconDemo.tsx - legacy PWA system
- PwaIconGenerator.tsx - legacy PWA system
- PwaIconManager.tsx - legacy PWA system

### Legacy Hooks
- useRadioPlayer.ts - replaced by useCoreAudioManager

### Legacy Utils
- audioEventHandlers.ts - replaced by coreEventHandlers
- eventHandlers.ts - legacy event system
- makeSwitchController.ts - integrated into core system

### Legacy Constants
- drinks.tsx - replaced by constants in app.ts (check if registry still needed)

### Legacy Imports Directory
- All files in /imports/ - legacy Figma imports

### Documentation Files
- All markdown files in drinks/svgs/ directory