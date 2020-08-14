import Axios from 'axios';
import { default as config } from '../../config.json';

const parseSchema = schema => {
  if (schema == null)
    schema = {
      GUserBCIP: '4323504295',
      GUserCompanyName: 'استعداد',
      GUserFName: 'علی',
      GUserId_FK: 2,
      GUserLName: 'ابوالحسنی',
      GUserLastLoginDate: '2020-08-11T17:21:44.7447463+04:30',
      GameCode: '01        ',
      GamePlayCDT: '2020-08-04T12:09:33.383',
      GamePlayCorrect: 45,
      GamePlayId: 0,
      GamePlayRank: 0,
      GamePlayScore: 2000,
      GamePlayTime: 20,
      GamePlayTitle: 'بازی 1',
      GamePlayUnCorrect: 2
    };

  return {
    GameId: schema.GameCode,
    GameTitle: schema.GamePlayTitle,
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

  config.serverInfo = { ...parseSchema(res.data) };

  console.log('<<', res.data);

  return config.serverInfo;
};

/**
 * send result to server
 * @param {{correct: number, wrong: number, score: number}} score
 */
export const sendResult = async score => {
  console.log('>>', {
    GUserId_FK: config.serverInfo.playerId,
    GameCode: config.serverInfo.GameId.trim(),
    GamePlayTitle: config.serverInfo.GameTitle,
    GamePlayCorrect: score.correct,
    GamePlayUnCorrect: score.wrong,
    GamePlayScore: score.score
  });

  const res = await Axios.post(
    '/add',
    {
      GUserId_FK: config.serverInfo.playerId,
      GameCode: config.serverInfo.GameId.trim(),
      GamePlayTitle: config.serverInfo.GameTitle,
      GamePlayCorrect: score.correct,
      GamePlayUnCorrect: score.wrong,
      GamePlayScore: score.score
    },
    {
      baseURL: 'https://ebgamesrc.estedadbartar.com/api/figa/game'
    }
  );

  console.log('<<', res.data);

  return res.data;
};

config.serverInfo = {
  ...parseSchema(JSON.parse(localStorage.getItem('GameInfo')))
};
