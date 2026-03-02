import { ARCHIVE_BUTTON_DATA_ATTR, DELETE_BUTTON_SELECTOR } from '@/constants/constants';

const ARCHIVE_BUTTON_TEST_ID = 'archive-button';
const ARCHIVE_LABEL_SELECTOR = '.gds-body-m';
const ARCHIVE_ICON_PATH = '/icon/archive-icon.svg';
const ARCHIVE_ICON_SIZE = 18;
const ARCHIVE_ICON_MARGIN_LEFT = '1px';
const ARCHIVE_ICON_MARGIN_TOP = '1px';
const ARCHIVE_ICON_MARGIN_BOTTOM = '1px';
const ARCHIVE_ICON_MARGIN_RIGHT = '11px';

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

    // Clone the Delete button to use as the Archive button
    const archiveButton = deleteButton.cloneNode(true) as HTMLButtonElement;

    archiveButton.setAttribute(ARCHIVE_BUTTON_DATA_ATTR, 'true');
    archiveButton.dataset.testId = ARCHIVE_BUTTON_TEST_ID;

    updateArchiveButton(archiveButton);
    attachArchiveClickHandler(archiveButton);

    menuEl.insertBefore(archiveButton, deleteButton);
};