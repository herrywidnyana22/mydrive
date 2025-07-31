export type SidebarProps = {
  fullName: string;
  avatar: string;
  email: string;
};

export type UserProps = {
  ownerId: string;
  accountId: string;
} & SidebarProps;

export type MobileConditionProps = {
  isMobile?: boolean;
};
