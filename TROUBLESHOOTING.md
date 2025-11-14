# Troubleshooting Guide

## PWA Icons Missing

The browser console shows an error about missing PWA icons. To fix this:

### Option 1: Generate Icons in Browser (Recommended)

1. Open `http://localhost:3000/generate-icons.html` in your browser
2. Click the download buttons for `icon-192.png` and `icon-512.png`
3. Save both files to the `public` folder in your project
4. Refresh your app

### Option 2: Use a Placeholder (Quick Fix)

Temporarily comment out the icons in `public/manifest.json`:

```json
{
  "name": "Mermaid Live Editor",
  ...
  "icons": []
}
```

## WebSocket/HMR Connection Failed

The WebSocket connection error (`ws://localhost:3000`) is a Vite HMR (Hot Module Replacement) issue. This doesn't break the app functionality, but live reloading won't work.

### Causes and Fixes:

1. **Firewall/Antivirus**: Windows Firewall or antivirus might be blocking WebSocket connections
   - Allow Node.js through Windows Firewall
   - Add an exception for port 3000

2. **Try a different port**:
   ```bash
   npm run dev -- --port 3001
   ```

3. **Update Vite config** to use polling instead of WebSockets:

   In `vite.config.ts`, add:
   ```typescript
   export default defineConfig({
     server: {
       port: 3000,
       hmr: {
         overlay: false, // Disable error overlay if needed
       },
       watch: {
         usePolling: true, // Use polling instead of file system events
       },
     },
   })
   ```

4. **Restart dev server**:
   ```bash
   npm run dev
   ```

### If HMR still doesn't work:

The app will still function perfectly fine, you'll just need to manually refresh the browser after making code changes instead of having automatic hot reloading.

## Service Worker Registration

If you see "SW registered" in console - this is normal and expected for the PWA functionality.

## React DevTools Message

The message "Download the React DevTools" is just informational and can be ignored. It's recommending a browser extension for debugging React apps.
