import { cn, formatDateTime } from '@/lib/utils';
import { FileTimeProps } from '@/types';
import React from 'react';

const FileTime = ({ date, className }: FileTimeProps) => {
  return <p className={cn(' text-light-200', className)}>{formatDateTime(date)}</p>;
};

export default FileTime;
