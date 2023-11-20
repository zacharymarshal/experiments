const fs = require("fs/promises");
const eSignSdk = require("docusign-esign");

const basePath = process.env.DOCUSIGN_BASE_PATH;
const oAuthBasePath = process.env.DOCUSIGN_OAUTH_BASE_PATH;
const userId = process.env.DOCUSIGN_USER_ID;
const accountId = process.env.DOCUSIGN_ACCOUNT_ID;
const integrationKey = process.env.DOCUSIGN_INTEGRATION_KEY;
const scopes = ["signature"];
const rsaKey = process.env.DOCUSIGN_PRIVATE_KEY.replace(/\\n/g, "\n");
const jwtLifeSec = 3600; // 1 hour

const getToken = async () => {
  const eSignApi = new eSignSdk.ApiClient();
  eSignApi.setOAuthBasePath(oAuthBasePath);

  try {
    const results = await eSignApi.requestJWTUserToken(
      integrationKey,
      userId,
      scopes,
      rsaKey,
      jwtLifeSec
    );

    return results.body.access_token;
  } catch (err) {
    console.log(err);
    console.error(`Error getting token ${err}`);
  }
};

const makeEnvelope = async ({
  docFile,
  docName,
  signerEmail,
  signerName,
  signerClientId,
}) => {
  const docPdfBytes = await fs.readFile(docFile);
  const docPdfBase64 = docPdfBytes.toString("base64");

  const doc = new eSignSdk.Document.constructFromObject({
    documentBase64: docPdfBase64,
    name: docName,
    fileExtension: "pdf",
    documentId: "1",
  });

  const initialHere = eSignSdk.InitialHere.constructFromObject({
    recipientId: "1",
    documentId: "1",
    pageNumber: "1",
    tabLabel: "initialHere",
    xPosition: "490",
    yPosition: "620",
  });
  const signHere = eSignSdk.SignHere.constructFromObject({
    recipientId: "1",
    documentId: "1",
    pageNumber: "3",
    tabLabel: "signHere",
    xPosition: "80",
    yPosition: "355",
  });
  const dateSigned = eSignSdk.DateSigned.constructFromObject({
    recipientId: "1",
    documentId: "1",
    pageNumber: "3",
    tabLabel: "dateSigned",
    xPosition: "110",
    yPosition: "435",
  });

  const signer = eSignSdk.Signer.constructFromObject({
    email: signerEmail,
    name: signerName,
    recipientId: "1",
    routingOrder: "1",
    clientUserId: signerClientId,
    tabs: {
      signHereTabs: [signHere],
      initialHereTabs: [initialHere],
      dateSignedTabs: [dateSigned],
    },
  });

  const recipients = eSignSdk.Recipients.constructFromObject({
    signers: [signer],
  });

  return eSignSdk.EnvelopeDefinition.constructFromObject({
    emailSubject: "Please sign this document sent from Node SDK",
    documents: [doc],
    recipients: recipients,
    status: "sent",
  });
};

const sendEnvelope = async ({
  envelopeDefinition,
  basePath,
  accessToken,
  accountId,
}) => {
  const eSignApi = new eSignSdk.ApiClient();
  eSignApi.setBasePath(basePath);
  eSignApi.addDefaultHeader("Authorization", "Bearer " + accessToken);

  const envelopesApi = new eSignSdk.EnvelopesApi(eSignApi);

  const results = await envelopesApi.createEnvelope(accountId, {
    envelopeDefinition,
  });

  return results.envelopeId;
};

const getRecipientViewUrl = async ({
  basePath,
  accessToken,
  accountId,
  envelopeId,
  signerClientId,
  signerName,
  signerEmail,
  returnUrl,
  pingUrl,
}) => {
  let eSignApi = new eSignSdk.ApiClient();
  eSignApi.setBasePath(basePath);
  eSignApi.addDefaultHeader("Authorization", "Bearer " + accessToken);
  let envelopesApi = new eSignSdk.EnvelopesApi(eSignApi);

  const viewRequest = new eSignSdk.RecipientViewRequest.constructFromObject({
    authenticationMethod: "none",
    clientUserId: signerClientId,
    recipientId: "1",
    returnUrl: returnUrl,
    userName: signerName,
    email: signerEmail,
    pingFrequency: "600",
    pingUrl: pingUrl,
  });

  const recipientView = await envelopesApi.createRecipientView(
    accountId,
    envelopeId,
    {
      recipientViewRequest: viewRequest,
    }
  );

  return recipientView.url;
};

const createSigningUrl = async ({
  signerEmail,
  signerName,
  signerClientId,
  docFile,
  docName,
  returnUrl,
  pingUrl,
}) => {
  const envelopeDefinition = await makeEnvelope({
    signerEmail,
    signerName,
    status: "sent",
    docFile,
    docName,
    signerClientId,
  });

  const accessToken = await getToken();
  const envelopeId = await sendEnvelope({
    envelopeDefinition,
    basePath,
    accessToken,
    accountId,
  });

  // add envelopeId to returnUrl
  returnUrl.searchParams.append("envelopeId", envelopeId);

  const recipientViewUrl = await getRecipientViewUrl({
    basePath,
    accessToken,
    accountId,
    envelopeId,
    signerClientId,
    returnUrl,
    pingUrl,
    signerName,
    signerEmail,
  });

  return recipientViewUrl;
};

module.exports = {
  createSigningUrl,
};
