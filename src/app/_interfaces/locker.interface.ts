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

