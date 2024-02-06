import { Injectable } from '@nestjs/common';
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import path from 'path';
import * as streamifier from 'streamifier';

import { CloudinaryResponse } from './cloudinary.response';

@Injectable()
export class CloudinaryService {
  uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'KEDU_EDU',
          resource_type: 'auto',
          format: path.extname(file.originalname).split('.').pop(),
          public_id: path.basename(
            file.originalname,
            path.extname(file.originalname),
          ),
          unique_filename: true,
        },
        (error, result: UploadApiResponse) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
  uploadImageFile(file: Express.Multer.File): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'KEDU_EDU',
          allowed_formats: ['jpg', 'png', 'jpeg'],
          resource_type: 'auto',
        },
        (error, result: UploadApiResponse) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
  uploadBase64ImageFile(file: string): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'KEDU_EDU',
          resource_type: 'auto',
        },
        (error, result: UploadApiResponse) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
      streamifier.createReadStream(file).pipe(uploadStream);
    });
  }
  uploadBinaryFile(
    file: Buffer | Uint8Array,
    format: string,
  ): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'KEDU_EDU',
          resource_type: 'auto',
          format,
          use_filename: true,
          unique_filename: false,
        },
        (error, result: UploadApiResponse) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
      streamifier.createReadStream(file).pipe(uploadStream);
    });
  }
}
