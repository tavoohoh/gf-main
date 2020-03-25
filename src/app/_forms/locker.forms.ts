import {
  GColorPickerField,
  GDatePickerField,
  GDivider,
  GFieldCountryCode,
  GFieldFile,
  GFieldValidatorType,
  GFormFields,
  GFormOptions,
  GPasswordField,
  GPhoneField,
  GTextField,
  GToggleField
} from 'gs-forms';

export const LockerFormOptions: GFormOptions = {
  onErrorDisableSubmit: true,
  layout: {
    columns: 'auto',
    innerPadding: '0'
  },
  context: {
    saveButton: {
      text: 'FORM.SAVE',
      show: true
    }
  }
};

export const AuthForm: GFormFields = [
  new GTextField({
    model: 'email',
    placeholder: 'Email Address',
    validators: {
      [GFieldValidatorType.REQUIRED]: true,
      [GFieldValidatorType.EMAIL]: true
    },
  }),
  new GPasswordField({
    model: 'password',
    placeholder: 'Password',
    validators: {
      [GFieldValidatorType.REQUIRED]: true
    }
  })
];

export const AddGalleryForm: GFormFields = [
  new GTextField({
    model: 'name',
    placeholder: 'FORM.GALLERY_NAME',
    validators: {
      [GFieldValidatorType.REQUIRED]: true
    },
  })
];

export const ContactInfoForm: GFormFields = [
  new GDivider({
    model: 'usa',
    seccionName: 'USA'
  }),
  new GPhoneField({
    model: 'usaPhone',
    placeholder: 'FORM.PHONE',
    validators: {
      [GFieldValidatorType.REQUIRED]: true
    },
    country: GFieldCountryCode.US
  }),
  new GTextField({
    model: 'usaEmail',
    placeholder: 'FORM.EMAIL',
    validators: {
      [GFieldValidatorType.REQUIRED]: true,
      [GFieldValidatorType.EMAIL]: true
    },
  }),
  new GDivider({
    model: 'ven',
    seccionName: 'VEN'
  }),
  new GPhoneField({
    model: 'venPhone',
    placeholder: 'FORM.PHONE',
    validators: {
      [GFieldValidatorType.REQUIRED]: true
    },
    country: GFieldCountryCode.VE
  }),
  new GTextField({
    model: 'venEmail',
    placeholder: 'FORM.EMAIL',
    validators: {
      [GFieldValidatorType.REQUIRED]: true,
      [GFieldValidatorType.EMAIL]: true
    },
  })
];

export const DateForm: GFormFields = [
  new GTextField({
    model: 'title',
    label: 'FORM.TITLE',
    placeholder: 'FORM.TITLE',
    value: '',
    validators: {
      [GFieldValidatorType.REQUIRED]: true
    },
  }),
  new GTextField({
    model: 'location',
    label: 'FORM.LOCATION',
    placeholder: 'FORM.LOCATION',
    value: '',
    validators: {
      [GFieldValidatorType.REQUIRED]: true
    },
  }),
  new GDatePickerField({
    model: 'date',
    label: 'FORM.DATE',
    placeholder: 'FORM.DATE',
    value: '',
    validators: {
      [GFieldValidatorType.REQUIRED]: true
    },
  }),
  new GToggleField({
    model: 'published',
    label: 'FORM.PUBLISH',
    value: false
  })
];

export const VideoForm: GFormFields = [
  new GTextField({
    model: 'title',
    label: 'FORM.TITLE',
    placeholder: 'FORM.TITLE',
    value: '',
    validators: {
      [GFieldValidatorType.REQUIRED]: true
    },
  }),
  new GTextField({
    model: 'url',
    label: 'FORM.YOUTUBE_URL',
    placeholder: 'FORM.YOUTUBE_URL',
    value: '',
    validators: {
      [GFieldValidatorType.REQUIRED]: true
    },
  })
];

export const MusicForm: GFormFields = [
  new GTextField({
    model: 'title',
    label: 'FORM.SONG_TITLE',
    placeholder: 'FORM.SONG_TITLE',
    value: '',
    validators: {
      [GFieldValidatorType.REQUIRED]: true
    },
  }),
  new GTextField({
    model: 'subtitle',
    label: 'FORM.SONG_SUBTITLE',
    placeholder: 'FORM.SONG_SUBTITLE',
    value: '',
    validators: {
      [GFieldValidatorType.REQUIRED]: true
    },
  }),
  new GColorPickerField({
    model: 'backgroundColor',
    label: 'FORM.BACKGROUND_COLOR',
    placeholder: 'FORM.BACKGROUND_COLOR',
    value: '',
    validators: {
      [GFieldValidatorType.REQUIRED]: true
    },
  }),
  new GToggleField({
    model: 'isColorWhite',
    label: 'FORM.WHITE_FONT',
    value: false
  }),
  new GTextField({
    model: 'url',
    label: 'FORM.SONG_URL',
    placeholder: 'FORM.SONG_URL',
    value: '',
    validators: {
      [GFieldValidatorType.REQUIRED]: true
    },
  }),
  new GFieldFile({
    model: 'image',
    label: 'FORM.SONG_IMAGE',
    placeholder: 'FORM.SELECT_SONG_IMAGE',
    returnFile: true,
    accept: '.jpg, .jpeg, .png',
    validators: {
      [GFieldValidatorType.REQUIRED]: true
    },
  })
];
