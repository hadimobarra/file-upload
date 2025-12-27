import React, { useCallback } from 'react';
import { Paper, Typography, Button, Box } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useDropzone } from 'react-dropzone';

function FileUploader({ onFileUpload, disabled }) {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'text/plain': ['.csv', '.txt']
    },
    maxFiles: 1,
    disabled
  });

  return (
    <Paper
      {...getRootProps()}
      sx={{
        p: 4,
        textAlign: 'center',
        cursor: disabled ? 'default' : 'pointer',
        backgroundColor: isDragActive ? 'action.hover' : 'background.default',
        border: '2px dashed',
        borderColor: isDragActive ? 'primary.main' : 'divider',
        '&:hover': {
          backgroundColor: disabled ? 'background.default' : 'action.hover'
        }
      }}
    >
      <input {...getInputProps()} />
      <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
      <Typography variant="h6" gutterBottom>
        {isDragActive ? 'Drop CSV file here' : 'Drag & drop CSV file here'}
      </Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        or
      </Typography>
      <Button
        variant="contained"
        component="span"
        disabled={disabled}
        sx={{ mt: 1 }}
      >
        Browse Files
      </Button>
      <Typography variant="caption" display="block" sx={{ mt: 2, color: 'text.secondary' }}>
        Supported format: CSV with two columns (source, target)
      </Typography>
      <Typography variant="caption" display="block" sx={{ color: 'text.secondary' }}>
        Supports 100K to 1M edges
      </Typography>
    </Paper>
  );
}

export default FileUploader;