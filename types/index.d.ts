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
