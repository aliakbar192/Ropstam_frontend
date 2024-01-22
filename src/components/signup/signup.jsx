import '../../App.css';
import React, { useEffect, useState } from 'react';
import {
    Avatar,
    Box,
    Button,
    CircularProgress,
    Container,
    CssBaseline,
    Grid,
    Link,
    TextField,
    Typography,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Joi from 'joi';
import validationService from '../../services/validationService';
import authService from '../../services/authService';
import toastService from '../../services/toastService';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const schema = Joi.object().keys({
        email: Joi.string()
            .email({ tlds: { tlds: false } })
            .required()
            .label('Email'),
        firstName: Joi.string().required().label('First Name'),
        lastName: Joi.string().required().label('Last Name'),
    });

    const handleChange =
        (name, setData) =>
        ({ target: input }) => {
            const errorMessage = validationService.validateProperty(input, schema);
            setErrors((previousErrors) => ({ ...previousErrors, [name]: errorMessage }));
            setData(input.value);
        };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const data = await authService.register({ firstName, lastName, email });

            if (data.data.code === 200) {
                toastService.success('Signup succeeded. Please check your email.');
                navigate('/');
            }
        } catch (ex) {
            console.log(ex);
            toastService.error(ex.message);
        } finally {
            setLastName('');
            setFirstName('');
            setEmail('');
            setLoading(false);
        }
    };
    const token = authService.getJwt();

    useEffect(() => {
        if (token) {
            navigate('/dashboard');
        }
    }, [token, navigate]);
    return (
        <div className="sign_up">
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    <Box sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    autoComplete="given-name"
                                    name="firstName"
                                    required
                                    fullWidth
                                    id="firstName"
                                    label="First Name"
                                    autoFocus
                                    value={firstName}
                                    onChange={handleChange('firstName', setFirstName)}
                                />
                                {errors.firstName && <span className="loginerror">{errors.firstName}</span>}
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="lastName"
                                    label="Last Name"
                                    name="lastName"
                                    value={lastName}
                                    onChange={handleChange('lastName', setLastName)}
                                />
                                {errors.lastName && <span className="loginerror">{errors.lastName}</span>}
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    value={email}
                                    onChange={handleChange('email', setEmail)}
                                />
                                {errors.email && <span className="loginerror">{errors.email}</span>}
                            </Grid>
                        </Grid>
                        <Button
                            onClick={handleSubmit}
                            fullWidth
                            variant="contained"
                            disabled={email === '' || firstName === '' || lastName === '' || loading}
                            sx={{ mt: 3, mb: 2 }}
                        >
                            {loading ? <CircularProgress size={'30px'} /> : 'Sign up'}
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="/" variant="body2">
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </div>
    );
};

export default Signup;
