import Card from '@/components/Card';
import ListView from '@/components/ListView';
import Sort from '@/components/Sort';
import ToggleViewButton from '@/components/ToggleViewMode';
import { getFiles } from '@/lib/actions/file.action';
import { cn, getFileTypesParams } from '@/lib/utils';
import { FileType, SearchParamProps } from '@/types';
import { Models } from 'node-appwrite';

const Page = async ({ params, searchParams }: SearchParamProps) => {
  const pageTitle = ((await params)?.type as string) || '';
  const searchText = ((await searchParams)?.query as string) || '';
  const sortType = ((await searchParams)?.sort as string) || '';
  const viewMode = ((await searchParams)?.view as 'list') || 'card';

  const types = getFileTypesParams(pageTitle) as FileType[];
  const files = (await getFiles({ types, searchText, sortType })) ?? [];

  return (
    <div className='page-container'>
      <section className='w-full'>
        <h1 className='h1 capitalize'>{pageTitle}</h1>
        <div className='flex items-center justify-between'>
          <p className='body-1'>
            Total: <span className='h5 text-brand'>0MB</span>
          </p>
          <div className='sort-container flex gap-2'>
            <Sort />
            <ToggleViewButton />
          </div>
        </div>
      </section>
      {files?.total > 0 ? (
        <section
          className={cn(viewMode === 'list' ? 'w-full flex-col gap-2' : 'file-list')}
        >
          {viewMode === 'list' ? (
            <div className='w-full overflow-hidden rounded-lg'>
              {/* Header */}
              <div className='grid grid-cols-4 gap-2 px-4 py-2 border-b text-center bg-gray-100 text-xs font-semibold text-gray-600'>
                <span className='col-span-1'>Name</span>
                <span className='col-span-1'>Type</span>
                <span className='col-span-1'>Size</span>
                <span className='col-span-1'>Date Modified</span>
              </div>
              {files.documents.map((file: Models.DefaultDocument) => (
                <ListView key={file.$id} file={file} pageTitle={pageTitle} />
              ))}
            </div>
          ) : (
            files.documents.map((file: Models.DefaultDocument) => (
              <Card key={file.$id} file={file} pageTitle={pageTitle} />
            ))
          )}
        </section>
      ) : (
        <p className='empty-list'>Belum ada file yg diunggah</p>
      )}
    </div>
  );
};

export default Page;
