import { CssBaseline, ThemeProvider, createTheme, Box } from '@mui/material';
import OpenAiChat from '../OpenAl/OpenAl';
const theme = createTheme({
    palette: {
        background: {
            default: '#f4f6f8'
        }
    },
});

function OpenAiChatPage() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box
                component="main"
                sx={{
                    height: 'calc(100vh - 64px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <OpenAiChat />
            </Box>
        </ThemeProvider>
    );
}

export default OpenAiChatPage;