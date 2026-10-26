import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';

async function loadTypeScript(path) {
  const source = await readFile(new URL(path, import.meta.url), 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  });
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
}

const matchState = await loadTypeScript('../src/lib/match-state.ts');
const resourceState = await loadTypeScript('../src/lib/resource-state.ts');
const now = new Date('2026-10-24T12:00:00.000Z');

function match(status, date = '2026-10-25T12:00:00.000Z') {
  return { id: 'match-1', homeTeam: 'NFC', awayTeam: 'Adversaire', status, date };
}

test('match state identifies future, live, past pending and final statuses', () => {
  assert.equal(matchState.getMatchState(match('PROGRAMME'), now), 'UPCOMING');
  assert.equal(matchState.getMatchState(match('EN_COURS', '2026-10-24T11:00:00.000Z'), now), 'LIVE');
  assert.equal(matchState.getMatchState(match('PROGRAMME', '2026-10-24T11:00:00.000Z'), now), 'AWAITING_RESULT');
  assert.equal(matchState.getMatchState(match('REPORTE'), now), 'POSTPONED');
  assert.equal(matchState.getMatchState(match('ANNULE'), now), 'CANCELLED');
  assert.equal(matchState.getMatchState(match('TERMINE'), now), 'FINISHED');
  assert.equal(matchState.getMatchState(null, now), null);
});

test('next match ignores past and non-programmed matches', () => {
  const next = match('PROGRAMME', '2026-10-26T12:00:00.000Z');
  assert.equal(matchState.getNextMatch([
    match('PROGRAMME', '2026-10-23T12:00:00.000Z'),
    match('EN_COURS'),
    next,
    match('PROGRAMME', '2026-10-27T12:00:00.000Z'),
  ], now), next);
  assert.equal(matchState.getNextMatch([], now), null);
});

test('standing consistency checks played, points and goal difference', () => {
  const consistent = {
    played: 5, won: 3, drawn: 1, lost: 1, goalsFor: 8, goalsAgainst: 5,
    goalDifference: 3, points: 10,
  };
  assert.equal(matchState.isStandingConsistent(consistent), true);
  assert.equal(matchState.isStandingConsistent({ ...consistent, played: 4 }), false);
  assert.equal(matchState.isStandingConsistent({ ...consistent, points: 9 }), false);
  assert.equal(matchState.isStandingConsistent({ ...consistent, goalDifference: 4 }), false);
});

test('ordinal, goal difference and data freshness labels are correct', () => {
  assert.equal(matchState.getOrdinalFr(1), '1er');
  assert.equal(matchState.getOrdinalFr(2), '2e');
  assert.equal(matchState.getOrdinalFr(3), '3e');
  assert.equal(matchState.getGoalDifferenceLabel(22), '+22');
  assert.equal(matchState.getGoalDifferenceLabel(-3), '−3');
  assert.equal(matchState.getGoalDifferenceLabel(0), '0');
  assert.equal(resourceState.isDataStale('2026-10-24T10:00:00.000Z', 60_000, now.getTime()), true);
  assert.equal(resourceState.isDataStale('2026-10-24T11:59:30.000Z', 60_000, now.getTime()), false);
});

test('all DataState statuses map to the intended UI branch', () => {
  assert.equal(resourceState.getResourceView('loading'), 'skeleton');
  assert.equal(resourceState.getResourceView('error'), 'error');
  assert.equal(resourceState.getResourceView('empty'), 'empty');
  assert.equal(resourceState.getResourceView('ok'), 'content');
  assert.equal(resourceState.getResourceView('stale'), 'content');
  assert.equal(resourceState.getResourceView('partial'), 'content');
});
