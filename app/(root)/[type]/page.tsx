import Sort from '@/components/Sort';
import { ParamsProps } from '@/types';

const Page = async ({ params }: ParamsProps) => {
  const type = (await params)?.type || '';
  return (
    <div className='page-container'>
      <section className='w-full'>
        <h1 className='h1 capitalize'>{type}</h1>
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
    </div>
  );
};

export default Page;
