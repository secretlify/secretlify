import { getOurEnv, OurEnv } from '../types/our-env.enum';
require('dotenv').config();

interface EnvConfig {
  oauth: {
    github: {
      clientId: string;
      clientSecret: string;
      clientIdAlternative?: string;
      clientSecretAlternative?: string;
    };
    google: {
      clientId: string;
      clientSecret: string;
      redirectUri: string;
      redirectUriAlternative: string;
    };
  };
  mongo: {
    url: string;
  };
  auth: {
    jwtSecret: string;
  };
  logdash: {
    apiKey: string;
  };
}

interface EnvConfigs {
  [OurEnv.Prod]: EnvConfig;
  [OurEnv.Dev]: EnvConfig;
}

export const EnvConfigs: EnvConfigs = {
  [OurEnv.Prod]: {
    oauth: {
      github: {
        clientId: process.env.BACKEND_GITHUB_CLIENT_ID!,
        clientSecret: process.env.BACKEND_GITHUB_CLIENT_SECRET!,
        clientIdAlternative: process.env.BACKEND_GITHUB_CLIENT_ID_ALTERNATIVE!,
        clientSecretAlternative: process.env.BACKEND_GITHUB_CLIENT_SECRET_ALTERNATIVE!,
      },
      google: {
        clientId: process.env.BACKEND_GOOGLE_CLIENT_ID!,
        clientSecret: process.env.BACKEND_GOOGLE_CLIENT_SECRET!,
        redirectUri: process.env.BACKEND_GOOGLE_REDIRECT_URI!,
        redirectUriAlternative: process.env.BACKEND_GOOGLE_REDIRECT_URI_ALTERNATIVE!,
      },
    },
    mongo: {
      url: process.env.BACKEND_MONGO_URL!,
    },
    auth: {
      jwtSecret: process.env.BACKEND_JWT_SECRET!,
    },
    logdash: {
      apiKey: process.env.BACKEND_LOGDASH_API_KEY!,
    },
  },
  [OurEnv.Dev]: {
    oauth: {
      github: {
        clientId: process.env.BACKEND_GITHUB_CLIENT_ID!,
        clientSecret: process.env.BACKEND_GITHUB_CLIENT_SECRET!,
        clientIdAlternative: process.env.BACKEND_GITHUB_CLIENT_ID_ALTERNATIVE!,
        clientSecretAlternative: process.env.BACKEND_GITHUB_CLIENT_SECRET_ALTERNATIVE!,
      },
      google: {
        clientId: process.env.BACKEND_GOOGLE_CLIENT_ID!,
        clientSecret: process.env.BACKEND_GOOGLE_CLIENT_SECRET!,
        redirectUri: process.env.BACKEND_GOOGLE_REDIRECT_URI!,
        redirectUriAlternative: process.env.BACKEND_GOOGLE_REDIRECT_URI_ALTERNATIVE!,
      },
    },
    mongo: {
      url: process.env.BACKEND_MONGO_URL!,
    },
    auth: {
      jwtSecret: process.env.BACKEND_JWT_SECRET!,
    },
    logdash: {
      apiKey: process.env.BACKEND_LOGDASH_API_KEY!,
    },
  },
};

export function getEnvConfig(): EnvConfig {
  const env = getOurEnv();
  return EnvConfigs[env];
}
