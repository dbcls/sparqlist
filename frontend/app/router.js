import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('login', {path: '/-login'});

  this.route('sparqlets', {path: '/'}, function() {
    this.route('new', {path: '/-new'});
    this.route('show', {path: '/:sparqlet_id'});
    this.route('edit', {path: '/:sparqlet_id/edit'});
  });
});

export default Router;
