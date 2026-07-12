export const SelectNewsletterState = (state) =>
    state.newsletter;



export const SelectSubscribers = (state) =>
    state.newsletter.subscribers;



export const SelectTotalSubscribers = (state) =>
    state.newsletter.totalSubscribers;



export const SelectNewsletterLoading = (state) =>
    state.newsletter.loading;



export const SelectSubscribeLoading = (state) =>
    state.newsletter.subscribeLoading;



export const SelectNewsletterMessage = (state) =>
    state.newsletter.message;



export const SelectNewsletterError = (state) =>
    state.newsletter.error;