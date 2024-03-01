// These 2 apps should fail but should not cause testSuite1 to fail.
var undefinedApp = new AppBlock({
  debug: true
});
var nonExistentElApp = new AppBlock({
  el: document.getElementById("iDontExist"),
  debug: true
});
// =================================================================


var testSuite1 = new AppBlock({

  el: document.getElementById('test-suite-1'),

  template: document.getElementById('test-suite-1-template'),

  debug: true,

  renderEngine: 'plain',

  data: {
    testCasesCount: 0,
    testSuccess: 0,
    testError: 0,
    numVal: 1,
    boolVal: true,
    textPlaceholder: "This is a text placeholder.",
    arrayTest: ["one", "two", "three"],
    objectsArray: [
      {name: "one"}, {name: "two"}, {name: "three"}
    ],
    emptyMessage: "",
    falseBool: false,
    zero: 0,
    nullVal: null
  },

  methods: {
    afterRender(app) {
      app.methods.testUtils(app);

      // Iterate over all test-case elements and look for their success messages. If there is not any success message,
      // then convert the test-case to an error message. Also count how many test cases were a success and how many
      // were not.
      app.el.querySelectorAll('.case').forEach(caseEl => {
        app.data.testCasesCount += 1;
        if ( ! caseEl.querySelector('.alert-success') ) {
          caseEl.classList.add("alert", "alert-danger");
          app.data.testError += 1;
        } else {
          app.data.testSuccess += 1;
        }
      });
      // Append the results manually to avoid using AppBlocks in case the functionality does not work.
      app.el.querySelector('.test-results').innerHTML = '<h3>'+app.data.testCasesCount+' total test cases</h3>';
      app.el.querySelector('.test-results').innerHTML += '<span class="text-success">Successfull: '+app.data.testSuccess+'</span>';
      app.el.querySelector('.test-results').innerHTML += '<span class="text-danger">Errors: '+app.data.testError+'</span>';
    },

    numValIsOne(app) {
      return app.data.numVal === 1;
    },

    displayText(app) {
      return app.data.textPlaceholder + "(Display via method)"
    },

    testUtils(app) {
      // Use the build in utilities to get a descendant node append and prepend.
      const sMsg = '<div class="alert alert-success" role="alert"><strong>OK</strong></div>';
      app.utils.appendIn(sMsg, app.utils.getNode('.case > .append'));
      app.utils.prependIn(sMsg, app.utils.getNodes('.case > .prepend')[0]);
    }
  }

});
