import { MENU_CONTENT_SELECTOR } from '@/constants/constants';
import { injectArchiveOption, renderArchivedChatSection } from '@/utils/sidebarUtils';
import { getAccountKey } from '~/utils/accountUtils';
import { getChatIds } from '~/utils/chatUtils';

export default defineContentScript({
  matches: ['*://*.google.com/*'],
  async main() {
    // 1. Wait for chatHistory element
    const waitForchatHistory = async (): Promise<HTMLElement> => {
      const existing = document.querySelector<HTMLElement>('.chat-history');
      if (existing) return existing;

      return new Promise((resolve) => {
        const observer = new MutationObserver(() => {
          const el = document.querySelector<HTMLElement>('.chat-history');
          console.log('el', el)
          if (el) {
            observer.disconnect();
            resolve(el);
          }
        });
        observer.observe(document.body, { childList: true, subtree: true });
      });
    };

    const chatHistory = await waitForchatHistory();

    // 0. Initialize data
    console.log('Accounst:', getAccountKey());
    console.log('Chat Ids:', await getChatIds(chatHistory));

    // 2. Inject "Archived Chats" section
    renderArchivedChatSection();

    // Add MutationObserver on changes
    observeMenus();
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