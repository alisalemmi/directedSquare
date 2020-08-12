import Axios from 'axios';
import { default as config } from '../../config.json';

const parseSchema = schema => {
  return {
    GameId: schema.GameCode,
    playerId: schema.GUserId_FK,
    playerName: schema.GUserFName + ' ' + schema.GUserLName,
    maxScore: schema.GamePlayScore,
    rankScore: schema.GamePlayRank
  };
};

export const getInfo = async () => {
  const res = await Axios.get('/getplayedinfo', {
    params: {
      GamePlayCode: config.serverInfo.GameId.trim(),
      GUserId: config.serverInfo.playerId
    },
    baseURL: 'https://ebgamesrc.estedadbartar.com/api/figa/game'
  });
  return res.data;
};

config.serverInfo = {
  ...parseSchema(JSON.parse(localStorage.getItem('GameInfo')))
};

(async () => console.log(await getInfo()))();
