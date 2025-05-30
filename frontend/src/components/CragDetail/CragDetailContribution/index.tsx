import { useContext } from 'react';

import { CragDetailContext } from '../index.context';

import { Box, Typography } from '@mui/material';

import { useModifyProfile } from '@/hooks';

type ContributionUserCount = {
  user: Crag['gymUserContributions'][number]['user'];
  count: number;
};

export function CragDetailContribution() {
  const { crag } = useContext(CragDetailContext);

  const { updateSelectUserId } = useModifyProfile();

  const contributionNameToUserToCnt = (() => {
    const nameToUser = new Map<string, Map<string, ContributionUserCount>>();

    crag?.gymUserContributions.forEach(({ contribution, user }) => {
      const userToCnt = nameToUser.get(contribution.name) || new Map<string, ContributionUserCount>();

      const uniqueUsername = `${user.username}#${user.id.slice(0, 6)}`;

      const tmp = userToCnt.get(uniqueUsername) || { user, count: 0 };

      tmp.count += 1;

      userToCnt.set(uniqueUsername, tmp);

      nameToUser.set(contribution.name, userToCnt);
    });

    return nameToUser;
  })();

  return (
    <Box>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        기여자
      </Typography>

      {contributionNameToUserToCnt.size === 0 ? (
        <Typography>(´・ω・`) 아직 아무도 암장 정보를 남기지 않았어요.</Typography>
      ) : (
        <ul>
          {Array.from(contributionNameToUserToCnt.entries()).map(([contributionName, userToCnt]) => {
            return (
              <li>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    columnGap: 1,
                  }}
                >
                  <Typography variant="body1">{contributionName}: </Typography>

                  {Array.from(userToCnt.entries()).map(([_, value]) => (
                    <Typography
                      sx={{
                        cursor: 'pointer',
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                      onClick={() => {
                        updateSelectUserId(value.user.id);
                      }}
                    >
                      {value.user.username}
                      <Typography component="span" sx={(theme) => ({ color: theme.palette.text.secondary })}>
                        {`#${value.user.id.slice(0, 6)}`}
                      </Typography>
                      {value.count > 1 && (
                        <Typography
                          component="span"
                          sx={(theme) => ({ color: theme.palette.primary.main })}
                        >{` x${value.count}`}</Typography>
                      )}
                    </Typography>
                  ))}
                </Box>
              </li>
            );
          })}
        </ul>
      )}
    </Box>
  );
}
