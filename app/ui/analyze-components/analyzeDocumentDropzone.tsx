// Copyright 2025 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { Box, Typography } from '@mui/material'
import React, { useState, useRef, ChangeEvent } from 'react';

import theme from '../../theme'
import { fileToBase64 } from './EditForm'
const { palette } = theme

const onPDFUploaded = async (file: File[]) => {
  // trigger the split of the PDF document here
  const base64 = await fileToBase64(file)
  const newDocument = `data:${file.type};base64,${base64}`
  setDocumenToAnalyze(newDocument)
}

interface PDFUploadProps {
  onPDFUploaded: (file: File) => void; // Callback function for when a PDF is uploaded
  allowedTypes?: string['application/pdf'];
}

const PDFUpload: React.FC<PDFUploadProps> = ({ onPDFUploaded, allowedTypes = ['application/pdf'] }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null); // Clear any previous errors
    const file = event.target.files?.[0];

    if (!file) {
      return; // No file selected
    }

    if (!allowedTypes.includes(file.type)) {
      setErrorMessage(`File type ${file.type} is not allowed. Only PDF files are accepted.`);
      return;
    }

    setSelectedFile(file);
    onPDFUploaded(file); // Call the callback function with the selected file
  };

  const handleUploadButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Programmatically trigger the file input dialog
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setErrorMessage(null);
      const file = event.dataTransfer.files?.[0];
      if (!file) {
        return; // No file selected
      }

      if (!allowedTypes.includes(file.type)) {
        setErrorMessage(`File type ${file.type} is not allowed. Only PDF files are accepted.`);
        return;
      }

      setSelectedFile(file);
      onPDFUploaded(file); // Call the callback function with the selected file
  }

  return (
    <div>
      <div
        style={{border: '1px dashed gray', padding: '20px', cursor: 'pointer'}}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <p>Drag and drop PDF here or</p>
        <button onClick={handleUploadButtonClick}>Upload PDF</button>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }} // Hide the actual input element
          accept=".pdf" // Specify accepted file types
          onChange={handleFileInputChange}
        />
      </div>
      {selectedFile && <p>Selected file: {selectedFile.name}</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
};

export default PDFUpload;
