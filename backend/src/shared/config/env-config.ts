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
  posthog: {
    apiKey: string;
    host: string;
    sampleRate: number;
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
        clientId: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        clientIdAlternative: process.env.GITHUB_CLIENT_ID_ALTERNATIVE!,
        clientSecretAlternative: process.env.GITHUB_CLIENT_SECRET_ALTERNATIVE!,
      },
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        redirectUri: process.env.GOOGLE_REDIRECT_URI!,
        redirectUriAlternative: process.env.GOOGLE_REDIRECT_URI_ALTERNATIVE!,
      },
    },
    mongo: {
      url: process.env.MONGO_URL!,
    },
    auth: {
      jwtSecret: process.env.JWT_SECRET!,
    },
    logdash: {
      apiKey: process.env.LOGDASH_API_KEY!,
    },
    posthog: {
      apiKey: process.env.POSTHOG_API_KEY!,
      host: process.env.POSTHOG_HOST!,
      sampleRate: parseFloat(process.env.POSTHOG_SAMPLE_RATE!),
    },
  },
  [OurEnv.Dev]: {
    oauth: {
      github: {
        clientId: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        clientIdAlternative: process.env.GITHUB_CLIENT_ID_ALTERNATIVE!,
        clientSecretAlternative: process.env.GITHUB_CLIENT_SECRET_ALTERNATIVE!,
      },
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        redirectUri: process.env.GOOGLE_REDIRECT_URI!,
        redirectUriAlternative: process.env.GOOGLE_REDIRECT_URI_ALTERNATIVE!,
      },
    },
    mongo: {
      url: process.env.MONGO_URL!,
    },
    auth: {
      jwtSecret: process.env.JWT_SECRET!,
    },
    logdash: {
      apiKey: process.env.LOGDASH_API_KEY!,
    },
    posthog: {
      apiKey: process.env.POSTHOG_API_KEY!,
      host: process.env.POSTHOG_HOST!,
      sampleRate: parseFloat(process.env.POSTHOG_SAMPLE_RATE!),
    },
  },
};

export function getEnvConfig(): EnvConfig {
  const env = getOurEnv();
  return EnvConfigs[env];
}
