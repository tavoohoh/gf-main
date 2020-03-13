import {
  GTextField,
  GPasswordField,
  GFormFields,
  GFieldValidatorType,
  GFormOptions,
  GPhoneField,
  GFieldCountryCode,
  GDivider
} from 'gs-forms';

export const LockerFormOptions: GFormOptions = {
  onErrorDisableSubmit: true,
  layout: {
    columns: 'repeat(2, 1fr)',
    innerPadding: '0'
  },
  context: {
    saveButton: {
      text: 'Submit',
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
