export const SelectAnalyticsState = (state) =>
    state.analytics;



export const SelectUserAnalytics = (state) =>
    state.analytics.userAnalytics;



export const SelectProductAnalytics = (state) =>
    state.analytics.productAnalytics;



export const SelectOrderAnalytics = (state) =>
    state.analytics.orderAnalytics;



export const SelectRevenueAnalytics = (state) =>
    state.analytics.revenueAnalytics;



export const SelectRecentOrders = (state) =>
    state.analytics.recentOrders;



export const SelectTopSellingProducts = (state) =>
    state.analytics.topSellingProducts;



export const SelectAnalyticsLoading = (state) =>
    state.analytics.loadingCount > 0;



export const SelectAnalyticsError = (state) =>
    state.analytics.error;