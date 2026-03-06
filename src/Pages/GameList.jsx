import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useSearchParams } from 'react-router-dom';
import Category from '../component/Category';
import GameSection from '../component/GameSection';
import { setCategory } from '../redux/slice/gameSlice';
import { hotGames, pgGames, slotGames, liveGames, crashGames, fishGame, liveCasinoGame, sportsGames } from "../data/games";
import { jiliGames } from '../data/jiliGames';
import { pgSoftGames } from '../data/pgSoftGames';

export default function GameList() {
    const dispatch = useDispatch();
    const location = useLocation()
    const isGameList = location.pathname.includes('/game-list')
    const { selectedCategory } = useSelector((state) => state.game);
    const [searchParams] = useSearchParams();

    // On component mount, check for category in query param
    useEffect(() => {
        const categoryParam = searchParams.get('category');
        if (categoryParam) {
            dispatch(setCategory(categoryParam));
        }
    }, [searchParams, dispatch]);

    const gameSections = [
        {
            key: "Hot Games",
            title: "Hot Games",
            games: hotGames,
            slideItem: 7,
            mobileViewGame: 4,
            sliceGame: ''
        },
        {
            key: "JILI Slots",
            title: "JILI Slots",
            games: jiliGames,
            slideItem: 7,
            mobileViewGame: 4,
            sliceGame: ''
        },
        {
            key: "PG Slots",
            title: "PG Slots",
            games: pgSoftGames,
            slideItem: 7,
            mobileViewGame: 4,
            sliceGame: ''
        },
        {
            key: "Slots",
            title: "Slots",
            games: jiliGames,
            slideItem: 3,
            mobileViewGame: 3,
            sliceGame: ''
        },
        {
            key: "Crash",
            title: "Crash",
            games: crashGames,
            slideItem: 3,
            mobileViewGame: 4,
            sliceGame: 8
        },
        {
            key: "Live",
            title: "Live Casino",
            games: liveCasinoGame,
            slideItem: 7,
            mobileViewGame: 3,
            sliceGame: 9
        },
        {
            key: "Table",
            title: "Table",
            games: liveCasinoGame,
            slideItem: 7,
            mobileViewGame: 4,
            sliceGame: ''
        },
        {
            key: "Fish",
            title: "Fish",
            games: fishGame,
            slideItem: 7,
            mobileViewGame: 4,
            sliceGame: 8
        },
        {
            key: "Sports",
            title: "Sports",
            games: sportsGames,
            slideItem: 1,
            mobileViewGame: 1,
            sliceGame: ''
        },
        {
            key: "Arcade",
            title: "Arcade",
            games: sportsGames,
            slideItem: 1,
            mobileViewGame: 1,
            sliceGame: ''
        }
    ];

    return (
        <div className='w-full bg-[#131b30] py-2'>
            {!isGameList && 
                <Category />
            }
            {gameSections.map(({ key, title, games, slideItem, mobileViewGame, sliceGame }) =>
                (selectedCategory === key) && (
                    <>
                        <GameSection
                            key={key}
                            title={title}
                            games={games}
                            slideItem={slideItem}
                            mobileViewGame={mobileViewGame}
                            sliceGame={sliceGame}
                        />
                    </>
                )
            )}
        </div>
    );
}