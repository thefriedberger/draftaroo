const fs = require('fs');

const getProspects = async () => {
   const drafts = ['2022', '2023'];
   const prospectIDs = [];
   for (const draft of drafts) {
      const response = await fetch(
         `https://statsapi.web.nhl.com/api/v1/draft/${draft}`
      );
      const draftResults = await response.json();
      draftResults.drafts[0]?.rounds[0]?.picks.forEach((pick) => {
         prospectIDs.push(pick.prospect.id);
      });
   }

   const output = [];
   for (const prospectID of prospectIDs) {
      const response = await fetch(
         `https://statsapi.web.nhl.com/api/v1/draft/prospects/${prospectID}`
      );
      const prospect = await response.json();

      const { nhlPlayerId } = prospect.prospects[0];

      if (nhlPlayerId !== undefined) {
         const nhlPlayer = await fetch(
            `https://statsapi.web.nhl.com/api/v1/people/${nhlPlayerId}`
         );
         const player = await nhlPlayer.json();

         const { id, firstName, lastName, primaryNumber, currentTeam } =
            player.people[0];

         const { code, name, type } = player.people[0].primaryPosition;

         output.push({
            id: id,
            firstName: firstName,
            lastName: lastName,
            primaryNumber: primaryNumber,
            currentTeam: currentTeam.name,
            primaryPosition: name,
         });
      }
   }
   fs.writeFileSync('prospects.json', JSON.stringify(output));
};

getProspects();
