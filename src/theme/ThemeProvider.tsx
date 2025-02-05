import React, {createContext, useContext, useEffect} from 'react';
import {lightColors, darkColors} from './Colors';
import {useColorScheme} from 'react-native';

// Define type for theme context value
interface ThemeContextType {
  dark: boolean;
  Colors: typeof lightColors; // Use the type of lightColors here, assuming both light and dark colors are similar
  setScheme: (scheme: 'light' | 'dark') => void;
}

// Create context with default values
export const ThemeContext = createContext<ThemeContextType>({
  dark: false,
  Colors: lightColors,
  setScheme: () => {},
});

// interface ThemeProviderProps {
//   children: ReactNode; // ReactNode covers all types of valid children
// }

export const ThemeProvider = (props: {
  children:
    | string
    | number
    | boolean
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | Iterable<React.ReactNode>
    | React.ReactPortal
    | null
}) => {
  const colorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = React.useState<boolean>(
    colorScheme === 'dark',
  );

  // Update theme on color scheme change
  useEffect(() => {
    setIsDarkMode(colorScheme === 'dark');
  }, [colorScheme]);

  const theme = {
    dark: isDarkMode,
    Colors: isDarkMode ? darkColors : lightColors,
    setScheme: (scheme: 'light' | 'dark') => setIsDarkMode(scheme === 'dark'),
  };

  return (
    <ThemeContext.Provider value={theme}>
      {props.children}
    </ThemeContext.Provider>
  );
};

// Custom hook to access the theme context
export const useTheme = (): ThemeContextType => useContext(ThemeContext);
