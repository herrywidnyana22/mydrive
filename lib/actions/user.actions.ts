'use server';

import { createAdminClient } from '@/lib/appwriter';
import { appwriteConfig } from '@/lib/appwriter/config';
import { ID, Query } from 'node-appwrite';

type UsersType = {
  fullName: string;
  email: string;
};

const getUserByEmail = async (email: string) => {
  const { database } = await createAdminClient();

  const result = await database.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.usersCollectionId,
    [Query.equal('email', [email])]
  );

  return result.total > 0 ? result.documents[0] : null;
};

const handleError = (error: unknown, message: string) => {
  throw error;
};

const sendEmailOTP = async ({ email }: UsersType) => {
  const { account } = await createAdminClient();

  try {
    const session = await account.createEmailToken(ID.unique(), email);

    return session.userId;
  } catch (error) {
    handleError(error, 'Failed to send email verification');
  }
};

const createAccount = async ({ fullName, email }: UsersType) => {
  const existUser = await getUserByEmail(email);

  const accountId = await sendEmailOTP({ email });

  if (!accountId) throw new Error('Failed to send an OTP');

  if (!existUser) {
    const { database } = await createAdminClient();

    await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {}
    );
  }
};
