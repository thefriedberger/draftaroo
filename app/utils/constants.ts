export type SupabaseStorageType = {
   [key: string]: string;
};

export type SupabaseStorage = Record<keyof SupabaseStorageType, string>[];

export const supabaseStorage: { [key: string]: string }[] = [
   {
      ['Chime']:
         'https://mfiegmjwkqpipahwvcbz.supabase.co/storage/v1/object/sign/audio/draft-chime.mp3?token=eyJraWQiOiIyZGVkMDgwYy01YTM0LTQzYTYtOTI5Ny0wZTgzMmNkNjhiZjkiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhdWRpby9kcmFmdC1jaGltZS5tcDMiLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzg3NzkxNDY5LCJleHAiOjMzNjQ1OTE0Njl9.424yKPaw5-rlmZnExztUzGZV9JDjomJrAGj65oT1irM',
      ['Results']:
         'https://mfiegmjwkqpipahwvcbz.supabase.co/storage/v1/object/sign/images/94z6kg.jpg?token=eyJraWQiOiIyZGVkMDgwYy01YTM0LTQzYTYtOTI5Ny0wZTgzMmNkNjhiZjkiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWFnZXMvOTR6NmtnLmpwZyIsInNjb3BlIjoiZG93bmxvYWQiLCJpYXQiOjE3ODc3OTM1MTAsImV4cCI6MzM2NDU5MzUxMH0.2QBcCJQQ5V1vpTscH_IFPDyS6LqSlhp2jBUBPWyddWk',
      ['PartyTime']:
         'https://mfiegmjwkqpipahwvcbz.supabase.co/storage/v1/object/sign/audio/sandstorm.mp3?token=eyJraWQiOiIyZGVkMDgwYy01YTM0LTQzYTYtOTI5Ny0wZTgzMmNkNjhiZjkiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhdWRpby9zYW5kc3Rvcm0ubXAzIiwic2NvcGUiOiJkb3dubG9hZCIsImlhdCI6MTc4Nzc5MTYxMCwiZXhwIjozMzY0NTkxNjEwfQ.zr_Z5ab4U_x3AUCj98ZvMdFsGCwRH7SZJOQlmQ-MBOo',
   },
];

export const tileColorMap: Record<
   'F' | 'C' | 'L' | 'R' | 'D' | 'G',
   Record<'background' | 'text', any>
> = {
   F: { background: '!bg-blue-300', text: '!text-black' },
   C: { background: '!bg-blue-300', text: '!text-black' },
   L: { background: '!bg-blue-300', text: '!text-black' },
   R: { background: '!bg-blue-300', text: '!text-black' },
   D: { background: '!bg-orange-300', text: '!text-black' },
   G: { background: '!bg-green-300', text: '!text-black' },
};

export const gridMap = {
   2: 'grid-cols-2',
   3: 'grid-cols-3',
   4: 'grid-cols-4',
   5: 'grid-cols-5',
   6: 'grid-cols-6',
   7: 'grid-cols-7',
   8: 'grid-cols-8',
   9: 'grid-cols-9',
   10: 'grid-cols-10',
   11: 'grid-cols-11',
   12: 'grid-cols-12',
};
