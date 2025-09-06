'use client';
import { ChangeEvent, useRef } from 'react';
import { buttonClasses } from '../helpers/buttons';

function FileSave({
   file,
   setFile,
   classnames,
}: {
   file: File | undefined;
   setFile: (file: File) => void;
   classnames?: string;
}) {
   const textRef = useRef<HTMLTextAreaElement>(null);

   const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
      console.log(e.target);
      if (e.target.files) {
         setFile(e.target.files[0]);
      }
   };

   const handleFileClick = () => {
      console.log(
         textRef?.current?.value
            .replace('\n', '')
            .split("',")
            .map((entry) => entry.replaceAll("'", '').trim())
      );
   };
   const handleUploadClick = () => {
      const fileTypes = ['csv', 'text/csv', 'json'];
      if (!file || !fileTypes.includes(file.type)) {
         return;
      }

      // 👇 Uploading the file using the fetch API to the server
      fetch('https://httpbin.org/post', {
         method: 'POST',
         body: file,
         // 👇 Set headers manually for single file upload
         headers: {
            'content-type': file.type,
            'content-length': `${file.size}`, // 👈 Headers need to be a string
         },
      })
         .then((res) => res.json())
         .then((data) => console.log(data))
         .catch((err) => console.error(err));
   };

   return (
      <div>
         <input type="file" onChange={handleFileChange} />

         <div>{file && `${file.name} - ${file.type}`}</div>

         <button className={buttonClasses} onClick={handleUploadClick}>
            Upload
         </button>
         <textarea className={'text-black'} ref={textRef} />
         <button onClick={handleFileClick}>Submit</button>
      </div>
   );
}

export default FileSave;
