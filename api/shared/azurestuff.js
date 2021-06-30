
var azure = require('azure-storage');
const dotenv = require('dotenv');
dotenv.config();

function generateSasToken(context, container, blobName, permissions) {
  console.log('GEn SasTokein Init');
  var connString = process.env.BLOB_STORAGE_CS;
  var blobService = azure.createBlobService(connString);
  const addedMin = 60;
  const moreLessMin = 5;
  let orgStartDate;
  let retStartDate;

  // Create a SAS token that expires in an hour
  // Set start time to five minutes ago to avoid clock skew.
  orgStartDate = new Date();
  let startDate = new Date(orgStartDate);
  startDate.setMinutes(startDate.getMinutes() - 60);
  let expiryDate = new Date(startDate);
  expiryDate.setMinutes(startDate.getMinutes() + (addedMin + moreLessMin) );
  retStartDate = new Date(orgStartDate);
  retStartDate.setMinutes(retStartDate.getMinutes() + (addedMin) );

  permissions = permissions || azure.BlobUtilities.SharedAccessPermissions.READ;

  var sharedAccessPolicy = {
    AccessPolicy: {
      Permissions: permissions,
      Start: startDate,
      Expiry: expiryDate
    }
  };

  console.log('Generating sas token');
  let sasToken = blobService.generateSharedAccessSignature(container, blobName, sharedAccessPolicy);
  console.log(sasToken);
  console.log('returning...');
  return {
    token: sasToken,
    uri: blobService.getUrl(container, blobName, sasToken, true),
    startDate: orgStartDate,
    expiryDate: retStartDate
  };
}

module.exports = {
  generateSasToken: generateSasToken
};


