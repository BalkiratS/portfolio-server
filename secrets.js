const {
    SecretsManagerClient,
    GetSecretValueCommand,
  } = require("@aws-sdk/client-secrets-manager")

  
  const secretManager = new SecretsManagerClient();
  
  let response;

  const getSecret = async (secret_name) => {
        try {
            response = await secretManager.send(
            new GetSecretValueCommand({
                SecretId: secret_name,
                VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
            })
            );
            return JSON.parse(response.SecretString)
        } catch (error) {
            throw error;
        }
  }
  

  module.exports = getSecret;