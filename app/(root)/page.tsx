import { getFiles } from '@/lib/actions/file.action';
import { getUsageSummary } from '@/lib/utils';

export default async function Home() {
  // const [files, totalSpace] = await Promise.all([
  //   getFiles({ types: [], limit: 10 }),
  //   getTotalSpaceUsed(),
  // ]);

  // const usedSummary = getUsageSummary(totalSpace);
  return (
    <div className='dashboard-container'>
      <section></section>
    </div>
  );
}
