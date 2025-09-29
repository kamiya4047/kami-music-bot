import { env } from '@/env';

export const Emoji = env.NODE_ENV == 'production'
  ? {
      Progress: '<:p_:1302566053179687002>',
      ProgressEnd: '<:pe:1302566042194677760>',
      ProgressEndFilled: '<:pfe:1302565973550960740>',
      ProgressEndMiddle: '<:pem:1302565916076277770>',
      ProgressFilled: '<:pf:1302565985215057950>',
      ProgressMiddle: '<:pm:1302565937756766250>',
      ProgressStart: '<:ps:1302566029813350400>',
      ProgressStartFilled: '<:pfs:1302565962687447073>',
      ProgressStartMiddle: '<:psm:1302565891053064212>',
    } as const
  : {
      Progress: '<:p_:1297145558896480266>',
      ProgressEnd: '<:pe:1297145547970580513>',
      ProgressEndFilled: '<:pfe:1297145510783877130>',
      ProgressEndMiddle: '<:pem:1297147707458060369>',
      ProgressFilled: '<:pf:1297145519424012318>',
      ProgressMiddle: '<:pm:1297145462113173549>',
      ProgressStart: '<:ps:1297145534410133514>',
      ProgressStartFilled: '<:pfs:1297145488692351028>',
      ProgressStartMiddle: '<:psm:1297145441258831892>',
    } as const;
