import { folderScreen } from './folderScreen.js';
import { foldersScreen } from './foldersScreen.js';
import { studyScreen } from './studyScreen.js';
import { studySettingsScreen } from './studySettingsScreen.js';

export function startApp(root, library) {
  let route = { name: 'folders' };

  const render = ({ keepScroll = false } = {}) => {
    const scrollPosition = keepScroll ? window.scrollY : 0;
    root.replaceChildren(buildScreen(context, route));
    window.scrollTo(0, scrollPosition);
  };

  const context = {
    library,
    go(nextRoute) {
      route = nextRoute;
      render();
    },
    refresh: () => render({ keepScroll: true }),
  };

  library.subscribe(() => render({ keepScroll: true }));
  render();
}

function buildScreen(context, route) {
  if (route.name === 'folder') return folderScreen(context, route.folderId);
  if (route.name === 'studySettings') return studySettingsScreen(context, route);
  if (route.name === 'study') return studyScreen(context, route);
  return foldersScreen(context);
}
