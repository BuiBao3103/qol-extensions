import React from 'react';
import { Box, Typography, TextField, Button, Paper, Snackbar, Alert } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

function Settings() {
    const [apiKeys, setApiKeys] = React.useState({
        google: '',
    });
    const [snackbar, setSnackbar] = React.useState({
        open: false,
        message: '',
        severity: 'success'
    });

    // Load saved API keys when component mounts
    React.useEffect(() => {
        chrome.storage.sync.get(['apiKeys'], (result) => {
            if (result.apiKeys) {
                setApiKeys(result.apiKeys);
            }
        });
    }, []);

    const handleChange = (key) => (event) => {
        setApiKeys(prev => ({
            ...prev,
            [key]: event.target.value
        }));
    };

    const handleSave = () => {
        chrome.storage.sync.set({ apiKeys }, () => {
            setSnackbar({
                open: true,
                message: 'API keys saved successfully!',
                severity: 'success'
            });
        });
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Typography variant="h6">Settings</Typography>
            
            <Paper sx={{ p: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                    API Keys
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        label="Google AI API Key"
                        value={apiKeys.google}
                        onChange={handleChange('google')}
                        type="password"
                        fullWidth
                        helperText="Required for Grammar Checker"
                    />
                </Box>

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        variant="contained"
                        startIcon={<SaveIcon />}
                        onClick={handleSave}
                    >
                        Save Settings
                    </Button>
                </Box>
            </Paper>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default Settings; 