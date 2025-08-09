import React, { useState } from 'react';
import { faker } from '@faker-js/faker';
import {
    Box,
    Button,
    Container,
    Paper,
    Typography,
    Grid,
    IconButton,
    Tooltip,
    Snackbar,
    Alert,
    Divider
} from '@mui/material';
import {
    ContentCopy as CopyIcon,
    Lock as LockIcon,
    LockOpen as UnlockIcon,
    Refresh as RefreshIcon
} from '@mui/icons-material';

// 初始化 Faker 使用美国地区数据
faker.locale = 'en_US';

const generatePerson = () => {
    const gender = faker.person.sexType();
    const firstName = faker.person.firstName(gender);
    const lastName = faker.person.lastName();
    const state = faker.location.state();
    const city = faker.location.city();
    const streetAddress = faker.location.streetAddress();
    const zipCode = faker.location.zipCode(state);

    return {
        firstName,
        lastName,
        gender,
        state,
        city,
        streetAddress,
        zipCode,
        birthdate: faker.date.birthdate({ min: 18, max: 80, mode: 'age' }).toLocaleDateString('en-US'),
        locks: {
            firstName: false,
            lastName: false,
            gender: false,
            state: false,
            city: false,
            streetAddress: false,
            zipCode: false,
            birthdate: false
        }
    };
};

function App() {
    const [person, setPerson] = useState(generatePerson());
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const handleGenerate = () => {
        const newPerson = generatePerson();

        setPerson(prev => {
            const result = { ...newPerson, locks: { ...prev.locks } };

            Object.keys(prev.locks).forEach(key => {
                if (prev.locks[key]) {
                    result[key] = prev[key];
                }
            });

            return result;
        });
    };

    const handleCopy = (field, value) => {
        navigator.clipboard.writeText(value)
            .then(() => {
                setSnackbarMessage(`${field} copied to clipboard!`);
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
            })
            .catch(err => {
                setSnackbarMessage(`Failed to copy: ${err}`);
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            });
    };

    const handleCopyAll = () => {
        const allText = Object.entries(person)
            .filter(([key]) => key !== 'locks')
            .map(([key, value]) => `${key}: ${value}`)
            .join('\n');

        navigator.clipboard.writeText(allText)
            .then(() => {
                setSnackbarMessage('All information copied to clipboard!');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
            })
            .catch(err => {
                setSnackbarMessage(`Failed to copy: ${err}`);
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            });
    };

    const handleLockToggle = (field) => {
        setPerson(prev => ({
            ...prev,
            locks: {
                ...prev.locks,
                [field]: !prev.locks[field]
            }
        }));
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const renderField = (label, value, fieldName) => (
        <Grid container spacing={2} sx={{ mb: 1 }}>
            <Grid item xs={3}>
                <Typography variant="subtitle1" sx={{
                    fontWeight: 'bold',
                    minWidth: '120px',
                    textAlign: 'right',
                    pr: 2
                }}>
                    {label}:
                </Typography>
            </Grid>
            <Grid item xs={6}>
                <Typography variant="body1" sx={{
                    fontFamily: 'monospace',
                    minHeight: '24px',
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    {value}
                </Typography>
            </Grid>
            <Grid item xs={3} sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                <Tooltip title="Copy">
                    <IconButton onClick={() => handleCopy(label, value)} size="small">
                        <CopyIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Tooltip title={person.locks[fieldName] ? 'Unlock' : 'Lock'}>
                    <IconButton
                        onClick={() => handleLockToggle(fieldName)}
                        size="small"
                        color={person.locks[fieldName] ? 'primary' : 'default'}
                    >
                        {person.locks[fieldName] ? <LockIcon fontSize="small" /> : <UnlockIcon fontSize="small" />}
                    </IconButton>
                </Tooltip>
            </Grid>
        </Grid>
    );

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
                    Random American Generator
                </Typography>

                <Box sx={{ mb: 4 }}>
                    {renderField('First Name', person.firstName, 'firstName')}
                    {renderField('Last Name', person.lastName, 'lastName')}
                    {renderField('Gender', person.gender, 'gender')}
                    <Divider sx={{ my: 2 }} />
                    {renderField('Street Address', person.streetAddress, 'streetAddress')}
                    {renderField('City', person.city, 'city')}
                    {renderField('State', person.state, 'state')}
                    {renderField('Zip Code', person.zipCode, 'zipCode')}
                    <Divider sx={{ my: 2 }} />
                    {renderField('Birthdate', person.birthdate, 'birthdate')}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<RefreshIcon />}
                        onClick={handleGenerate}
                    >
                        Generate New Person
                    </Button>

                    <Button
                        variant="outlined"
                        color="secondary"
                        startIcon={<CopyIcon />}
                        onClick={handleCopyAll}
                    >
                        Copy All Information
                    </Button>
                </Box>
            </Paper>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
}

export default App;
