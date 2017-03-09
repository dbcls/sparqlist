import DS from 'ember-data';

export default DS.Model.extend({
  name:             DS.attr('string'),
  title:            DS.attr('string'),
  html:             DS.attr('string'),
  apiPath:          DS.attr('string'),
  traceModeApiPath: DS.attr('string'),
  params:           DS.attr(),
  src:              DS.attr('string'),
  mdPath:           DS.attr('string'),
});
