'use server';
import { redirect } from 'next/navigation';
export const draftRedirect = async ({
   params,
}: {
   params: { id: string; draftId: string };
}) => {
   redirect(`/leagues/${params.id}/draft-results/${params.draftId}`);
};
