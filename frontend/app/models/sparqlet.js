import Model, { attr } from '@ember-data/model';

export default Model.extend({
  name:             attr('string'),
  title:            attr('string'),
  html:             attr('string'),
  apiPath:          attr('string'),
  traceModeApiPath: attr('string'),
  params:           attr(),
  src:              attr('string'),
  mdPath:           attr('string'),
  mtime:            attr('string'),
});
