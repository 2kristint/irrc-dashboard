import {
    Button,
} from '@mui/material';

const jsonToCsv = (jsonData) => {
    const headers = Object.keys(jsonData[0]).join(',');
    const rows = jsonData.map(row =>
        Object.values(row)
            .map(value => `"${value}"`)
            .join(',')
    );
    return [headers, ...rows].join('\n');
};

const DownloadButton = ({ jsonData }) => {

    const downloadCSV = () => {
        try {
            // Check if data is available
            if (!jsonData) return;

            // Convert JSON to CSV
            const csvData = jsonToCsv(jsonData);

            // Create a Blob from the CSV data
            const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);

            // Create a link to download the file
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'data.csv');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error fetching or converting data', error);
        }
    };

    return <Button variant="contained" onClick={downloadCSV}>Download CSV of "{jsonData[0].question_name}"</Button>;

};

export default DownloadButton;
