'use server';

import { createAdminClient, createSessionClient } from '@/lib/appwriter';
import { appwriteConfig } from '@/lib/appwriter/config';
import { ID, Query } from 'node-appwrite';
import { parseStringify } from '../utils';
import { cookies } from 'next/headers';
import { avatarPlaceholderUrl } from '@/constants';

type UsersType = {
  fullName: string;
  email: string;
};

type OTPType = {
  accountId: string;
  passcode: string;
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

export const getCurrentUser = async () => {
  const { account, database } = await createSessionClient();

  const result = await account.get();

  const user = await database.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.usersCollectionId,
    [Query.equal('accountId', [result.$id])]
  );

  if (user.total > 0) return parseStringify(user.documents[0]);
};

const onError = (error: unknown, message: string) => {
  console.log(error, message);
  throw error;
};

export const sendEmailOTP = async ({ email }: { email: string }) => {
  const { account } = await createAdminClient();

  try {
    const session = await account.createEmailToken(ID.unique(), email);

    return session.userId;
  } catch (error) {
    onError(error, 'Failed to send email verification');
  }
};

export const createAccount = async ({ fullName, email }: UsersType) => {
  const existUser = await getUserByEmail(email);

  const accountId = await sendEmailOTP({ email });

  if (!accountId) throw new Error('Failed to send an OTP');

  if (!existUser) {
    const { database } = await createAdminClient();

    await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      ID.unique(),
      {
        fullName,
        email,
        accountId,
        // https://e7.pngegg.com/pngimages/84/165/png-clipart-united-states-avatar-organization-information-user-avatar-service-computer-wallpaper-thumbnail.png
        avatar: avatarPlaceholderUrl,
      }
    );
  }

  return parseStringify({ accountId });
};

export const verifyOTP = async ({ accountId, passcode }: OTPType) => {
  try {
    const { account } = await createAdminClient();
    const session = await account.createSession(accountId, passcode);

    (await cookies()).set('appwrite-session', session.secret, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
    });

    return parseStringify({ sessionId: session.$id });
  } catch (error) {
    onError(error, 'Failed to verify OTP');
  }
};
