import Card from '@/components/Card';
import Sort from '@/components/Sort';
import { getFiles } from '@/lib/actions/file.action';
import { getFileTypesParams } from '@/lib/utils';
import { FileType, SearchParamProps } from '@/types';
import { Models } from 'node-appwrite';

const Page = async ({ params, searchParams }: SearchParamProps) => {
  const pageTitle = ((await params)?.type as string) || '';
  const searchText = ((await searchParams)?.query as string) || '';
  const sortType = ((await searchParams)?.sort as string) || '';

  const types = getFileTypesParams(pageTitle) as FileType[];
  const files = (await getFiles({ types, searchText, sortType })) ?? [];

  return (
    <div className='page-container'>
      {/* <div>{JSON.stringify({ files })}</div> */}
      <section className='w-full'>
        <h1 className='h1 capitalize'>{pageTitle}</h1>
        <div className='total-size-section'>
          <p className='body-1'>
            Total: <span className='h5 text-brand'>0MB</span>
          </p>
          <div className='sort-container'>
            <p className='text-light-200 body-1 hidden sm:block'>Sort by:</p>
            <Sort />
          </div>
        </div>
      </section>

      {files?.total > 0 ? (
        <section className='file-list'>
          {files.documents.map((file: Models.DefaultDocument) => (
            <Card key={file.$id} file={file} />
          ))}
        </section>
      ) : (
        <p className='empty-list'>Belum ada file yg diunggah</p>
      )}
    </div>
  );
};

export default Page;
