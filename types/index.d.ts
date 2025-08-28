import { Models } from 'node-appwrite';

declare type FileType = 'document' | 'image' | 'video' | 'audio' | 'other';

declare type RegisterProps = {
  fullName: string;
  email: string;
};

declare type SidebarProps = {
  avatar: string;
} & RegisterProps;

declare type UserProps = {
  $id: string;
  accountId: string;
} & SidebarProps;

declare type MobileConditionProps = {
  isMobile?: boolean;
};

declare type OTPType = {
  accountId: string;
  passcode: string;
};

declare type UploaderProps = {
  ownerId: string;
  accountId: string;
  className?: string;
};

declare type UploadingFile = {
  file: File;
  progress: number; // progress tiap file
};

declare type ThumbnailProps = {
  type: string;
  ext: string;
  url: string;
  imageClassName?: string;
  className?: string;
};

declare type UploadFileProps = {
  file: File;
  path: string;
} & UploaderProps;

declare type HoverProps = {
  children: React.ReactElement;
  text?: string;
  asChild?: boolean;
};

declare type HeaderProps = {
  userId: string;
  accountId: string;
};

declare type SearchParamProps = {
  params: Promise<{ type: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

declare type GetFilesProps = {
  types: FileType[];
  searchText?: string;
  sortType?: string;
  limit?: number;
};

declare type FileProps = {
  file: Models.DefaultDocument;
};

declare type FileTimeProps = {
  date: string;
  className?: string;
};

declare type OptionActionProps = {
  label: string;
  icon: string;
  value: string;
};

declare type CustomButtonProps = {
  type?: 'button' | 'submit' | 'reset';
  isLoading: boolean;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
};

declare type RenameFileProps = {
  fileId: string;
  name: string;
  ext: string;
  path: string;
};

declare type DetailProps = {
  label: string;
  value: string;
};

declare type ShareProps = {
  setInputShareValue: React.Dispatch<React.SetStateAction<string>>;
  onRemove: (email: string) => void;
  isLoading: booelan;
  errorMsg?: string;
} & FileProps;

declare type UpdateSharedFileProps = {
  fileId: string;
  email: string;
  path: string;
  mode: 'share' | 'unshare';
};

declare type DeleteFileProps = {
  fileId: string;
  bucketFileId: string;
  path: string;
};
