const { app, BrowserWindow, session, Menu, shell } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');

function creerFenetre() {
  const fenetre = new BrowserWindow({
    width: 1200,
    height: 800,
    title: 'CristalCaisse',
    icon: path.join(__dirname, 'build', 'icon.png'),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  Menu.setApplicationMenu(null); // pas de barre de menu (F12 pour les outils de dev si besoin)
  fenetre.loadFile(path.join(__dirname, 'index.html'));

  // Les liens externes s'ouvrent dans le navigateur, pas dans l'app
  fenetre.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  fenetre.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'F12' && input.type === 'keyDown') {
      fenetre.webContents.toggleDevTools();
    }
  });
}

app.whenReady().then(() => {
  // Autorise la caméra (scan de codes-barres) et rien d'autre
  session.defaultSession.setPermissionRequestHandler((_wc, permission, callback) => {
    callback(permission === 'media');
  });

  creerFenetre();

  // Mises à jour automatiques via les releases GitHub (uniquement dans l'app installée)
  if (app.isPackaged) {
    autoUpdater.checkForUpdatesAndNotify();
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) creerFenetre();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
