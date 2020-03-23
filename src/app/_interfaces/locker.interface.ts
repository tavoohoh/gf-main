export interface LockerBio {
  content: string;
}

export interface LockerGallery {
  id: string;
  title: string;
}

export interface LockerGalleryPhotos {
  id: string;
  img: any;
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
  url: string;
  id?: string;
}

export interface LockerMusic {
  title: string;
  subtitle: string;
  backgroundColor: string;
  url: string;
  image?: {
    isImage: boolean;
    type: string;
    name: string;
    path: string | any;
  } | any;
  id?: string;
}
