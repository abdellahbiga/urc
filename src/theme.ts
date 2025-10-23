// src/theme.ts
import { createTheme } from '@mui/material/styles'

// Exemple de thème personnalisé
const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2', // bleu
        },
        secondary: {
            main: '#9c27b0', // violet
        },
        background: {
            default: '#f5f5f5', // gris clair pour le fond
        },
    },
    typography: {
        fontFamily: 'Roboto, Arial, sans-serif',
    },
})

export default theme
