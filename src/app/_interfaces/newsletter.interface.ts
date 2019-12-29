export enum UserEmailType {
  HTML = 'html',
  TEXT = 'text'
}

export enum UserStatus {
  SUBSCRIBED = 'subscribed',
  UNSUBSCRIBED = 'unsubscribed',
  CLEANED = 'cleaned',
  PENDING = 'pending'
}

export enum UserLanguage {
  en = 'en',
  es = 'es'
}

export interface Member {
  email_address: string;
  email_type: UserEmailType;
  status: UserStatus;
  merge_fields?: object;
  interests?: object;
  language: UserLanguage;
  vip?: boolean;
  location?: {
    latitude?: number;
    longitude?: number;
    gmtoff?: number;
    dstoff?: number;
    country_code?: string;
    timezone?: string;
  };
  ip_signup?: string;
  timestamp_signup?: string;
  ip_opt?: string;
  timestamp_opt?: string;
}
