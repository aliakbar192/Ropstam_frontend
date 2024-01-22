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

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const schema = Joi.object().keys({
        email: Joi.string()
            .email({ tlds: { tlds: false } })
            .required()
            .label('Email'),
        password: Joi.string().required().label('Password'),
    });

    const token = authService.getJwt();

    useEffect(() => {
        if (token) {
            navigate('/dashboard');
        }
    }, [token, navigate]);

    const handleChange =
        (name, setData) =>
        ({ target: input }) => {
            const errorMessage = validationService.validateProperty(input, schema);
            setErrors((previousErrors) => ({ ...previousErrors, [name]: errorMessage }));
            setData(input.value);
        };

    const handleSubmit = () => {
        const errors = validationService.validate({ email, password }, schema);
        setErrors(errors || {});

        if (!errors) {
            doSubmit();
        }
    };

    const doSubmit = async () => {
        try {
            setLoading(true);
            const response = await authService.login({ email, password });

            if (response.data.code === 200) {
                const { data } = response.data.data;
                authService.storeLoginData({ token: data.token, user: data.user });
                navigate('/dashboard');
            }
        } catch (ex) {
            console.log(ex);
            toastService.error(ex.message);
        } finally {
            setLoading(false);
        }
    };

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
                        Sign in
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={handleChange('email', setEmail)}
                        />
                        {errors.email && <span className="loginerror">{errors.email}</span>}

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={handleChange('password', setPassword)}
                        />
                        {errors.password && <span className="loginerror">{errors.password}</span>}

                        <Button
                            onClick={handleSubmit}
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={email === '' || password === '' || errors.email || errors.password}
                        >
                            {loading ? <CircularProgress size={'30px'} /> : 'Sign In'}
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="/signup" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </div>
    );
}

export default Login;
