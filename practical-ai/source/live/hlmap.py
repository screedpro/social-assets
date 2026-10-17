"""Map post code -> HighLevel post id, schedule date, summary, media list."""
import json
S = '/tmp/claude-0/-home-claude/d5fc16b7-4214-57a9-b3a8-f527a65ea3e2/scratchpad'
W1 = ['GS01', 'JB01', 'GS02', 'GS03', 'AC01', 'GS04', 'WW01', 'JB02', 'AA01', 'GS05', 'GS06', 'RC01', 'GS07', 'JB03', 'GS08', 'SM01', 'AC02', 'GS09', 'GS10', 'SD01', 'JB04']
def load():
    m = {}
    for code, b in zip(W1, json.load(open(S + '/pause_bodies.json'))):
        m[code] = {'id': b['id'], 'date': b['utc'] + ':00.000Z', 'summary': b['summary'], 'media': b['media']}
    for code, pid, body in json.load(open(S + '/gen/sched_rest.json')):
        m[code] = {'id': pid, 'date': body['scheduleDate'], 'summary': body['summary'], 'media': body['media']}
    return m
if __name__ == '__main__':
    m = load(); print(len(m)); print(m['JB01']['id'], m['JB01']['date'], len(m['JB01']['media']), m['JB01']['summary'][:60])
