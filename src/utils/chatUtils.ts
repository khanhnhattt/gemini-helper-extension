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
        // TODO: Implement archive logic
        console.log('Archive clicked for chat id:', chatId);
    } catch {
        console.error('Error archiving chat:', chatId);
    }
};