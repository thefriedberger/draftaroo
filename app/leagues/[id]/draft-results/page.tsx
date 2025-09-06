import { fetchDrafts } from '@/app/utils/helpers';
import { createClient } from '@/app/utils/supabase/server';
import Callout from '@/components/ui/callout';

const DraftResultsHubPage = async ({ params }: { params: { id: string } }) => {
   const supabase = createClient();

   const drafts: Awaited<Draft[]> = await fetchDrafts(supabase, params.id);

   const leagueDrafts = drafts.filter(
      (draft: Draft) => draft.league_id === params.id
   );
   const draftLinks = leagueDrafts
      .map((draft: Draft) =>
         draft.is_completed
            ? {
                 href: `/leagues/${params.id}/draft-results/${draft.id}`,
                 text: `Draft results - ${draft.draft_year}`,
              }
            : {
                 href: '',
                 text: '',
              }
      )
      .filter((link) => link?.href && link?.text);
   return (
      <div className="flex-[25%] mx-5 text-white text-center">
         <Callout
            {...{
               calloutText: `Previous Drafts`,
               links: draftLinks,
               classes: 'mx-auto',
            }}
         />
      </div>
   );
};
export default DraftResultsHubPage;
