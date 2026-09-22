'use client';

const AddGamelogsButton = () => {
   return (
      <button
         onClick={async () => await fetch('/add-gamelogs', { method: 'POST' })}
      >
         Add Gamelogs
      </button>
   );
};

export default AddGamelogsButton;
