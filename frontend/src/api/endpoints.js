/**
 * Centralized API Endpoints
 * All backend routes in one place — if backend changes, update only here
 */

const API = {
    // ─── Auth ─────────────────────────────────────────────────────────────────
    LOGIN: "/login",

    // ─── Locals ───────────────────────────────────────────────────────────────
    ADD_LOCAL: "/addLocal",
    GET_LOCALS: "/return_local",
    DELETE_LOCAL: "/delete_local",
    UPDATE_LOCAL: "/update_local",

    // ─── Raw Imli ─────────────────────────────────────────────────────────────
    ADD_RAW_IMLI: "/addRawImli",
    GET_RAW_IMLI: "/getRawImli",

    // ─── Assign / Return Imli ─────────────────────────────────────────────────
    ASSIGN_IMLI: "/assignImli",
    RETURN_IMLI: "/returnImli",
    ADD_CLEANED_IMLI: "/addCleanedImli",
    ASSIGNMENT_HISTORY: "/assignment-history",

    // ─── Payment ──────────────────────────────────────────────────────────────
    IMLI_PRICE: "/imli-price",
    ORDER_REFERENCE: "/order-reference",
    CONFIRM_PAYMENT: "/confirm-payment",
    PAYMENT_LOGS: "/paymentlogs",

    // ─── Invoice / Billing ────────────────────────────────────────────────────
    GENERATE_INVOICE: "/generateInvoice",
    GET_INVOICE_PDF: (id) => `/invoice/${id}/pdf`,

    // ─── Settings ─────────────────────────────────────────────────────────────
    GET_SETTINGS: "/settings",
    SAVE_SETTINGS: "/saveSetting",

    // ─── Dashboard ────────────────────────────────────────────────────────────
    RECENT_ACTIVITY: "/dashboard/activity",
    FULL_ACTIVITY: "/dashboard/full-activity",
    TREND_DATA: "/dashboard/trend",

    // ─── Excel Export ─────────────────────────────────────────────────────────
    EXPORT_PAYMENTS: "/export/payments",
    EXPORT_LOCALS: "/export/locals",
    EXPORT_USER: (userId) => `/export/user/${userId}`,
};

export default API;
