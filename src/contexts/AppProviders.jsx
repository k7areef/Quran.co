import { TafsirContextProvider } from "./TafsirContext";

function AppProviders({ children }) {
    return (
        <>
            <TafsirContextProvider>
                {children}
            </TafsirContextProvider>
        </>
    )
}

export default AppProviders;