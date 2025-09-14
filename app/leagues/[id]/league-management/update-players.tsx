'use client';

const UpdatePlayersButton = () => {
   return (
      <button
         onClick={async () =>
            await fetch('/update-players', { method: 'POST' })
         }
      >
         Update players
      </button>
   );
};

export default UpdatePlayersButton;
