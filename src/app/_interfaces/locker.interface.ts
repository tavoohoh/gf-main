export interface LockerBio {
  content: string;
}

export interface LockerGallery {
  title: string;
  position?: number;
  id?: string;
}

export interface LockerGalleryPhoto {
  img: any;
  position: number;
  id?: string;
  src?: string;
}

export interface LockerPhoneModel {
  alpha2Code: string;
  code: string;
  phone: string;
}

export interface LockerContactInfo {
  usaPhone: LockerPhoneModel;
  venPhone: LockerPhoneModel;
  usaEmail: string;
  venEmail: string;
}

export interface LockerDate {
  title: string;
  location: string;
  published: boolean;
  date: string;
  id?: string;
}

export interface LockerVideo {
  title: string;
  url: any;
  position: number;
  id?: string;
}

export interface LockerMusic {
  title: string;
  subtitle: string;
  isColorWhite: boolean;
  backgroundColor: string;
  url: string;
  position: number;
  image?: {
    isImage: boolean;
    type: string;
    name: string;
    path: string | any;
  } | any;
  id?: string;
}
