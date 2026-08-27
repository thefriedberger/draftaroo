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
