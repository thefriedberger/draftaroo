'use client';

const AddDOBButton = () => {
   return (
      <button onClick={async () => await fetch('/add-dob', { method: 'POST' })}>
         Add DoB
      </button>
   );
};

export default AddDOBButton;
