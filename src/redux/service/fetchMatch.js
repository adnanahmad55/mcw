import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const fetchMatch = createApi({
  reducerPath: 'fetchMatch',
  baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_APP_API_BASE_URL_SPORT}` }),
  endpoints: (builder) => ({
    tournamentsList: builder.mutation({
      query: ({ sports_id, type }) => ({
        url: 'spb/tournaments',
        method: 'POST',
        body: {
          sports_id: sports_id,
          type: type,
          operator_id: import.meta.env.VITE_APP_OPERATOR_ID || '',
        },
      }),
    }),

    matchScorecard: builder.mutation({
      query: ({ match_id, sportsName }) => ({
        url: 'spb/fetch-normal-scorecard',
        method: 'POST',
        body: {
          groupById: match_id,
          sportsName: sportsName,
        },
      }),
    }),

    matchMarket: builder.mutation({
      query: ({ match_id }) => ({
        url: 'spb/markets',
        method: 'POST',
        body: {
          match_id: match_id,
        },
      }),
    }),

    matchOdd: builder.mutation({
      query: ({ marketIds, eventIds }) => ({
        url: `spb/match-odds?marketId=${marketIds}&multi=true&eventIds=${eventIds}`,
        method: 'GET',

      }),
    }),

    matchBetPlace: builder.mutation({
      query: ({ playerId, oprId, uniqueId, matchId, marketId, runnerID, stakeValue, betPrice, betType }) => ({
        url: `spb/place-bet`,
        method: 'POST',
        body: {
          operator_id: oprId,
          bet_id: uniqueId,
          player_id: JSON.parse(localStorage.getItem('initiatePlayerId')),
          match_id: matchId,
          market_id: marketId || '',
          runner_id: runnerID,
          stake: Number(stakeValue) || '',
          price: Number(betPrice) || '',
          bet_time: new Date().toISOString(),
          type: betType || ''
        },
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('session_token'))}`
        }

      }),
    }),

    matchScoreBoard: builder.mutation({
      query: ({ groupById, sportsName }) => ({
        url: 'spb/fetch-adv-scorecard',
        method: 'POST',
        body: {
          groupById: groupById,
          sportsName: sportsName
        },
      }),
    }),

    matchScoreLiveStream: builder.mutation({
      query: ({ match_id, sportsName }) => ({
        url: 'spb/fetch-live-stream',
        method: 'POST',
        body: {
          match_id: match_id,
          sportsName: sportsName
        },
      }),
    }),

    matchBetHistory: builder.mutation({
      query: ({  }) => ({
        url: 'spb/fetch-bets',
        method: 'POST',
        body: {
          operator_id: JSON.parse(localStorage.getItem('oprId')),
          player_id: JSON.parse(localStorage.getItem('initiatePlayerId'))
        },
      }),
    }),

    matchAdvScorecard: builder.mutation({
      query: ({ match_id, sportsName }) => ({
        url: 'spb/fetch-adv-scorecard',
        method: 'POST',
        body: {
          groupById: match_id,
          sportsName: sportsName
        },
      }),
    }),

    matchAllLeagues: builder.mutation({
      query: ({ sports_id }) => ({
        url: 'spb/all-leagues',
        method: 'POST',
        body: {
          operator_id: import.meta.env.VITE_APP_OPERATOR_ID || '',
          sports_id: sports_id,
        },
      }),
    }),

    matchAllMatches: builder.mutation({
      query: ({ sports_id, tournament_id }) => ({
        url: 'spb/all-matches',
        method: 'POST',
        body: {
          operator_id: import.meta.env.VITE_APP_OPERATOR_ID || '',
          sports_id: sports_id,
          tournament_id: tournament_id,
        },
      }),
    }),

  }),
});


export const { useTournamentsListMutation, useMatchScorecardMutation, useMatchMarketMutation, useMatchOddMutation, useMatchBetPlaceMutation, useMatchScoreBoardMutation, useMatchScoreLiveStreamMutation, useMatchBetHistoryMutation, useMatchAdvScorecardMutation, useMatchAllLeaguesMutation, useMatchAllMatchesMutation  } = fetchMatch;
