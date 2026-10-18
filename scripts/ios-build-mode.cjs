// A signing certificate in the keychain is not enough to export an IPA.
// cordova-ios exports only when `--device` is set, and that export needs a
// Team ID plus a provisioning profile. A Personal Team certificate fails that
// export. Unsigned archive is the path until build.json has a real Team ID.

function isUsableTeamId(team) {
  return typeof team === 'string' && /^[A-Z0-9]{10}$/.test(team);
}

function chooseIosBuild({ hasSigningIdentity, developmentTeam }) {
  if (hasSigningIdentity && isUsableTeamId(developmentTeam)) {
    return 'signed-export';
  }
  return 'unsigned-archive';
}

module.exports = { isUsableTeamId, chooseIosBuild };
