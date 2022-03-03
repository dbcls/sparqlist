import Model, { attr } from '@ember-data/model';

export default class Sparqlet extends Model {
  @attr('string') name;
  @attr('string') title;
  @attr('string') html;
  @attr('string') apiPath;
  @attr('string') traceModeApiPath;
  @attr() params;
  @attr('string') src;
  @attr('string') mdPath;
  @attr('string') mtime;
}
