'use server';

import { createAdminClient, createSessionClient } from '@/lib/appwriter';
import { appwriteConfig } from '@/lib/appwriter/config';
import { ID, Query } from 'node-appwrite';
import { parseStringify } from '../utils';
import { cookies } from 'next/headers';
import { avatarPlaceholderUrl } from '@/constants';
import { redirect } from 'next/navigation';
import { OTPType, RegisterProps } from '@/types';
import { onError } from './global.action';

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

export const sendEmailOTP = async ({ email }: { email: string }) => {
  const { account } = await createAdminClient();

  try {
    const session = await account.createEmailToken(ID.unique(), email);

    return session.userId;
  } catch (error) {
    onError(error, 'Failed to send email verification');
  }
};

export const createAccount = async ({ fullName, email }: RegisterProps) => {
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

export const logout = async () => {
  const { account } = await createSessionClient();
  try {
    await account.deleteSession('current');
    (await cookies()).delete('appwrite-session');
  } catch (error) {
    onError(error, 'Failed to logout');
  } finally {
    redirect('/login');
  }
};

export const login = async ({ email }: { email: string }) => {
  try {
    const existUser = await getUserByEmail(email);

    if (!existUser) {
      return parseStringify({ accountId: null, error: 'User not found' });
    }

    await sendEmailOTP({ email });
    return parseStringify({ accountId: existUser.accountId });
  } catch (error) {
    onError(error, 'Failed to login');
  }
};
