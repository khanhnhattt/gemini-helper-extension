import { ARCHIVED_CHATS_KEY } from "@/constants/constants";

export const getChatIds = async (chatHistory: HTMLElement): Promise<string[] | null> => {
    try {
        // Wait for the chat links to be loaded
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Get the chat links
        const chatLinks = chatHistory.querySelectorAll('a[href*="/app/"][data-test-id="conversation"]');

        // Return chat ids
        return Array.from(chatLinks)
            .map(link => link.getAttribute('href')?.split('/').pop() || '')
            .filter((id): id is string => !!id);
    } catch {
        return null;
    }
};

export const handleArchiveForCurrentChat = async (chatId: string): Promise<void> => {
    try {
        await toggleArchivedChat(chatId);
    } catch (error) {
        console.error('Error archiving chat:', chatId, error);
    }
};

export const archivedChatsItem = storage.defineItem<ArchivedChatsByAccount>(
    ARCHIVED_CHATS_KEY,
    { defaultValue: {} },
);

let currentAccountKey: string | null = null;
let archivedIds = new Set<string>();
let initialized = false;

export const getArchivedIds = (): Set<string> => archivedIds;
export const isArchived = (chatId: string): boolean => archivedIds.has(chatId);

export const initArchivedStore = async (accountKey: string): Promise<void> => {
    if (initialized && currentAccountKey === accountKey) return;

    const all = await archivedChatsItem.getValue(); // ArchivedChatsByAccount
    const list = all[accountKey] ?? [];

    currentAccountKey = accountKey;
    archivedIds = new Set(list);
    initialized = true;
};

export const archiveChat = async (chatId: string): Promise<void> => {
    if (!initialized || !currentAccountKey) return;

    archivedIds.add(chatId);

    const all = await archivedChatsItem.getValue();
    all[currentAccountKey] = Array.from(archivedIds);
    
    await archivedChatsItem.setValue(all);
};

export const unarchiveChat = async (chatId: string): Promise<void> => {
    if (!initialized || !currentAccountKey) return;

    archivedIds.delete(chatId);

    const all = await archivedChatsItem.getValue();
    all[currentAccountKey] = Array.from(archivedIds);
    await archivedChatsItem.setValue(all);
};

// Optional convenience:
export const toggleArchivedChat = async (chatId: string): Promise<void> => {    
    if (isArchived(chatId)) {
        await unarchiveChat(chatId);
    } else {
        await archiveChat(chatId);
    }
};