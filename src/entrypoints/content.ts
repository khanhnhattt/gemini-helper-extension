import { MENU_CONTENT_SELECTOR } from '@/constants/constants';
import { injectArchiveOption } from '@/utils/sidebarUtils';
import { getAccountKey } from '~/utils/accountUtils';
import { getChatIds } from '~/utils/chatUtils';

export default defineContentScript({
  matches: ['*://*.google.com/*'],
  async main() {
    // Add MutationObserver on changes
    observeMenus();

    // 0. Initialize data
    console.log('Accounst:', getAccountKey());
    console.log('Chat Ids:', await getChatIds());

    // 1. Inject "Archive" buttons on chats

    // 2. Inject "Archived Chats" section on sidebar

    // 3. Render "Archived Chats" data

  },
});

const observeMenus = (): void => {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (!(node instanceof HTMLElement)) return;

        // Inject archive option to chat menu
        const nestedMenu = node.querySelector<HTMLElement>(MENU_CONTENT_SELECTOR);
        if (nestedMenu) {
          injectArchiveOption(nestedMenu);
        }
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
};