import { GFormFields, GTextField, GFieldValidatorType } from '@gs/ng-forms';

/**
 * Add gallery form
 */
export const AddGalleryForm: GFormFields = [
  new GTextField({
    model: 'title',
    label: 'FORM.TITLE',
    validators: {
      [GFieldValidatorType.REQUIRED]: true
    }
  })
];
