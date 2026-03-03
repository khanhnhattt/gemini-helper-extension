import { ARCHIVE_BUTTON_DATA_ATTR, DELETE_BUTTON_SELECTOR } from '@/constants/constants';

const ARCHIVE_BUTTON_TEST_ID = 'archive-button';
const ARCHIVE_LABEL_SELECTOR = '.gds-body-m';
const ARCHIVE_ICON_PATH = '/icon/archive-icon.svg';
const ARCHIVE_ICON_SIZE = 18;
const ARCHIVE_ICON_MARGIN_LEFT = '1px';
const ARCHIVE_ICON_MARGIN_TOP = '1px';
const ARCHIVE_ICON_MARGIN_BOTTOM = '1px';
const ARCHIVE_ICON_MARGIN_RIGHT = '11px';

const ALL_CONVERSATIONS_SELECTOR = '[data-test-id="all-conversations"]';
const CONVERSATION_LINK_SELECTOR = 'a[href*="/app/"][data-test-id="conversation"]';
const ARCHIVED_SECTION_DATA_ATTR = 'data-gh-archived-section';

const getConversationIdFromLink = (link: HTMLAnchorElement): string | null => {
    const href = link.getAttribute('href');
    if (!href) return null;

    const segments = href.split('/').filter(Boolean);
    const lastSegment = segments[segments.length - 1];

    return lastSegment || null;
};

const createArchiveIcon = (): HTMLImageElement => {
    const icon = document.createElement('img');
    icon.src = browser.runtime.getURL(ARCHIVE_ICON_PATH);
    icon.width = ARCHIVE_ICON_SIZE;
    icon.height = ARCHIVE_ICON_SIZE;
    icon.style.marginLeft = ARCHIVE_ICON_MARGIN_LEFT;
    icon.style.marginTop = ARCHIVE_ICON_MARGIN_TOP;
    icon.style.marginBottom = ARCHIVE_ICON_MARGIN_BOTTOM;
    icon.style.marginRight = ARCHIVE_ICON_MARGIN_RIGHT;

    return icon;
};

const updateArchiveButton = (archiveButton: HTMLButtonElement): void => {
    const labelSpan = archiveButton.querySelector<HTMLElement>(ARCHIVE_LABEL_SELECTOR);
    if (!labelSpan) return;

    labelSpan.textContent = 'Archive';

    const existingIcon = archiveButton.querySelector<HTMLElement>('mat-icon');
    if (existingIcon) {
        archiveButton.removeChild(existingIcon);
    }

    const icon = createArchiveIcon();
    archiveButton.insertBefore(icon, archiveButton.firstChild as HTMLElement);
};

const attachArchiveClickHandler = (archiveButton: HTMLButtonElement): void => {
    // Get the chat id from the jslog attribute
    const jslog = archiveButton.getAttribute('jslog');
    let chatId: string | null = null;
    if (jslog) {
        const match = jslog.match(/["']c_[a-z0-9]+["']/i);
        if (match) {
            chatId = match[0].replace(/["']/g, '').split('_')[1];
        }
    }

    if (!chatId) return;

    archiveButton.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();

        handleArchiveForCurrentChat(chatId);
    });
};

export const injectArchiveOption = (menuEl: HTMLElement): void => {
    const deleteButton = menuEl.querySelector<HTMLButtonElement>(DELETE_BUTTON_SELECTOR);
    if (!deleteButton) return;

    if (menuEl.querySelector(`[${ARCHIVE_BUTTON_DATA_ATTR}]`)) return;

    const archiveButton = deleteButton.cloneNode(true) as HTMLButtonElement;

    archiveButton.setAttribute(ARCHIVE_BUTTON_DATA_ATTR, 'true');
    archiveButton.dataset.testId = ARCHIVE_BUTTON_TEST_ID;

    updateArchiveButton(archiveButton);
    attachArchiveClickHandler(archiveButton);

    menuEl.insertBefore(archiveButton, deleteButton);
};

export const renderArchivedChatSection = async (): Promise<void> => {
    const conversationsList = document.querySelector<HTMLElement>(ALL_CONVERSATIONS_SELECTOR);
    if (!conversationsList) return;

    // Avoid duplicating the Archived section
    if (document.querySelector<HTMLElement>(`[${ARCHIVED_SECTION_DATA_ATTR}]`)) {
        return;
    }

    // Fake archived data: mark every second conversation as archived
    const conversationLinks = Array.from(
        conversationsList.querySelectorAll<HTMLAnchorElement>(CONVERSATION_LINK_SELECTOR),
    );

    if (conversationLinks.length === 0) return;

    const fakeArchivedIds = new Set<string>();
    conversationLinks.forEach((link, index) => {
        const id = getConversationIdFromLink(link);
        if (!id) return;

        if (index % 2 === 0) {
            fakeArchivedIds.add(id);
        }
    });

    // Render "Archived Chat" section
    const clonedSection = conversationsList.cloneNode(true) as HTMLElement;
    clonedSection.setAttribute(ARCHIVED_SECTION_DATA_ATTR, 'true');

    const header = clonedSection.querySelector<HTMLElement>('h1') ??
        clonedSection.querySelector<HTMLElement>('[role="heading"]');

    if (header) {
        header.textContent = `Archived Chats (${fakeArchivedIds.size})`;
    }

    Array.from(clonedSection.children).forEach(child => {
        conversationsList.append(child as Node)
    });

    const hideNonArchivedInSection = (root: HTMLElement, keepArchived: boolean): void => {
        const links = Array.from(root.querySelectorAll<HTMLAnchorElement>(CONVERSATION_LINK_SELECTOR));

        links.forEach((link) => {
            const id = getConversationIdFromLink(link);
            if (!id) return;

            const item = link.closest<HTMLElement>('[data-test-id="conversation"]') ?? link;
            const isArchived = fakeArchivedIds.has(id);

            if ((keepArchived && !isArchived) || (!keepArchived && isArchived)) {
                item.style.display = 'none';
            }
        });
    };

    // Show non-archived in the original list, archived in the cloned section
    hideNonArchivedInSection(conversationsList, false);
    hideNonArchivedInSection(clonedSection, true);
};