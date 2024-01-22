import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Avatar,
    Box,
    Button,
    CircularProgress,
    Container,
    CssBaseline,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import Joi from 'joi';
import carService from '../../services/carService';
import authService from '../../services/authService';
import toastService from '../../services/toastService';
import validationService from '../../services/validationService';

const CarForm = () => {
    const { carId } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        category: '',
        make: '',
        model: '',
        year: '',
        variant: '',
        color: '',
        registration_no: '',
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const carCategories = [
        'Bus',
        'Sedan',
        'SUV',
        'Hatchback',
        'Convertible',
        'Coupe',
        'Crossover',
        'Minivan',
        'Pickup Truck',
        'Wagon',
        'Electric',
        'Hybrid',
        'Luxury',
        'Sports Car',
        'Truck',
        'Van',
    ];

    const schema = Joi.object().keys({
        make: Joi.string().required().label('Make'),
        model: Joi.string().required().label('Model'),
        variant: Joi.string().required().label('Variant'),
        year: Joi.string().required().label('Year'),
        color: Joi.string().required().label('Color'),
        category: Joi.string().required().label('Category'),
        registration_no: Joi.string().required().label('Registration Number'),
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (carId) {
                    const response = await carService.getOneCarById(carId);
                    const carData = response.data.data.car;
                    const { category, make, model, year, variant, color, registration_no } = carData;

                    setFormData({
                        category,
                        make,
                        model,
                        year,
                        variant,
                        color,
                        registration_no,
                    });
                }
            } catch (error) {
                console.error('Error fetching car data:', error);
                toastService.error(error.message);
            }
        };

        if (carId) {
            fetchData();
        }
    }, [carId]);

    const handleChange = (name) => (event) => {
        const value = event.target.value;
        const errorMessage = validationService.validateProperty({ name, value }, schema);
        setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMessage }));
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const validateForm = () => {
        const validationErrors = validationService.validate(formData, schema);
        setErrors(validationErrors || {});
        return !validationErrors;
    };

    const handleSubmit = async () => {
        if (validateForm()) {
            carId ? handleUpdate() : doSubmit();
        } else {
            console.log(errors);
        }
    };

    const doSubmit = async () => {
        try {
            setLoading(true);
            const user = authService.getCurrentUser();
            const response = await carService.createCarData({ ...formData, user_id: user._id });

            if (response.data.code === 200) {
                console.log(response);
                navigate('/dashboard');
            }
        } catch (ex) {
            console.log(ex);
            setLoading(false);
            toastService.error(ex.message);
        }
    };

    const handleUpdate = async () => {
        try {
            setLoading(true);
            const response = await carService.updateCar(carId, formData);

            if (response.data.code === 200) {
                console.log(response);
                navigate('/dashboard');
            }
        } catch (ex) {
            console.log(ex);
            setLoading(false);
            toastService.error(ex.message);
        }
    };

    return (
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
                    <DirectionsCarIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    {carId ? 'Update Item' : 'Add Item'}
                </Typography>
                <Box sx={{ mt: 3 }}>
                    <FormControl fullWidth sx={{ marginBottom: 2 }} xs={12}>
                        <InputLabel id="category">Select Category</InputLabel>
                        <Select
                            labelId="category"
                            id="category"
                            label="Select Category"
                            value={formData.category}
                            onChange={handleChange('category')}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>

                            {carCategories.map((category) => (
                                <MenuItem key={category} value={category}>
                                    {category}
                                </MenuItem>
                            ))}
                        </Select>
                        {errors.category && <span className="loginerror">{errors.category}</span>}
                    </FormControl>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                name="make"
                                required
                                fullWidth
                                id="make"
                                label="Make"
                                value={formData.make}
                                onChange={handleChange('make')}
                            />
                            {errors.make && <span className="loginerror">{errors.make}</span>}
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="model"
                                required
                                fullWidth
                                id="model"
                                label="Model"
                                value={formData.model}
                                onChange={handleChange('model')}
                            />
                            {errors.model && <span className="loginerror">{errors.model}</span>}
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="year"
                                label="Year"
                                name="year"
                                value={formData.year}
                                onChange={handleChange('year')}
                            />
                            {errors.year && <span className="loginerror">{errors.year}</span>}
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="variant"
                                label="Variant"
                                name="variant"
                                value={formData.variant}
                                onChange={handleChange('variant')}
                            />
                            {errors.variant && <span className="loginerror">{errors.variant}</span>}
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="color"
                                label="Color"
                                name="color"
                                value={formData.color}
                                onChange={handleChange('color')}
                            />
                            {errors.color && <span className="loginerror">{errors.color}</span>}
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="registration_no"
                                label="Registration Number"
                                name="registration_no"
                                value={formData.registration_no}
                                onChange={handleChange('registration_no')}
                            />
                            {errors.registration_no && <span className="loginerror">{errors.registration_no}</span>}
                        </Grid>
                    </Grid>
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={handleSubmit}
                        sx={{ mt: 3, mb: 2 }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={'30px'} /> : carId ? 'Update' : 'Add'}
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default CarForm;
