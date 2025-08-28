'use server';

import {
  RenameFileProps,
  UploadFileProps,
  UpdateSharedFileProps,
  DeleteFileProps,
  GetFilesProps,
} from '@/types';
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

const createQueries = (
  currentUser: Models.DefaultDocument,
  types: string[],
  searchText: string,
  sortType: string,
  limit?: number
) => {
  const queries = [
    Query.or([
      Query.equal('owner', [currentUser.$id]),
      Query.contains('users', [currentUser.email]),
    ]),
  ];

  if (types.length > 0) queries.push(Query.equal('type', types));
  if (searchText) queries.push(Query.contains('name', searchText));
  if (limit) queries.push(Query.limit(limit));

  //'$createdAt-desc'
  if (sortType) {
    const [sortBy, orderBy] = sortType.split('-');

    queries.push(orderBy === 'asc' ? Query.orderAsc(sortBy) : Query.orderDesc(sortBy));
  }

  return queries;
};

export const getFiles = async ({
  types = [],
  searchText = '',
  sortType = '$createdAt-desc',
  limit,
}: GetFilesProps) => {
  const { database } = await createAdminClient();

  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) onError('User', 'User tidak ditemukan');

    const queries = createQueries(currentUser, types, searchText, sortType, limit);

    const files = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      queries
    );

    return parseStringify(files);
  } catch (error) {
    onError(error, 'Gagal ketika menampilkan file');
    return [];
  }
};

export const renameFile = async ({ fileId, name, ext, path }: RenameFileProps) => {
  const { database } = await createAdminClient();
  try {
    const newName = `${name}.${ext}`;
    const updateFile = await database.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileId,
      { name: newName }
    );

    revalidatePath(path);
    return parseStringify(updateFile);
  } catch (error) {
    onError(error, 'Gagal mengubah nama file');
  }
};

export const updateSharedFile = async ({
  fileId,
  email,
  path,
  mode,
}: UpdateSharedFileProps) => {
  const { database } = await createAdminClient();

  try {
    const fileDoc = await database.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileId
    );

    const currentUsers: string[] = fileDoc.users ?? [];
    let updatedUsers: string[] = [];

    if (mode === 'share') {
      if (currentUsers.includes(email)) {
        onError(email, `${email} sudah ada`);
      }
      updatedUsers = [...currentUsers, email];
    }

    if (mode === 'unshare') {
      if (!currentUsers.includes(email)) {
        onError(email, `${email} tidak ditemukan`);
      }
      updatedUsers = currentUsers.filter(u => u !== email);
    }

    const updateFile = await database.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileId,
      { users: updatedUsers }
    );

    revalidatePath(path);
    return parseStringify(updateFile);
  } catch (error) {
    onError(error, 'Gagal membagikan file');
    return null;
  }
};

export const deleteFile = async ({ fileId, bucketFileId, path }: DeleteFileProps) => {
  const { database, files } = await createAdminClient();

  try {
    // Ambil dokumen file dulu untuk cek owner dan users[]
    const currentUser = await getCurrentUser();

    if (!currentUser) onError('User', 'User tidak ditemukan');

    const fileDoc = await database.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileId
    );

    if (!fileDoc) onError('File:', 'File not found');

    if (fileDoc.owner === currentUser.$id) {
      // ✅ Owner -> hapus dokumen dan file di bucket
      await database.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.filesCollectionId,
        fileId
      );
      await files.deleteFile(appwriteConfig.bucketId, bucketFileId);
    } else {
      // ✅ Bukan owner -> update field users[]
      const updatedUsers = fileDoc.users.filter(
        (email: string) => email !== currentUser.email
      );

      await database.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.filesCollectionId,
        fileId,
        { users: updatedUsers }
      );
    }

    revalidatePath(path);
    return parseStringify({ status: 'success' });
  } catch (error) {
    onError(error, 'Gagal menghapus file');
    return null;
  }
};
