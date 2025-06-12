import React from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import SettingsIcon from '@mui/icons-material/Settings';
import SpellcheckIcon from '@mui/icons-material/Spellcheck';
import GrammarChecker from './extensions/grammar-checker';
import Settings from './components/Settings';

// Create theme
const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
});

// Main App component
function App() {
    const [value, setValue] = React.useState(0);
    const [grammarChecker] = React.useState(new GrammarChecker());

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Paper elevation={3} sx={{ p: 2, backgroundColor: theme.palette.primary.main }}>
                    <Typography variant="h5" component="h1" color="white">
                        QOL Extensions
                    </Typography>
                </Paper>
                
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs 
                        value={value} 
                        onChange={handleChange} 
                        aria-label="extension tabs"
                        variant="fullWidth"
                    >
                        <Tab 
                            icon={<SpellcheckIcon />} 
                            label="Grammar Checker" 
                            iconPosition="start"
                        />
                        <Tab 
                            icon={<SettingsIcon />} 
                            label="Settings" 
                            iconPosition="start"
                        />
                    </Tabs>
                </Box>

                <Container sx={{ flexGrow: 1, py: 2, overflow: 'auto' }}>
                    {value === 0 && (
                        <GrammarCheckerUI grammarChecker={grammarChecker} />
                    )}
                    {value === 1 && (
                        <Settings />
                    )}
                </Container>
            </Box>
        </ThemeProvider>
    );
}

// Grammar Checker UI component
function GrammarCheckerUI({ grammarChecker }) {
    const [text, setText] = React.useState('');
    const [result, setResult] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');

    const handleCheck = async () => {
        if (!text.trim()) {
            setError('Please enter some text to check.');
            return;
        }

        try {
            setLoading(true);
            setError('');
            const result = await grammarChecker.checkGrammar(text);
            setResult(result);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h6">Grammar Checker</Typography>
            
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter your text here..."
                style={{
                    width: '100%',
                    height: '150px',
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    resize: 'vertical'
                }}
            />

            <button
                onClick={handleCheck}
                disabled={loading}
                style={{
                    padding: '10px 20px',
                    backgroundColor: theme.palette.primary.main,
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1
                }}
            >
                {loading ? 'Checking...' : 'Check Grammar'}
            </button>

            {error && (
                <Typography color="error" sx={{ mt: 2 }}>
                    {error}
                </Typography>
            )}

            {result && (
                <Paper sx={{ p: 2, mt: 2 }}>
                    <div dangerouslySetInnerHTML={{ __html: result }} />
                </Paper>
            )}
        </Box>
    );
}

// Render the app
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />); 