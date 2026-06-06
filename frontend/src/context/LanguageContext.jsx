import { createContext, useContext, useState, useEffect } from "react"

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
    const [lang, setLang] = useState(() => {
        return localStorage.getItem("lang") || "en"
    })

    useEffect(() => {
        localStorage.setItem("lang", lang)
    }, [lang])

    const toggleLang = () => {
        setLang((prev) => (prev === "en" ? "ur" : "en"))
    }

    return (
        <LanguageContext.Provider value={{ lang, toggleLang }}>
            {children}
        </LanguageContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLang() {
    return useContext(LanguageContext)
}
