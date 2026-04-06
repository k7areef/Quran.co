import { SettingsContextProvider } from "./SettingsContext";
import { SidebarChaptersContextProvider } from "./SidebarChaptersContext";

function AppProviders({ children }) {
    return (
        <>
            <SettingsContextProvider>
                <SidebarChaptersContextProvider>
                    {children}
                </SidebarChaptersContextProvider>
            </SettingsContextProvider>
        </>
    )
}

export default AppProviders;