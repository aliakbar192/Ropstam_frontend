import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import authService from '../../services/authService';
import carService from '../../services/carService';

const Dashboard = () => {
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 5,
    });
    const [rows, setRows] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [rowCountState, setRowCountState] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);

            try {
                const user = authService.getCurrentUser();
                const carData = await carService.getAllCarByUser(user._id);
                console.log(carData.data.data.car);
                setRows(carData.data.data.car); // Assuming your car data is in the 'car' property
                setRowCountState(carData.pageInfo.totalRowCount);
            } catch (error) {
                console.error('Error fetching car data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Define your columns based on the fields you want to display
    const columns = [
        { field: 'make', headerName: 'Make', flex: 1 },
        { field: 'model', headerName: 'Model', flex: 1 },
        { field: 'variant', headerName: 'Variant', flex: 1 },
        { field: 'year', headerName: 'Year', flex: 1 },
        { field: 'color', headerName: 'Color', flex: 1 },
        { field: 'category', headerName: 'Category', flex: 1 },
        { field: 'registration_no', headerName: 'Registration No', flex: 1 },
        // Add more fields as needed
    ];

    return (
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSizeOptions={[5]}
                paginationMode="server"
                pagination={paginationModel}
                rowCount={rowCountState}
                loading={isLoading}
                onPageChange={(newPage) => handlePaginationModelChange({ ...paginationModel, page: newPage })}
                onPageSizeChange={(newPageSize) =>
                    handlePaginationModelChange({ ...paginationModel, pageSize: newPageSize })
                }
                getRowId={(row) => row._id || row.id} // Adjust this based on your data structure
            />
        </div>
    );
};

export default Dashboard;
