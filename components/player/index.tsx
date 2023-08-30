const Player = ({player}: any, {leagueScoring}: any) => {

    const getStatFromLastSeason = (player_stats: any, stat: string) => {
        if (!player_stats) {
            return 0
        }

        if (!player_stats[1]["stats"]) {
            return 0
        } 

        if (!player_stats[1]["stats"][stat]) {
            return 0
        }

        return player_stats[1]["stats"][stat]

    }

    const calculatePoints = (player_stats: any) => {
    }

    const calculateAvgPoints = (player_stats: any) => {
        
    }

    const getAverageTimeOnIce = (player_stats: any) => {
        const games = getStatFromLastSeason(player_stats, "games")
        const timeOnIce = getStatFromLastSeason(player_stats, "timeOnIce")

        if (games === 0) {
            return 0
        }

        return Math.floor(timeOnIce.split(":")[0] / games)
    }
    

    return (
        <div key={player.id} className="flex-row flex-grow justify-start">
            <span className="m-2 flex-grow">{player.first_name} {player.last_name}</span>
            <span className="m-2 flex-grow">{player.current_team}</span>
            <span className="m-2 flex-grow">{player.primary_position}</span>
            <span className="m-2 flex-grow">{getStatFromLastSeason(player.stats, "games")}</span>
            <span className="m-2 flex-grow">{getAverageTimeOnIce(player.stats)}</span>
            <span className="m-2 flex-grow">0</span>
            <span className="m-2 flex-grow">0</span>
            <span className="m-2 flex-grow">{getStatFromLastSeason(player.stats, "goals")}</span>
            <span className="m-2 flex-grow">{getStatFromLastSeason(player.stats, "assists")}</span>
            <span className="m-2 flex-grow">{getStatFromLastSeason(player.stats, "plusMinus")}</span>
            <span className="m-2 flex-grow">{getStatFromLastSeason(player.stats, "shots")}</span>
            <span className="m-2 flex-grow">{getStatFromLastSeason(player.stats, "hits")}</span>
            <span className="m-2 flex-grows">{getStatFromLastSeason(player.stats, "blocked")}</span>
            <span className="m-2 flex-grows">{getStatFromLastSeason(player.stats, "pim")}</span>
        </div>
    )
}

export default Player;