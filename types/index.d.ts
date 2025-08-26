import { Models } from 'node-appwrite';

export type RegisterProps = {
  fullName: string;
  email: string;
};

export type SidebarProps = {
  avatar: string;
} & RegisterProps;

export type UserProps = {
  $id: string;
  accountId: string;
} & SidebarProps;

export type MobileConditionProps = {
  isMobile?: boolean;
};

export type OTPType = {
  accountId: string;
  passcode: string;
};

export type UploaderProps = {
  ownerId: string;
  accountId: string;
  className?: string;
};

export type UploadingFile = {
  file: File;
  progress: number; // progress tiap file
};

export type ThumbnailProps = {
  type: string;
  ext: string;
  url: string;
  imageClassName?: string;
  className?: string;
};

export type UploadFileProps = {
  file: File;
  path: string;
} & UploaderProps;

export type HoverProps = {
  children: React.ReactElement;
  text?: string;
  asChild?: boolean;
};

export type HeaderProps = {
  userId: string;
  accountId: string;
};

export type ParamsProps = {
  params: {
    type: string;
  };
};

export type FileProps = {
  file: Models.DefaultDocument;
};

export type FileTimeProps = {
  date: string;
  className?: string;
};

export type OptionActionProps = {
  label: string;
  icon: string;
  value: string;
};

export type CustomButtonProps = {
  type?: 'button' | 'submit' | 'reset';
  isLoading: boolean;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
};

export type RenameFileProps = {
  fileId: string;
  name: string;
  ext: string;
  path: string;
};

export type DetailProps = {
  label: string;
  value: string;
};

export type ShareProps = {
  setInputShareValue: React.Dispatch<React.SetStateAction<string>>;
  onRemove: (email: string) => void;
  isLoading: booelan;
  errorMsg?: string;
} & FileProps;

export type UpdateSharedFileProps = {
  fileId: string;
  email: string;
  path: string;
  mode: 'share' | 'unshare';
};
