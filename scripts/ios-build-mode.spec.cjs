const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { chooseIosBuild } = require('./ios-build-mode.cjs');

describe('chooseIosBuild', () => {
  it('archives without export when a cert exists but build.json has no Team ID', () => {
    assert.equal(
      chooseIosBuild({ hasSigningIdentity: true, developmentTeam: '' }),
      'unsigned-archive',
    );
  });

  it('archives without export when the Team ID is still the example placeholder', () => {
    assert.equal(
      chooseIosBuild({
        hasSigningIdentity: true,
        developmentTeam: '<TEAM_ID>',
      }),
      'unsigned-archive',
    );
  });

  it('archives without export when the keychain has no signing identity', () => {
    assert.equal(
      chooseIosBuild({
        hasSigningIdentity: false,
        developmentTeam: 'ABCDE12345',
      }),
      'unsigned-archive',
    );
  });

  it('exports a signed IPA only when a cert and a 10-character Team ID are both present', () => {
    assert.equal(
      chooseIosBuild({
        hasSigningIdentity: true,
        developmentTeam: 'ABCDE12345',
      }),
      'signed-export',
    );
  });
});
