import { AudioPlayerContextProvider } from "./AudioPlayerContext";
import { SettingsContextProvider } from "./SettingsContext";
import { SidebarChaptersContextProvider } from "./SidebarChaptersContext";

function AppProviders({ children }) {
    return (
        <>
            <SettingsContextProvider>
                <SidebarChaptersContextProvider>
                    <AudioPlayerContextProvider>
                        {children}
                    </AudioPlayerContextProvider>
                </SidebarChaptersContextProvider>
            </SettingsContextProvider>
        </>
    )
}

export default AppProviders;