'use server';

import { UploadFileProps } from '@/types';
import { createAdminClient } from '../appwriter';
import { onError } from './global.action';
import { InputFile } from 'node-appwrite/file';
import { appwriteConfig } from '../appwriter/config';
import { ID, Models, Query } from 'node-appwrite';
import { constructFileUrl, getFileType, parseStringify } from '../utils';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from './user.actions';

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

const createQueries = (currentUser: Models.DefaultDocument) => {
  const queries = [
    Query.or([
      Query.equal('owner', [currentUser.$id]),
      Query.contains('users', [currentUser.email]),
    ]),
  ];

  return queries;
};

export const getFiles = async () => {
  const { database } = await createAdminClient();

  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) throw new Error('User tidak ditemukan');

    const queries = createQueries(currentUser);

    console.log({ currentUser, queries });

    const files = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      queries
    );
    console.log({ files });

    return parseStringify(files);
  } catch (error) {
    onError(error, 'Gagal ketika menampilkan file');
  }
};
