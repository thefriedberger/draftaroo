import Image from 'next/image';

const DraftResults = ({ params }: { params: { id: string } }) => {
   return (
      <>
         {/* <h1 className="dark:text-white my-5">Draft Results</h1> */}
         <Image
            src="https://mfiegmjwkqpipahwvcbz.supabase.co/storage/v1/object/sign/images/94z6kg.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZXMvOTR6NmtnLmpwZyIsImlhdCI6MTcyNzUzMjcyNywiZXhwIjoxNzU5MDY4NzI3fQ.7iyE5cvryvH7ofn2x168f-pujBM1DgiFnsLdXTOPNSg&t=2024-09-28T14%3A12%3A07.366Z"
            alt="Draft Results Meme"
            width={500}
            height={696}
            className="mt-5"
         />
      </>
   );
};
export default DraftResults;
