// All Urdu translations in one place
// Usage: import { t } from '../i18n/translations'
// Then:  t("Raw Imli") → "خام املی"

const translations = {
    // ─── Dashboard Stats ───
    "Raw Imli": "خام املی",
    "Cleaned Imli": "صاف املی",
    "Distributed Imli to Locals": "تقسیم شدہ املی",
    "Pending Imli to be returned": "واپس آنے والی املی",

    // ─── Sidebar / Navigation ───
    "Dashboard": "ڈیش بورڈ",
    "Add Raw Imli": "خام املی شامل کریں",
    "Assign Imli": "املی تقسیم کریں",
    "Imli Returned": "املی واپسی",
    "Imli Cleaned": "صاف شدہ املی",
    "Locals": "مقامی لوگ",
    "Locals Profile": "مقامی پروفائل",
    "Payment": "ادائیگی",
    "Settings": "ترتیبات",
    "Logout": "لاگ آؤٹ",

    // ─── Quick Actions ───
    "Quick Actions": "فوری اقدامات",
    "Add Raw Imli Stock": "خام املی اسٹاک شامل کریں",

    // ─── Forms / Labels ───
    "Local ID": "مقامی آئی ڈی",
    "Local Name": "مقامی نام",
    "Local Address": "مقامی پتہ",
    "Local Phone": "مقامی فون",
    "Quantity": "مقدار",
    "Assigned Quantity": "تقسیم شدہ مقدار",
    "Returned Quantity": "واپس شدہ مقدار",
    "Total Paid Amount": "کل ادا شدہ رقم",
    "Price": "قیمت",
    "Amount": "رقم",
    "Search": "تلاش",

    // ─── Payment ───
    "UPI ID": "یو پی آئی آئی ڈی",
    "Cash": "نقد",
    "Online": "آن لائن",
    "Confirm Payment": "ادائیگی کی تصدیق",
    "Payment Successful": "ادائیگی کامیاب",
    "Order Reference": "آرڈر حوالہ",
    "Total": "کل",
    "Method": "طریقہ",
    "Scan QR to Pay": "ادائیگی کے لیے QR اسکین کریں",
    "Generate QR": "QR بنائیں",

    // ─── Buttons / Actions ───
    "Submit": "جمع کرائیں",
    "Cancel": "منسوخ",
    "Save": "محفوظ کریں",
    "Edit": "ترمیم",
    "Delete": "حذف کریں",
    "Add": "شامل کریں",
    "Update": "اپ ڈیٹ",
    "Close": "بند کریں",
    "Back": "واپس",
    "View": "دیکھیں",
    "View Details": "تفصیلات دیکھیں",

    // ─── Table Headers ───
    "S.No": "نمبر شمار",
    "Name": "نام",
    "Phone": "فون",
    "Address": "پتہ",
    "Status": "حالت",
    "Date": "تاریخ",
    "Action": "عمل",
    "Actions": "اعمال",

    // ─── Status ───
    "PENDING": "زیر التواء",
    "SUCCESS": "کامیاب",
    "FAILED": "ناکام",

    // ─── Messages ───
    "No data found": "کوئی ڈیٹا نہیں ملا",
    "Loading": "لوڈ ہو رہا ہے",
    "Error": "خرابی",

    // ─── Sack Entry ───
    "Sack Entry": "بوری اندراج",
    "Latest Entries": "تازہ ترین اندراجات",
    "Return Clean Imli": "صاف املی واپسی",
    "Assignment": "تقسیم",

    // ─── Login ───
    "Login": "لاگ ان",
    "Username": "صارف نام",
    "Password": "پاس ورڈ",
};

/**
 * Get Urdu translation for an English key
 * @param {string} key - English text
 * @returns {string} Urdu translation (or key itself if not found)
 */
export const t = (key) => translations[key] || key;

/**
 * Check if a translation exists
 */
export const hasTranslation = (key) => key in translations;

export default translations;
