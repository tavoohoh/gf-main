import {
  GColorPickerField,
  GDatePickerField,
  GDivider,
  GFieldCountryCode,
  GFieldFile,
  GFieldValidatorType,
  GFormFields,
  GFormOptions,
  GNumberField,
  GPasswordField,
  GPhoneField,
  GTextField,
  GToggleField
} from '@gs/ng-forms';

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

export const GalleryForm: GFormFields = [
  new GTextField({
    model: 'title',
    label: 'FORM.GALLERY_NAME',
    placeholder: 'FORM.GALLERY_NAME',
    validators: {
      [GFieldValidatorType.REQUIRED]: true
    },
  }),
  new GNumberField({
    model: 'position',
    label: 'FORM.POSITION',
    placeholder: 'FORM.POSITION',
    validators: {
      [GFieldValidatorType.REQUIRED]: true,
      [GFieldValidatorType.MIN]: 1,
      [GFieldValidatorType.MAX]: 300
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
    label: 'FORM.PHONE',
    placeholder: 'FORM.PHONE',
    country: GFieldCountryCode.US,
    validators: {
      [GFieldValidatorType.REQUIRED]: true
    },
    editCountry: false
  }),
  new GTextField({
    model: 'usaEmail',
    label: 'FORM.EMAIL',
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
    label: 'FORM.PHONE',
    placeholder: 'FORM.PHONE',
    country: GFieldCountryCode.VE,
    validators: {
      [GFieldValidatorType.REQUIRED]: true
    },
    editCountry: false
  }),
  new GTextField({
    model: 'venEmail',
    label: 'FORM.EMAIL',
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
  }),
  new GNumberField({
    model: 'position',
    label: 'FORM.POSITION',
    placeholder: 'FORM.POSITION',
    validators: {
      [GFieldValidatorType.REQUIRED]: true,
      [GFieldValidatorType.MIN]: 1,
      [GFieldValidatorType.MAX]: 300
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
  new GTextField({
    model: 'url',
    label: 'FORM.SONG_URL',
    placeholder: 'FORM.SONG_URL',
    value: '',
    validators: {
      [GFieldValidatorType.REQUIRED]: true
    },
  }),
  new GNumberField({
    model: 'position',
    label: 'FORM.POSITION',
    placeholder: 'FORM.POSITION',
    validators: {
      [GFieldValidatorType.REQUIRED]: true,
      [GFieldValidatorType.MIN]: 1,
      [GFieldValidatorType.MAX]: 300
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
  })
];
