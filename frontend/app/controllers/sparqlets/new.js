import Controller from '@ember/controller';

export default class NewController extends Controller {
  queryParams = ['forkFrom'];
  forkFrom    = null;
}
