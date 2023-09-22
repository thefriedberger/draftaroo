// 'use client';

// import { PageContext } from '@/components/context/page-context';
// import { createClient } from '@supabase/supabase-js';
// import { useRouter } from 'next/navigation';
// import { ChangeEvent, useContext, useState } from 'react';

// const SetPassword = () => {
//    const supabase = createClient(
//       String(process.env.NEXT_PUBLIC_SUPABASE_URL),
//       String(process.env.NEXT_PUBLIC_SERVICE_ROLE_KEY),
//       {
//          auth: {
//             autoRefreshToken: false,
//             persistSession: false,
//          },
//       }
//    );
//    // Access auth admin api
//    const adminAuthClient = supabase.auth.admin;
//    const [password, setPassword] = useState<string>('');
//    const [verifyPassword, setVerifyPassword] = useState('');
//    const [passwordsMatch, setPasswordsMatch] = useState(true);
//    const router = useRouter();
//    const {
//       user,
//       updateUser,
//       updateSession,
//       fetchLeagues,
//       fetchTeam,
//       fetchTeams,
//    } = useContext(PageContext);

//    const checkPassword = (e: ChangeEvent<HTMLInputElement>) => {
//       if (e?.target?.value === password) {
//          setPasswordsMatch(true);
//       } else {
//          setPasswordsMatch(false);
//       }
//    };

//    const handleUpdatePassword = async () => {
//       const leagueID = new URL(location.href).searchParams.get('leagueID');
//       if (user) {
//          const email = String(user.email);
//          await adminAuthClient.updateUserById(user.id, {
//             password: password,
//          });
//          const { data } = await supabase.auth.signInWithPassword({
//             email,
//             password,
//          });
//          //   data.user && updateUser?.(data.user);
//          //   data.session && updateSession?.(data.session);

//          setTimeout(() => {
//             router.push(`${location.origin}/leagues/${leagueID}`);
//          }, 500);
//       }
//    };
//    return (
//       <>
//          {user && (
//             <>
//                <div className="flex flex-col">
//                   <label htmlFor={'password'}>Set your password:</label>
//                   <input
//                      className="rounded-md px-4 py-2 dark:text-white bg-inherit border mb-3"
//                      type="password"
//                      name="password"
//                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
//                         setPassword(e.target.value);
//                         checkPassword(e);
//                      }}
//                      value={password}
//                      placeholder="••••••••"
//                   />
//                   <label className="text-md" htmlFor="verify-password">
//                      Verify Password
//                   </label>
//                   <input
//                      className={`rounded-md px-4 py-2 dark:text-white bg-inherit border ${
//                         !passwordsMatch ? 'mb-0' : 'mb-3'
//                      }`}
//                      type="password"
//                      name="verify-password"
//                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
//                         setVerifyPassword(e.target.value);
//                         checkPassword(e);
//                      }}
//                      value={verifyPassword}
//                      placeholder="••••••••"
//                   />
//                   {!passwordsMatch && (
//                      <p className="text-red-700 mb-3">Passwords must match</p>
//                   )}

//                   <button
//                      type="submit"
//                      className="bg-white disabled:opacity-50 disabled:cursor-not-allowed text-black rounded-md p-1 mt-2"
//                      disabled={!passwordsMatch}
//                      onClick={handleUpdatePassword}
//                   >
//                      Submit
//                   </button>
//                </div>
//             </>
//          )}
//       </>
//    );
// };

// export default SetPassword;
