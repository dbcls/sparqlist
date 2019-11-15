import EmberRouter from '@ember/routing/router';
import config from './config/environment';
import classic from 'ember-classic-decorator';

@classic
export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function() {
  this.route('login', {path: '/-login'});

  this.route('sparqlets', {path: '/'}, function() {
    this.route('new', {path: '/-new'});
    this.route('show', {path: '/:sparqlet_id'});
    this.route('edit', {path: '/:sparqlet_id/edit'});
  });
});
