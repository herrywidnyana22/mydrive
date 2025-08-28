'use client';

import Image from 'next/image';
import { Input } from './ui/input';
import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { getFiles } from '@/lib/actions/file.action';
import { Models } from 'node-appwrite';
import Thumbnail from './Thumbnail';
import { constructFileUrl } from '@/lib/utils';
import FileTime from './FileTime';
import { useDebounce } from 'use-debounce';
import { Separator } from './ui/separator';

const Search = () => {
  const [searchText, setSearchText] = useState('');
  const [fileSearch, setFileSearch] = useState<Models.DefaultDocument | []>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const [debounceText] = useDebounce(searchText, 1000);

  const searchURL = useSearchParams();
  const searchQuery = searchURL.get('query') || '';

  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    if (!isActive) {
      setIsOpen(false);
      setIsLoading(false);

      return;
    }

    const getFile = async () => {
      setIsLoading(true);
      if (debounceText.length === 0) {
        setFileSearch([]);
        setIsOpen(false);
        setIsLoading(false);

        return router.push(pathName.replace(searchURL.toString(), ''));
      }

      const files = await getFiles({ types: [], searchText: debounceText });

      setFileSearch(files.documents);
      setIsOpen(true);
      setIsLoading(false);
    };

    getFile();
  }, [debounceText, searchURL, pathName, router, isActive]);

  useEffect(() => {
    if (!searchQuery) {
      setSearchText('');
    }
  }, [searchQuery]);

  const onClickItem = (file: Models.DefaultDocument) => {
    setIsOpen(false);
    setFileSearch([]);

    router.push(
      `/${file.type === 'video' || file.type === 'audio' ? 'media' : file.type + 's'}?query=${searchText}`
    );
  };

  return (
    <div className='search'>
      <div className='search-input-wrapper justify-between'>
        <div className='flex gap-4'>
          <Image
            src={'/assets/icons/search.svg'}
            alt='search-icon'
            height={24}
            width={24}
          />
          <Input
            value={searchText}
            placeholder='Cari file...'
            className='search-input'
            onChange={e => setSearchText(e.target.value)}
            onBlur={() => setIsActive(false)}
            onClick={() => setIsActive(true)}
          />
        </div>
        {isLoading && (
          <Image
            src={'assets/icons/loader-brand.svg'}
            alt='loading-icon'
            height={20}
            width={20}
            className='animate-spin'
          />
        )}

        {isOpen && (
          <div className='search-result'>
            <p className='subtitle-2'>Hasil pencarian...</p>
            <Separator />
            <ul>
              {fileSearch.length > 0 ? (
                fileSearch.map((file: Models.DefaultDocument, i: number) => (
                  <li
                    key={`${file.$id}-${i}`}
                    onClick={() => onClickItem(file)}
                    className='flex items-center justify-between hover:bg-accent hover:rounded-xl px-2 py-1'
                  >
                    <div className='flex gap-2 items-center'>
                      <Thumbnail
                        type={file.type}
                        ext={file.extension}
                        url={constructFileUrl(file.bucketFileId)}
                        className='size-9 min-w-9'
                      />
                      <div className='flex-row items-center gap-2'>
                        <p className='line-clamp-1 text-light-100 subtitle-2'>
                          {file.name}
                        </p>
                        <p className='caption line-clamp-1 text-light-200'>
                          {file.owner.fullName}
                        </p>
                      </div>
                    </div>
                    <FileTime
                      date={file.$createdAt}
                      className='caption line-clamp-1 text-light-200'
                    />
                  </li>
                ))
              ) : (
                <p className='body-2 text-center text-light-100'>File tidak ditemukan</p>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
