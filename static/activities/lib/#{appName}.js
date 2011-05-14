(function() {
  var activitiesApp, confirmationDialog, loadingIndicator;
  loadingIndicator = new LoadingIndicator;
  confirmationDialog = new ConfirmationDialog;
  activitiesApp = new ActivitiesView;
  activitiesApp.setWidgets();
  activitiesApp.setListeners();
  activitiesApp.fetch();
}).call(this);
