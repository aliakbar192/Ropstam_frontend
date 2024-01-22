import '../../App.css';
import React, { useEffect, useState } from 'react';
// import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Avatar, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import validationService from '../../services/validationService';
import Joi from 'joi';
import carService from '../../services/carService';
import authService from '../../services/authService';
import { useNavigate, useParams } from 'react-router-dom';
const CarForm = () => {
    const { carId } = useParams();
    console.log(carId);
    const [make, setMake] = useState('');
    const [model, setModel] = useState('');
    const [variant, setVariant] = useState('');
    const [year, setYear] = useState('');
    const [color, setColor] = useState('');
    const [category, setCategory] = useState('');
    const [registration_no, setRegistration_No] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    console.log(errors);
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
                // Fetch car data by carId and populate the form
                const response = await carService.getOneCarById(carId);
                const carData = response.data.data.car;
                setMake(carData.make);
                setModel(carData.model);
                setVariant(carData.variant);
                setYear(carData.year);
                setColor(carData.color);
                setCategory(carData.category);
                setRegistration_No(carData.registration_no);
            } catch (error) {
                console.error('Error fetching car data:', error);
                // Handle error (e.g., redirect to an error page)
            }
        };

        // Fetch data only if carId is provided
        if (carId) {
            fetchData();
        }
    }, [carId]);
    const handleChange =
        (name, setData) =>
        ({ target: input }) => {
            const errorMessage = validationService.validateProperty(input, schema);

            setErrors((previousErrors) => ({ ...previousErrors, [name]: errorMessage }));
            setData(input.value);
        };
    const handleSubmit = () => {
        const errors = validationService.validate(
            { make, model, registration_no, variant, year, category, color },
            schema,
        );

        setErrors(errors || {});
        if (errors) {
            console.log(errors);
        } else {
            carId ? handleUpdate() : doSubmit();
        }
    };
    const doSubmit = async () => {
        try {
            const user = authService.getCurrentUser();

            const response = await carService.createCarData({
                make,
                model,
                variant,
                year,
                color,
                registration_no,
                category,
                user_id: user._id,
            });
            console.log(response);
            if (response.data.code === 200) {
                console.log(response);
                const { data } = response.data.data;
                console.log(data);
                navigate('/dashboard');
            }
        } catch (ex) {
            console.log(ex);
        }
    };

    const handleUpdate = async () => {
        try {
            const response = await carService.updateCar(carId, {
                make,
                model,
                variant,
                year,
                color,
                registration_no,
                category,
            });

            if (response.data.code === 200) {
                console.log(response);
                navigate('/dashboard');
            }
        } catch (ex) {
            console.log(ex);
        }
    };

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
                            value={category}
                            onChange={handleChange('cateegory', setCategory)}
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
                                value={make}
                                autoFocus
                                onChange={handleChange('make', setMake)}
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
                                value={model}
                                autoFocus
                                onChange={handleChange('model', setModel)}
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
                                value={year}
                                onChange={handleChange('year', setYear)}
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
                                value={variant}
                                onChange={handleChange('variant', setVariant)}
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
                                value={color}
                                onChange={handleChange('color', setColor)}
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
                                value={registration_no}
                                onChange={handleChange('registration_no', setRegistration_No)}
                            />
                            {errors.registration_no && <span className="loginerror">{errors.registration_no}</span>}
                        </Grid>
                    </Grid>
                    <Button fullWidth variant="contained" onClick={handleSubmit} sx={{ mt: 3, mb: 2 }}>
                        {carId ? 'Update' : 'Add'}
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};
export default CarForm;
