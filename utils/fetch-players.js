const fs = require("fs");

const fetchPlayers = async () => {
    const teamsReq = await fetch("https://statsapi.web.nhl.com/api/v1/teams");
    const teamsData = await teamsReq.json();
    const teamIds = [];
    for (const teamData of teamsData.teams) {
        teamIds.push(teamData.id);
    }
    const playerIDs = [];
    for (const teamId of teamIds) {
        let response = await fetch(
            `https://statsapi.web.nhl.com/api/v1/teams/${teamId}?expand=team.roster`
        );
        const team = await response.json();

        const roster = team.teams[0]?.roster?.roster;

        if (roster)
            roster.forEach((player) => {
                playerIDs.push(player.person.id);
            });
    }

    const players = [];
    for (const playerID of playerIDs) {
        const player = await fetch(
            `https://statsapi.web.nhl.com/api/v1/people/${playerID}`
        );
        const season1 = await fetch(
            `https://statsapi.web.nhl.com/api/v1/people/${playerID}/stats?stats=statsSingleSeason&season=20222023`
        );
        const season2 = await fetch(
            `https://statsapi.web.nhl.com/api/v1/people/${playerID}/stats?stats=statsSingleSeason&season=20212022`
        );
        const season1Stats = await season1.json();
        const season2Stats = await season2.json();
        const seasonYear1 = season1Stats.stats[0]?.splits[0]?.season;
        const seasonYear2 = season2Stats.stats[0]?.splits[0]?.season;
        const stats1 = season1Stats.stats[0]?.splits[0]?.stat;
        const stats2 = season2Stats.stats[0]?.splits[0]?.stat;

        const playerInfo = await player.json();

        const { id, firstName, lastName, currentTeam } = playerInfo.people[0];

        const { name } = playerInfo.people[0].primaryPosition;

        players.push({
            id: id,
            firstName: firstName,
            lastName: lastName,
            currentTeam: currentTeam.name,
            primaryPosition: name,
            stats: [
                {
                    season: seasonYear2,
                    stats: stats2,
                },
                {
                    season: seasonYear1,
                    stats: stats1,
                },
            ],
        });
    }
    fs.writeFileSync("players.json", JSON.stringify(players));
};

fetchPlayers();
