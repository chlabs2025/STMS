import { useLang } from '../context/LanguageContext'
import { t } from './translations'

/**
 * Display component for translated text.
 * - English mode  → renders the English string as plain text, no style change.
 * - Urdu mode     → renders the Urdu string wrapped in a <span> with Nastaliq font.
 *
 * Usage: <T k="Add Local" />
 * For placeholder / non-JSX strings, keep using: t("key", lang)
 */
export default function T({ k }) {
    const { lang } = useLang()
    const text = t(k, lang)

    if (lang === 'ur') {
        return <span className="nastaliq-text">{text}</span>
    }

    return text
}
