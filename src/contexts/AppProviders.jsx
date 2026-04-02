import { SettingsContextProvider } from "./SettingsContext";

function AppProviders({ children }) {
    return (
        <>
            <SettingsContextProvider>
                {children}
            </SettingsContextProvider>
        </>
    )
}

export default AppProviders;