'use server';

import { UploadFileProps } from '@/types';
import { createAdminClient } from '../appwriter';
import { onError } from './global.action';
import { InputFile } from 'node-appwrite/file';
import { appwriteConfig } from '../appwriter/config';
import { ID } from 'node-appwrite';
import { constructFileUrl, getFileType, parseStringify } from '../utils';
import { revalidatePath } from 'next/cache';

export const uploadFile = async ({ ownerId, accountId, file, path }: UploadFileProps) => {
  const { files, database } = await createAdminClient();

  try {
    const inputFile = InputFile.fromBuffer(file, file.name);
    const bucketFile = await files.createFile(
      appwriteConfig.bucketId,
      ID.unique(),
      inputFile
    );

    const fileDocument = {
      type: getFileType(bucketFile.name).type,
      name: bucketFile.name,
      url: constructFileUrl(bucketFile.$id),
      extension: getFileType(bucketFile.name).extension,
      size: bucketFile.sizeOriginal,
      owner: ownerId,
      accountId: accountId,
      users: [],
      bucketFileId: bucketFile.$id,
    };

    const newFile = await database
      .createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.filesCollectionId,
        ID.unique(),
        fileDocument
      )
      .catch(async (error: unknown) => {
        await files.deleteFile(appwriteConfig.bucketId, bucketFile.$id);
        onError(error, 'Gagal menyimpan file');
      });

    revalidatePath(path);

    return parseStringify(newFile);
  } catch (error) {
    onError(error, 'Gagal mengunggah file');
  }
};
