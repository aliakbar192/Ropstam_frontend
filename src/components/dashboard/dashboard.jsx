import React, { useEffect, useState, useRef } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import authService from '../../services/authService';
import carService from '../../services/carService';
import './dashboard.css';
import { Box, Button, FormControl, InputLabel, LinearProgress, MenuItem, Select, Typography } from '@mui/material';

import { useNavigate } from 'react-router-dom';
const Dashboard = () => {
    const isInitialRender = useRef(true);
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [paginationModel, setPaginationModel] = useState({
        page: 1,
        pageSize: 10,
        totalPages: 0,
    });
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
    const [rows, setRows] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [rowCountState, setRowCountState] = useState(0);

    useEffect(() => {
        document.body.classList.add('dashboard-page');

        if (!isInitialRender.current) {
            // Skip fetching data on the initial render
            fetchData();
        } else {
            isInitialRender.current = false;
            // Set the default page size explicitly
            setPaginationModel((prevModel) => ({
                ...prevModel,
                pageSize: 10,
            }));
        }
    }, [paginationModel.page, paginationModel.pageSize, selectedCategory]);

    const fetchData = async () => {
        setIsLoading(true);

        try {
            const user = authService.getCurrentUser();
            const carData = await carService.getAllCarByUser({
                user_id: user._id,
                page: paginationModel.page,
                pageSize: paginationModel.pageSize,
                category: selectedCategory,
            });
            console.log('car data', carData);

            const { cars, totalCount, totalPages } = carData.data.data.car;

            setRows(cars);
            setRowCountState(totalCount);

            // Update totalPages in paginationModel using useEffect
            setPaginationModel((prevModel) => ({
                ...prevModel,
                totalPages,
                pageSize: 10, // Set the default page size
            }));
            isInitialRender.current === true;
        } catch (error) {
            console.error('Error fetching car data:', error);
        } finally {
            setIsLoading(false);
        }
    };
    const columns = [
        { field: 'make', headerName: 'Make', flex: 1, headerClassName: 'custom-header' },
        { field: 'model', headerName: 'Model', flex: 1, headerClassName: 'custom-header' },
        { field: 'variant', headerName: 'Variant', flex: 1, headerClassName: 'custom-header' },
        { field: 'year', headerName: 'Year', flex: 1 },
        { field: 'color', headerName: 'Color', flex: 1 },
        { field: 'category', headerName: 'Category', flex: 1 },
        { field: 'registration_no', headerName: 'Registration No', flex: 1 },
        {
            field: 'update',
            headerName: 'update',
            flex: 1,
            renderCell: (params) => <Button onClick={() => handleEditClick(params.row._id)}>Update</Button>,
        },
        {
            field: 'delete',
            headerName: 'Delete',
            flex: 1,
            renderCell: (params) => <Button onClick={() => handleDelete(params.row._id)}>Delete</Button>,
        },
    ];

    const handleDelete = async (carId) => {
        try {
            console.log(carId);
            await carService.deleteCarById(carId);

            fetchData();
        } catch (error) {
            console.error('Error deleting car:', error);
        }
    };
    const handleEditClick = async (carId) => {
        navigate(`/addDetails/${carId}`);
    };
    const handlePaginationModelChange = (newPaginationModel) => {
        if (
            newPaginationModel.page !== paginationModel.page ||
            newPaginationModel.pageSize !== paginationModel.pageSize
        ) {
            setPaginationModel((prevModel) => ({
                ...prevModel,
                page: newPaginationModel.page,
                pageSize: newPaginationModel.pageSize,
            }));
        }
    };

    return (
        <div className="dashboardContainer">
            <Box className="dashboard-hader">
                <Typography variant="h4">Total cars : {rowCountState} </Typography>
                <Box>
                    <FormControl sx={{ width: '200px', marginRight: '5px' }} xs={12}>
                        <InputLabel id="category">Select Category</InputLabel>
                        <Select
                            labelId="category"
                            id="category"
                            label="Select Category"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <MenuItem value="All">
                                <em>All</em>
                            </MenuItem>

                            {carCategories.map((category) => (
                                <MenuItem key={category} value={category}>
                                    {category}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button
                        sx={{ padding: '15px' }}
                        variant="contained"
                        onClick={() => {
                            navigate('/addDetails');
                        }}
                    >
                        Add New Car
                    </Button>
                </Box>
            </Box>
            <div style={{ width: '80%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    rowCount={rowCountState}
                    loading={isLoading}
                    slots={{
                        loadingOverlay: LinearProgress,
                        toolbar: GridToolbar,
                    }}
                    autoPageSize
                    paginationMode="server"
                    pagination={paginationModel}
                    onPaginationModelChange={(newPage) => {
                        console.log('Page changed', newPage);
                        handlePaginationModelChange({ ...paginationModel, page: newPage.page + 1 });
                    }}
                    getRowId={(row) => row._id || row.id}
                    totalPages={paginationModel.totalPages}
                />
            </div>
        </div>
    );
};

export default Dashboard;
