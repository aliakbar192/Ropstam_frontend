import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import authService from '../../services/authService';
import carService from '../../services/carService';
import './dashboard.css';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    const [paginationModel, setPaginationModel] = useState({
        page: 1,
        pageSize: 10,
        totalPages: 0,
    });
    const [rows, setRows] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [rowCountState, setRowCountState] = useState(0);

    useEffect(() => {
        document.body.classList.add('dashboard-page');

        fetchData();
    }, [paginationModel.page, paginationModel.pageSize]);
    const fetchData = async () => {
        setIsLoading(true);

        try {
            const user = authService.getCurrentUser();
            const carData = await carService.getAllCarByUser({
                user_id: user._id,
                page: paginationModel.page,
                pageSize: paginationModel.pageSize,
            });

            const { cars, totalCount, totalPages } = carData.data.data.car;

            setRows(cars);
            setRowCountState(totalCount);

            // Update totalPages in paginationModel using useEffect
            setPaginationModel((prevModel) => ({
                ...prevModel,
                totalPages,
                pageSize: 10, // Set the default page size
            }));
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
        // Add more fields as needed
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
        console.log('Pagination changed', newPaginationModel);

        // If the new page is different from the current page, update paginationModel
        if (newPaginationModel.page !== paginationModel.page) {
            console.log('Updating pagination model');
            setPaginationModel((prevModel) => ({
                ...prevModel,
                page: newPaginationModel.page,
            }));
        }
    };

    return (
        <div className="dashboardContainer">
            <Box className="dashboard-hader">
                <Typography variant="h4">Total cars : {rowCountState} </Typography>
                <Button
                    variant="contained"
                    onClick={() => {
                        navigate('/addDetails');
                    }}
                >
                    Add New Car
                </Button>
            </Box>
            <div style={{ height: 'auto', width: '80%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSizeOptions={[10, 20, 30, 50, 70, 100]} // Set the default and other available page sizes
                    paginationMode="server"
                    pagination={paginationModel}
                    rowCount={rowCountState}
                    loading={isLoading}
                    onPaginationModelChange={(newPage) => {
                        console.log('Page changed', newPage);
                        handlePaginationModelChange({ ...paginationModel, page: newPage.page + 1 });
                    }}
                    onPageSizeChange={(newPageSize) =>
                        handlePaginationModelChange({
                            ...paginationModel,
                            pageSize: newPageSize,
                            page: 1,
                        })
                    }
                    getRowId={(row) => row._id || row.id}
                    totalPages={paginationModel.totalPages}
                />
            </div>
        </div>
    );
};

export default Dashboard;
