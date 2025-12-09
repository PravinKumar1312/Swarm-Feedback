import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Upload, X, Check } from 'lucide-react';
import FuturisticButton from './ui/FuturisticButton';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const ImageUpload = ({ currentImage, onImageUpdate }) => {
    const [imageSrc, setImageSrc] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [uploading, setUploading] = useState(false);

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const readFile = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.addEventListener('load', () => resolve(reader.result));
            reader.readAsDataURL(file);
        });
    };

    const handleFileChange = async (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const imageDataUrl = await readFile(file);
            setImageSrc(imageDataUrl);
        }
    };

    const createImage = (url) =>
        new Promise((resolve, reject) => {
            const image = new Image();
            image.addEventListener('load', () => resolve(image));
            image.addEventListener('error', (error) => reject(error));
            image.setAttribute('crossOrigin', 'anonymous');
            image.src = url;
        });

    const getCroppedImg = async (imageSrc, pixelCrop) => {
        const image = await createImage(imageSrc);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height
        );

        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                resolve(blob);
            }, 'image/jpeg');
        });
    };

    const handleUpload = async () => {
        try {
            setUploading(true);
            const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);

            const formData = new FormData();
            formData.append('file', croppedImageBlob, 'profile.jpg');

            const response = await api.post('/users/me/picture', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            onImageUpdate(response.data.profilePic);
            setImageSrc(null);
            toast.success('Profile picture updated!');
        } catch (error) {
            console.error('Upload failed', error);
            toast.error('Failed to upload image.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="mb-6">
            <label className="block text-sm font-medium text-gray-400 mb-2">Profile Picture</label>

            {!imageSrc ? (
                <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-white/10 border border-white/20">
                        {currentImage ? (
                            <img src={currentImage} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                                <Upload size={24} />
                            </div>
                        )}
                    </div>
                    <div>
                        <input
                            type="file"
                            accept="image/png, image/jpeg"
                            onChange={handleFileChange}
                            className="hidden"
                            id="profile-upload"
                        />
                        <label
                            htmlFor="profile-upload"
                            className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors text-sm font-medium"
                        >
                            <Upload size={16} /> Upload New Picture
                        </label>
                        <p className="text-xs text-gray-500 mt-1">Supports PNG, JPG</p>
                    </div>
                </div>
            ) : (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-slate-900 p-6 rounded-2xl w-full max-w-lg border border-white/10">
                        <h3 className="text-xl font-bold text-white mb-4">Adjust Profile Picture</h3>
                        <div className="relative h-64 w-full bg-black rounded-lg overflow-hidden mb-4">
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                            />
                        </div>
                        <div className="flex justify-between items-center gap-4">
                            <input
                                type="range"
                                value={zoom}
                                min={1}
                                max={3}
                                step={0.1}
                                aria-labelledby="Zoom"
                                onChange={(e) => setZoom(e.target.value)}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="flex gap-2">
                                <FuturisticButton variant="outline" onClick={() => setImageSrc(null)}>
                                    <X size={18} /> Cancel
                                </FuturisticButton>
                                <FuturisticButton variant="primary" onClick={handleUpload} disabled={uploading}>
                                    {uploading ? 'Uploading...' : <><Check size={18} /> Save</>}
                                </FuturisticButton>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
