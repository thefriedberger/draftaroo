'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Player from '../player';

const PlayerList = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [players, setPlayers] = useState<any>([]);
    const [leagueScoring, setLeagueScoring] = useState<any>();
    const [sort, setSort] = useState<string>("");
    const [positionFilter, setPositionFilter] = useState<string>("");
    const [teamFilter, setTeamFilter] = useState<string>("");
    const [playerSearch, setPlayerSearch] = useState<string>("");
    const supabase = createClientComponentClient<Database>();

    const teams = ["", "Arizona Coyotes", "Anaheim Ducks", "Boston Bruins", "Buffalo Sabres", "Calgary Flames", "Carolina Hurricanes",
                   "Colorado Avalanche", "Columbus Blue Jackets", "Dallas Stars", "Detroit Red Wings", "Edmonton Oilers",
                   "Florida Panthers", "Los Angeles Kings", "Minnesota Wild", "Montréal Canadiens", "Nashville Predators",
                   "New Jersey Devils", "New York Islanders", "New York Rangers", "Ottawa Senators", "Philadelphia Flyers",
                   "Pittsburgh Penguins", "San Jose Sharks", "Seattle Kraken", "St. Louis Blues", "Tampa Bay Lightning", 
                   "Tornto Maple Leafs", "Vancouver Canucks", "Vegas Golden Knights", "Washington Capitals", "Winnipeg Jets"
                  ]
    const positions = ["", "Center", "Left Wing", "Defenseman", "Goalie"]

    useEffect(() => {
        const fetchPlayers = async () => {
          const { data } = await supabase.from('players').select()
          setPlayers(data)
          setIsLoading(false)
        }

        const fetchScoring = async () => {
            const { data } = await supabase.from('league_scoring').select().eq('id', 'ad9eafad-045d-440b-a56c-d09f9fd9ead7')
            setLeagueScoring(data)
        }
    
        fetchPlayers()
        fetchScoring()
      }, [supabase])
    
    const filterPlayers = () => {
        const playersByPostion = players.filter((player: Player) => {
            if (positionFilter != "") {
                return player.primary_position === positionFilter
            } else {
                return true
            }
        })

        const playersByTeam = playersByPostion.filter((player: Player) => {
            if (teamFilter != "") {
                return player.current_team === teamFilter
            } else {
                return true
            }
        })

        const playersSearched = playersByTeam.filter((player: Player) => {
            if (playerSearch != "") {
                const fullName = player.first_name + " " + player.last_name
                return fullName.toLowerCase().includes(playerSearch.toLowerCase())
            } else {
                return true
            }
        })

        if (sort != "") {
            return sortPlayers(playersSearched)
        } else {
            return playersSearched
        }
    }

    const sortPlayers = (players: Player[]) => {
        players.sort((a: Player, b: Player) => {
            const statForA = getStatFromLastSeason(a.stats, sort)
            const statForB = getStatFromLastSeason(b.stats, sort)
            return statForB - statForA
        })

        return players
    }

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

    return (
        <>
            {!isLoading && 
            <div>
                <Filter values={positions} filterFun={setPositionFilter}/>
                <Filter values={teams} filterFun={setTeamFilter}/>
                <input
                    type="text"
                    value={ playerSearch }
                    onChange={ e => setPlayerSearch(e.target.value) } 
                />
                <div className='flex flex-col justify-start'>
                    <div className='justify-start'>
                        <span className='m-2' onClick={e => setSort("")}>Name</span>
                        <span className='m-2' onClick={e => setSort("")}>Team</span>
                        <span className='m-2' onClick={e => setSort("")}>Position</span>
                        <span className='m-2' onClick={e => setSort("")}>Games Played</span>
                        <span className='m-2' onClick={e => setSort("")}>ATOI</span>
                        <span className='m-2' onClick={e => setSort("")}>Points</span>
                        <span className='m-2' onClick={e => setSort("")}>AVG Points</span>
                        <span className='m-2' onClick={e => setSort("goals")}>Goals</span>
                        <span className='m-2' onClick={e => setSort("assists")}>Assists</span>
                        <span className='m-2' onClick={e => setSort("plusMinus")}>Plus/Minus</span>
                        <span className='m-2' onClick={e => setSort("shots")}>Shots</span>
                        <span className='m-2' onClick={e => setSort("hits")}>Hits</span>
                        <span className='m-2' onClick={e => setSort("blocked")}>Blocks</span>
                        <span className='m-2' onClick={e => setSort("pim")}>Pims</span>
                    </div>
                    {filterPlayers().map((player: Player) => {
                        return (
                            <Player key={player.id} player={player} leagueScoring={leagueScoring} />
                        )
                    })}
                </div>
            </div>
            }
        </>
    )    

}

const Filter = ({values, filterFun}: any) => {
    return (
        <select onChange={ e =>  filterFun(e.target.value)} className='text-black m-8'>
            {
                values.map((x:any) => {
                    return <option key={x} value={x}>{x}</option>
                })
            }
        </select>
    )
}

export default PlayerList;