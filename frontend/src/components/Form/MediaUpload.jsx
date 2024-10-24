import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { useState } from 'react';
import { FaTrash, FaUpload } from 'react-icons/fa';

const MediaUpload = ({ mediaLinks, setMediaLinks }) => {
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState(null);
    const [isDragActive, setIsDragActive] = useState(false);

    const onDrop = async (acceptedFiles) => {
        setIsDragActive(false);
        if (acceptedFiles.length === 0) return;

        setUploading(true);
        setUploadError(null);

        const formData = new FormData();
        acceptedFiles.forEach(file => formData.append('photos', file));

        try {
            const response = await axios.post('http://localhost:3000/api/v1/media/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            });
            setMediaLinks((prevLinks) => [...prevLinks, ...response.data]);
        } catch (error) {
            setUploadError('Error uploading media');
            console.error('Error uploading media:', error);
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveLink = (index) => {
        setMediaLinks((prevLinks) => prevLinks.filter((_, i) => i !== index));
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        onDragEnter: () => setIsDragActive(true),
        onDragLeave: () => setIsDragActive(false),
    });

    return (
        <div className="space-y-4">
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded p-6 cursor-pointer transition-colors duration-200 hover:border-blue-500
                text-gray-800
                hover:text-blue-500
                dark:text-gray-300 dark:hover:text-gray-800
                hover:bg-blue-100  ${isDragActive ? 'border-blue-500 bg-blue-100' : 'border-gray-300'}`}
            >
                <input {...getInputProps()} />
                <p className="text-center   ">
                    Drag & drop some files here, or click to select files
                </p>
            </div>

            {uploading && (
                <div className="flex items-center justify-center mt-2">
                    <FaUpload className="animate-spin mr-2" />
                    <p>Uploading...</p>
                </div>
            )}

            {uploadError && <div className="text-red-500 mt-2">{uploadError}</div>}

            <div className="flex flex-wrap mt-4 space-x-2">
                {mediaLinks.map((link, index) => (
                    <div key={index} className="relative">
                        <img src={link} alt="Uploaded" className="w-24 h-24 object-cover rounded" />
                        <button
                            type="button"
                            onClick={() => handleRemoveLink(index)}
                            className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                        >
                            <FaTrash />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MediaUpload;
